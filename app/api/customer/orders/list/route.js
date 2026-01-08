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

export async function GET(req) {
  const user = getCustomer(req);
  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const [orders] = await pool.query(
    `SELECT id,total,status,created_at
     FROM orders
     WHERE customer_id=?
     ORDER BY created_at DESC`,
    [user.id]
  );

  return Response.json({
    success: true,
    orders,
  });
}
