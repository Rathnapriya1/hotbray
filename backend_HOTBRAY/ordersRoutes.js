import express from "express";
import pool from "./db.js";

const router = express.Router();

// ➤ Create new order
router.post("/", async (req, res) => {
  try {
    const {
      clerk_user_id,
      items,
      total_amount,
      payment_method,
      billing,
      shipping,
    } = req.body;

    console.log("Incoming order payload:", req.body); // Good inside route

    const result = await pool.query(
      `INSERT INTO orders (clerk_user_id, items, total_amount, payment_method, billing, shipping)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        clerk_user_id,
        JSON.stringify(items),
        total_amount,
        payment_method,
        JSON.stringify(billing),
        JSON.stringify(shipping),
      ]
    );

    return res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error("Order save error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Get all orders for logged-in user
router.get("/:clerk_user_id", async (req, res) => {
  try {
    const { clerk_user_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM orders WHERE clerk_user_id = $1 ORDER BY created_at DESC`,
      [clerk_user_id]
    );
    return res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error("Order fetch error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Get order details by order ID
router.get("/details/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [order_id]
    );

    if (result.rows.length === 0)
      return res.json({ success: false, error: "Order not found" });

    return res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

export default router;