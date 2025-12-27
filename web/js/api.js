async function getContent() {
  const res = await fetch("http://loveoi.top:3000/api/content");
  if (!res.ok) {
    throw new Error("API error");
  }
  return await res.json();
}
