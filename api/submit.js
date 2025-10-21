import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { link } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();

  if (!link.startsWith("https://pplx.ai")) {
    return res.status(400).json({ error: "Must be a pplx.ai link" });
  }

  // Check 3h cooldown
  const cooldownKey = `cooldown:${ip}`;
  const last = await redis.get(cooldownKey);
  if (last) {
    return res.status(429).json({ error: "Cooldown active" });
  }

  // Save submission with unique key (auto-expire in 1h)
  const key = `submission:${now}:${Math.random()}`;
  await redis.set(key, link, { ex: 3600 }); // 1h TTL

  // Add key to global list
  await redis.rpush("submissions", key);

  // Set cooldown (3h)
  await redis.set(cooldownKey, now, { ex: 60 * 60 * 3 });

  return res.status(200).json({ success: true });
}
