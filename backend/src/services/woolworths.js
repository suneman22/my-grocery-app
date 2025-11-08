// backend/services/woolworths.js
const axios = require('axios');

async function searchWoolworths(q, env) {
  if (!env.WOOLWORTHS_SEARCH_URL) return [];
  const url = env.WOOLWORTHS_SEARCH_URL.replace('{q}', encodeURIComponent(q));
  const headers = {
    'X-RapidAPI-Key': env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': env.WOOLWORTHS_HOST
  };
  const resp = await axios.get(url, { headers, timeout: 15000 });
  const raw = resp.data;
  const items = [];
  if (Array.isArray(raw) && raw.length) {
    raw.forEach(p => items.push({
      name: p.name || p.productName || '',
      price: p.price || p.sellingPrice || null,
      size: p.size || '',
      url: p.url || p.productUrl || '',
      raw: p
    }));
  } else if (raw.Data && Array.isArray(raw.Data)) {
    raw.Data.forEach(p => items.push({
      name: p.ProductName || p.Name || '',
      price: p.Price || p.SellPrice || null,
      size: p.Size || '',
      url: p.ProductUrl || '',
      raw: p
    }));
  } else {
    items.push({ name: q, price: raw.price || null, raw });
  }
  return { store: 'Woolworths', items };
}

module.exports = { searchWoolworths };
