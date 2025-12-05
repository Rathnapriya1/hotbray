import express from "express";
import { productsIndex } from "./meiliClient.js";

const router = express.Router();

// FULL SEARCH
router.get("/products", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) return res.json({ hits: [] });

    const result = await productsIndex.search(q, { limit: 25 });
    return res.json(result);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// AUTOSUGGEST
router.get("/suggest", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) return res.json({ hits: [] });

    const result = await productsIndex.search(q, { limit: 8 });

    const suggestions = result.hits.map((x) => ({
      id: x.id,
      name: x.name,
      part_number: x.part_number,
    }));

    res.json({ hits: suggestions });
  } catch (err) {
    console.error("Suggest error:", err);
    res.status(500).json({ error: "Suggest failed" });
  }
});

export default router;