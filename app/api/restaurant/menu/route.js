// app/api/restaurant/menu/route.js
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

/* GET */
export async function GET(request) {
  const user = getRestaurantUser(request);
  if (!user) return Response.json({ success: false }, { status: 401 });

  const [[restaurant]] = await pool.query(
    "SELECT id FROM restaurants WHERE user_id=?",
    [user.id]
  );

  const [menu] = await pool.query(
    `
    SELECT 
      m.*,
      c.name AS category_name,
      md.file_path AS image_path
    FROM menu_items m
    LEFT JOIN categories c ON c.id = m.category_id
    LEFT JOIN media md ON md.id = m.image_id
    WHERE m.restaurant_id=?
    `,
    [restaurant.id]
  );

  return Response.json({ success: true, menu });
}

/* POST */
export async function POST(request) {
  const user = getRestaurantUser(request);
  if (!user) return Response.json({ success: false }, { status: 401 });

  const { name, price, category_name, image_id } = await request.json();

  const [[restaurant]] = await pool.query(
    "SELECT id FROM restaurants WHERE user_id=?",
    [user.id]
  );

  const [cat] = await pool.query(
    "INSERT INTO categories (name, restaurant_id) VALUES (?,?)",
    [category_name, restaurant.id]
  );

  await pool.query(
    `
    INSERT INTO menu_items
    (name, price, restaurant_id, category_id, image_id)
    VALUES (?,?,?,?,?)
    `,
    [name, price, restaurant.id, cat.insertId, image_id || null]
  );

  return Response.json({ success: true });
}
