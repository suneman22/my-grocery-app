// backend/services/coles.js
const axios = require('axios');

async function searchColes(q, env) {
  if (!env.COLES_SEARCH_URL) return [];
  const url = env.COLES_SEARCH_URL.replace('{q}', encodeURIComponent(q));
  const headers = {
    'X-RapidAPI-Key': env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': env.COLES_HOST
  };
  const resp = await axios.get(url, { headers, timeout: 15000 });
  // The exact path of price data depends on the API response.
  // Return generic format: { store: 'Coles', items: [{name, price, size, url, raw}] }
  const raw = resp.data;
  // Try to map a few common shapes — adjust after inspecting actual response
  const items = [];
  if (Array.isArray(raw) && raw.length) {
    // If API returns list
    raw.forEach(p => {
      items.push({
        name: p.name || p.productName || p.title || '',
        price: (p.price || p.currentPrice || p.retail_price || null),
        size: p.size || p.unit || '',
        url: p.url || p.productUrl || '',
        raw: p
      });
    });
  } else if (raw.products && Array.isArray(raw.products)) {
    raw.products.forEach(p => {
      items.push({
        name: p.name || p.productName || '',
        price: p.price || p.sellingPrice || null,
        size: p.size || '',
        url: p.url || p.productUrl || '',
        raw: p
      });
    });
  } else {
    // fallback: include full raw in one item
    items.push({ name: q, price: raw.price || null, raw });
  }
  return { store: 'Coles', items };
}

module.exports = { searchColes };
