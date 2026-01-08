export const dynamic = "force-dynamic";

import pool from "../../../../../lib/db";
import jwt from "jsonwebtoken";

function getCustomer(req) {
  const auth = req.headers.get("authorization");
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

export async function GET(req, { params }) {
  const user = getCustomer(req);
  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const orderId = params.id;

  const [[order]] = await pool.query(
    `SELECT * FROM orders
     WHERE id=? AND customer_id=?`,
    [orderId, user.id]
  );

  if (!order) {
    return Response.json({ success: false }, { status: 404 });
  }

  const [items] = await pool.query(
    `SELECT oi.qty,oi.price,mi.name
     FROM order_items oi
     JOIN menu_items mi ON mi.id=oi.menu_item_id
     WHERE oi.order_id=?`,
    [orderId]
  );

  return Response.json({
    success: true,
    order,
    items,
  });
}
