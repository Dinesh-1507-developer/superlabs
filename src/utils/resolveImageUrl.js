// Kommodo share links (kommodo.ai/i/xxx) are HTML pages, not image files.
// This fetches the page and reads the direct image URL from og:image meta tag.

async function resolveImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null;
  }

  const url = imageUrl.trim();
  if (!url) return null;

  // only resolve kommodo share pages
  if (!url.includes('kommodo.ai/i/')) {
    return url;
  }

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const html = await response.text();
    const match = html.match(/property="og:image"\s+content="([^"]+)"/i);

    if (match && match[1]) {
      return match[1];
    }
  } catch (err) {
    console.log('resolveImageUrl failed:', err.message);
  }

  return url;
}

module.exports = { resolveImageUrl };
