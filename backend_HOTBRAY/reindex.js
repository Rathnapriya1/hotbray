import "dotenv/config";
import pool from "./db.js";
import { productsIndex, initSearchSettings } from "./meiliClient.js";

async function reindex() {
  // Ensure index settings exist
  await initSearchSettings();

  // Only select columns that we are sure exist
  const result = await pool.query(
    "SELECT id, name, part_number, price, image FROM products"
  );

  const docs = result.rows.map((p) => ({
    id: p.id,
    name: p.name,
    part_number: p.part_number,
    price: p.price,
    image: p.image,
  }));

  const task = await productsIndex.addDocuments(docs);
  console.log("Indexing task started:", task);
  process.exit(0);
}

reindex().catch((err) => {
  console.error("Reindex error:", err);
  process.exit(1);
});