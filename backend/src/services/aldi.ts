import axios from "axios";

export async function searchAldi(
  q: string,
  env: Record<string, string>
) {
  if (!env.ALDI_SEARCH_URL) return [];

  const url = env.ALDI_SEARCH_URL.replace("{q}", encodeURIComponent(q));

  const headers = {
    "X-RapidAPI-Key": env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": env.ALDI_HOST,
  };

  const resp = await axios.get(url, { headers, timeout: 15000 });
  const raw = resp.data;

  const items: any[] = [];

  // Format varies depending on API structure
  if (Array.isArray(raw) && raw.length) {
    raw.forEach((p: any) =>
      items.push({
        name: p.name || p.productName || "",
        price: p.price || p.sellingPrice || null,
        size: p.size || "",
        url: p.url || p.productUrl || "",
        raw: p,
      })
    );
  } else if (raw.products && Array.isArray(raw.products)) {
    raw.products.forEach((p: any) =>
      items.push({
        name: p.name || "",
        price: p.price || null,
        size: p.size || "",
        url: p.url || "",
        raw: p,
      })
    );
  } else {
    items.push({
      name: q,
      price: raw.price || null,
      raw,
    });
  }

  return {
    store: "Aldi",
    items,
  };
}
