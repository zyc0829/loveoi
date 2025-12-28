console.log("✅ common.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("📄 DOM ready");

  try {
    const res = await fetch("/api/content/week");
    const text = await res.text();
    const data = JSON.parse(text);

    console.log("📦 content", data);

    document.dispatchEvent(
      new CustomEvent("content-loaded", { detail: data })
    );
  } catch (e) {
    console.error("❌ load failed", e);
  }
});
