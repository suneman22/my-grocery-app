import express from "express";
import { fetchPrice } from "../services/fetchPrice";
import { searchColes } from "../services/coles";
import { searchWoolworths } from "../services/woolworths";
import { searchAldi } from "../services/aldi";
import { searchIGA } from "../services/iga";

const router = express.Router();



// NEW ADVANCED ROUTE
router.get("/price", async (req, res) => {
  const { product } = req.query;

  console.log("🔍 Price request received for:", product);

  try {
    const env = process.env as Record<string, string>;

    const coles = await searchColes(product as string, env);
    const aldi = await searchAldi(product as string, env);
    const woolworths = await searchWoolworths(product as string, env);
    const iga = await searchIGA(product as string, env);

    console.log("Prices fetched:", { coles, woolworths, aldi, iga });

    res.json({
      product,
      prices: { coles, woolworths, aldi, iga },
    });

  } catch (err) {
    console.error("❌ Backend price error:", err);
    res.status(500).json({ error: "Price fetch failed" });
  }
});

export default router;
