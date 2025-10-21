async function getLinks() {
  const res = await fetch("/api/links");
  return res.json();
}

async function handleRedirect() {
  const links = await getLinks();
  const roll = Math.random();

  if (roll < 0.33 || links.length === 0) {
    window.location.href = "https://pplx.ai/ydholdings79564";
  } else {
    const choice = Math.floor(Math.random() * links.length);
    window.location.href = links[choice];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cometBtn = document.getElementById("cometBtn");
  const submitBtn = document.getElementById("submitBtn");
  const submitLink = document.getElementById("submitLink");

  if (cometBtn) {
    cometBtn.addEventListener("click", handleRedirect);
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      window.location.href = "submit.html";
    });
  }

  if (submitLink) {
    submitLink.addEventListener("click", async () => {
      const linkInput = document.getElementById("linkInput");
      const link = linkInput.value.trim();

      if (!link.startsWith("https://pplx.ai")) {
        alert("Link must be a pplx.ai URL.");
        return;
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link })
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Submission saved!");
        window.location.href = "index.html";
      }
    });
  }
});
