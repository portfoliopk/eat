export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

function getCustomer(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  try {
    const token = auth.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "customer") return null;
    return user;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const user = getCustomer(request);
    if (!user) {
      return Response.json(
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { customer, items, total } = await request.json();
    if (!items || !items.length) {
      return Response.json(
        { success: false, error: "EMPTY_CART" },
        { status: 400 }
      );
    }

    const restaurant_id = items[0].restaurant_id;

    const [orderRes] = await pool.query(
      `INSERT INTO orders
       (customer_id, restaurant_id, total, status)
       VALUES (?,?,?,?)`,
      [user.id, restaurant_id, total, "pending"]
    );

    const order_id = orderRes.insertId;

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items
         (order_id, menu_item_id, qty, price)
         VALUES (?,?,?,?)`,
        [order_id, item.id, item.qty, item.price]
      );
    }

    return Response.json({ success: true, order_id });
  } catch (e) {
    return Response.json({
      success: false,
      error: e.message,
    });
  }
}
