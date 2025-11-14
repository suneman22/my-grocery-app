import axios from "axios";

const API_KEYS = {
  coles: "631949197amsh7380372fd8dd5eap1e6264jsnd288f1eecf02",
  woolworths: "631949197amsh7380372fd8dd5eap1e6264jsnd288f1eecf02",
  aldi: "631949197amsh7380372fd8dd5eap1e6264jsnd288f1eecf02",
  iga: "631949197amsh7380372fd8dd5eap1e6264jsnd288f1eecf02",
};

export async function fetchPrice(product: string, store: string): Promise<string> {
  try {
    let url = "";
    let headers = {};
    let params = {};

    switch (store) {
      case "coles":
        url = "https://coles-product-price-api.p.rapidapi.com/coles/product-search/";
        headers = {
          "X-RapidAPI-Key": API_KEYS.coles,
          "X-RapidAPI-Host": "coles-product-price-api.p.rapidapi.com",
        };
        params = { query: product };
        break;

      case "woolworths":
        url = "https://woolworths-products-api.p.rapidapi.com/woolworths/product-search/";
        headers = {
          "X-RapidAPI-Key": API_KEYS.woolworths,
          "X-RapidAPI-Host": "woolworths-products-api.p.rapidapi.com",
        };
        params = { query: product };
        break;

      case "aldi":
        url = "https://aldi-supermarket-scraper-api.p.rapidapi.com/search";
        headers = {
          "X-RapidAPI-Key": API_KEYS.aldi,
          "X-RapidAPI-Host": "aldi-supermarket-scraper-api.p.rapidapi.com",
        };
        params = { keyword: product };
        break;

      case "iga":
        url = "https://iga-supermarket-scraper-api.p.rapidapi.com/search";
        headers = {
          "X-RapidAPI-Key": API_KEYS.iga,
          "X-RapidAPI-Host": "iga-supermarket-scraper-api.p.rapidapi.com",
        };
        params = { q: product };
        break;

      default:
        return "N/A";
    }

    const response = await axios.get(url, { headers, params });
    console.log(`${store} API response:`, response.data); // ✅ log to terminal

    // Extract price based on store API response shape
    switch (store) {
      case "coles":
        return response.data?.[0]?.price || "N/A";
      case "woolworths":
        return response.data?.products?.[0]?.price || "N/A";
      case "aldi":
        return response.data?.results?.[0]?.price || "N/A";
      case "iga":
        return response.data?.results?.[0]?.price || "N/A";
      default:
        return "N/A";
    }
  } catch (err) {
    console.error(`Error fetching from ${store}:`, err);
    return "N/A";
  }
}
