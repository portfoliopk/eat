export const dynamic = "force-dynamic";

import pool from "../../../lib/db";
import jwt from "jsonwebtoken";

/* ===============================
   ADMIN AUTH
================================ */
function getAdmin(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.role === "admin" ? user : null;
  } catch {
    return null;
  }
}

/* ===============================
   GET MENU ITEMS
================================ */
export async function GET() {
  const [rows] = await pool.query(`
    SELECT 
      mi.id,
      mi.name,
      mi.price,
      r.name AS restaurant_name,
      c.name AS category_name,
      md.file_path AS image
    FROM menu_items mi
    JOIN restaurants r ON r.id = mi.restaurant_id
    JOIN categories c ON c.id = mi.category_id
    LEFT JOIN media md ON md.id = mi.image_id
    ORDER BY mi.id DESC
  `);

  return Response.json({ success: true, menu: rows });
}

/* ===============================
   CREATE MENU ITEM
================================ */
export async function POST(request) {
  const admin = getAdmin(request);
  if (!admin)
    return Response.json({ success: false }, { status: 401 });

  const {
    name,
    price,
    restaurant_id,
    category_name,
    image_id,
  } = await request.json();

  if (!name || !price || !restaurant_id || !category_name) {
    return Response.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  /* ===============================
     FIND OR CREATE CATEGORY
  ================================ */
  let categoryId;

  const [existing] = await pool.query(
    "SELECT id FROM categories WHERE name=?",
    [category_name]
  );

  if (existing.length > 0) {
    categoryId = existing[0].id;
  } else {
    const [result] = await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [category_name]
    );
    categoryId = result.insertId;
  }

  /* ===============================
     INSERT MENU ITEM
  ================================ */
  await pool.query(
    `INSERT INTO menu_items
     (name, price, restaurant_id, category_id, image_id)
     VALUES (?,?,?,?,?)`,
    [
      name,
      Number(price),
      Number(restaurant_id),
      categoryId,
      image_id || null,
    ]
  );

  return Response.json({ success: true });
}

/* ===============================
   UPDATE MENU ITEM
================================ */
export async function PUT(request) {
  const admin = getAdmin(request);
  if (!admin)
    return Response.json({ success: false }, { status: 401 });

  const {
    id,
    name,
    price,
    restaurant_id,
    category_name,
    image_id,
  } = await request.json();

  /* FIND OR CREATE CATEGORY */
  let categoryId;

  const [existing] = await pool.query(
    "SELECT id FROM categories WHERE name=?",
    [category_name]
  );

  if (existing.length > 0) {
    categoryId = existing[0].id;
  } else {
    const [result] = await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [category_name]
    );
    categoryId = result.insertId;
  }

  await pool.query(
    `UPDATE menu_items
     SET name=?, price=?, restaurant_id=?, category_id=?, image_id=?
     WHERE id=?`,
    [
      name,
      Number(price),
      Number(restaurant_id),
      categoryId,
      image_id || null,
      id,
    ]
  );

  return Response.json({ success: true });
}

/* ===============================
   DELETE MENU ITEM
================================ */
export async function DELETE(request) {
  const admin = getAdmin(request);
  if (!admin)
    return Response.json({ success: false }, { status: 401 });

  const { id } = await request.json();
  await pool.query("DELETE FROM menu_items WHERE id=?", [id]);

  return Response.json({ success: true });
}
