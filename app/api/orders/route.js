import pool from "../../../lib/db";
import jwt from "jsonwebtoken";

/* ===============================
   AUTH HELPER
================================ */
function getUser(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  try {
    const token = auth.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

/* ===============================
   GET ORDERS (ROLE BASED)
================================ */
export async function GET(request) {
  const user = getUser(request);
  if (!user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let query = `
    SELECT o.*, u.name AS customer_name, r.name AS restaurant_name
    FROM orders o
    LEFT JOIN users u ON o.customer_id = u.id
    LEFT JOIN restaurants r ON o.restaurant_id = r.id
  `;
  const params = [];

  if (user.role === "customer") {
    query += " WHERE o.customer_id = ?";
    params.push(user.id);
  }

  if (user.role === "restaurant") {
    query += " WHERE r.user_id = ?";
    params.push(user.id);
  }

  if (user.role === "rider") {
    query += " WHERE o.rider_id = ?";
    params.push(user.id);
  }

  const [orders] = await pool.query(query, params);

  return Response.json({ success: true, orders });
}

/* ===============================
   CREATE ORDER (CUSTOMER)
================================ */
export async function POST(request) {
  const user = getUser(request);

  if (!user || user.role !== "customer") {
    return Response.json(
      { success: false, message: "Only customers can order" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { restaurant_id, items, total } = body;

  // Create order
  const [order] = await pool.query(
    "INSERT INTO orders (customer_id, restaurant_id, total) VALUES (?,?,?)",
    [user.id, restaurant_id, total]
  );

  const orderId = order.insertId;

  // Insert order items
  for (let item of items) {
    await pool.query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
       VALUES (?,?,?,?)`,
      [orderId, item.menu_item_id, item.quantity, item.price]
    );
  }

  return Response.json({
    success: true,
    message: "Order placed",
    order_id: orderId,
  });
}

/* ===============================
   UPDATE ORDER STATUS
================================ */
export async function PUT(request) {
  const user = getUser(request);
  if (!user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { order_id, status, rider_id } = body;

  // Restaurant updates status
  if (user.role === "restaurant") {
    await pool.query(
      "UPDATE orders SET status=? WHERE id=?",
      [status, order_id]
    );
  }

  // Admin assigns rider
  if (user.role === "admin") {
    await pool.query(
      "UPDATE orders SET rider_id=? WHERE id=?",
      [rider_id, order_id]
    );
  }

  // Rider updates delivery status
  if (user.role === "rider") {
    await pool.query(
      "UPDATE orders SET status=? WHERE id=? AND rider_id=?",
      [status, order_id, user.id]
    );
  }

  return Response.json({
    success: true,
    message: "Order updated",
  });
}
