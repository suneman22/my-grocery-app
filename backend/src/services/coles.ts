import axios from "axios";

export async function searchColes(
  q: string,
  env: Record<string, string>
) {
  if (!env.COLES_SEARCH_URL) return [];

  const url = env.COLES_SEARCH_URL.replace("{q}", encodeURIComponent(q));

  const headers = {
    "X-RapidAPI-Key": env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": env.COLES_HOST,
  };

  const resp = await axios.get(url, { headers, timeout: 15000 });
  const raw = resp.data;

  const items: any[] = [];

  // Case 1: API returns array
  if (Array.isArray(raw) && raw.length > 0) {
    raw.forEach((p: any) => {
      items.push({
        name: p.name || p.productName || p.title || "",
        price: p.price || p.currentPrice || p.retail_price || null,
        size: p.size || p.unit || "",
        url: p.url || p.productUrl || "",
        raw: p,
      });
    });
  }

  // Case 2: API returns { products: [...] }
  else if (raw.products && Array.isArray(raw.products)) {
    raw.products.forEach((p: any) => {
      items.push({
        name: p.name || p.productName || "",
        price: p.price || p.sellingPrice || null,
        size: p.size || "",
        url: p.url || p.productUrl || "",
        raw: p,
      });
    });
  }

  // Fallback: unknown structure
  else {
    items.push({
      name: q,
      price: raw.price || null,
      raw,
    });
  }

  return {
    store: "Coles",
    items,
  };
}
