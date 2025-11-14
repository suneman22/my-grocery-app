import axios from "axios";

export async function searchWoolworths(
  q: string,
  env: Record<string, string>
) {
  if (!env.WOOLWORTHS_SEARCH_URL) return [];

  const url = env.WOOLWORTHS_SEARCH_URL.replace("{q}", encodeURIComponent(q));

  const headers = {
    "X-RapidAPI-Key": env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": env.WOOLWORTHS_HOST,
  };

  const resp = await axios.get(url, { headers, timeout: 15000 });
  const raw = resp.data;

  const items: any[] = [];

  // Case 1: API returns a simple array
  if (Array.isArray(raw) && raw.length > 0) {
    raw.forEach((p: any) =>
      items.push({
        name: p.name || p.productName || "",
        price: p.price || p.sellingPrice || null,
        size: p.size || "",
        url: p.url || p.productUrl || "",
        raw: p,
      })
    );
  }

  // Case 2: API returns { Data: [...] }
  else if (raw.Data && Array.isArray(raw.Data)) {
    raw.Data.forEach((p: any) =>
      items.push({
        name: p.ProductName || p.Name || "",
        price: p.Price || p.SellPrice || null,
        size: p.Size || "",
        url: p.ProductUrl || "",
        raw: p,
      })
    );
  }

  // Fallback
  else {
    items.push({
      name: q,
      price: raw.price || null,
      raw,
    });
  }

  return {
    store: "Woolworths",
    items,
  };
}
