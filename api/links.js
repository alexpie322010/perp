import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get all keys from list
  const keys = await redis.lrange("submissions", 0, -1);

  // Resolve values (filtering out expired automatically)
  const links = [];
  for (const key of keys) {
    const val = await redis.get(key);
    if (val) links.push(val);
  }

  res.status(200).json(links);
}
