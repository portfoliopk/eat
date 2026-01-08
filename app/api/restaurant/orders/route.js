export const dynamic = "force-dynamic";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

function getRestaurantUser(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  try {
    const token = auth.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.role === "restaurant" ? user : null;
  } catch {
    return null;
  }
}

/* ===============================
   GET RESTAURANT ORDERS
================================ */
export async function GET(request) {
  const user = getRestaurantUser(request);
  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const [[restaurant]] = await pool.query(
    "SELECT id FROM restaurants WHERE user_id=?",
    [user.id]
  );

  const [orders] = await pool.query(
    `SELECT *
     FROM orders
     WHERE restaurant_id=?
     ORDER BY created_at DESC`,
    [restaurant.id]
  );

  return Response.json({ success: true, orders });
}

/* ===============================
   UPDATE ORDER STATUS
================================ */
export async function PUT(request) {
  const user = getRestaurantUser(request);
  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const { order_id, status } = await request.json();

  await pool.query(
    "UPDATE orders SET status=? WHERE id=?",
    [status, order_id]
  );

  return Response.json({ success: true });
}
