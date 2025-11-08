import express from "express";
import { fetchPrice } from "../services/fetchPrice.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const product = req.query.product as string;

  if (!product) {
    return res.status(400).json({ error: "Missing product query parameter" });
  }

  const stores = ["coles", "woolworths", "aldi", "iga"];
  const results: Record<string, string> = {};

  for (const store of stores) {
    results[store] = await fetchPrice(product, store);
  }

  res.json(results);
});

export default router;
