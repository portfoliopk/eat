export const dynamic = "force-dynamic";

import pool from "../../../lib/db";
import jwt from "jsonwebtoken";

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
   GET RESTAURANTS
================================ */
export async function GET() {
  const [rows] = await pool.query(`
    SELECT r.id, r.name, r.description, r.status,
           m.file_path AS logo
    FROM restaurants r
    LEFT JOIN media m ON r.logo_id = m.id
    ORDER BY r.id DESC
  `);

  return Response.json({ success: true, restaurants: rows });
}

/* ===============================
   CREATE RESTAURANT
================================ */
export async function POST(request) {
  const admin = getAdmin(request);
  if (!admin)
    return Response.json({ success: false }, { status: 401 });

  const { name, description, status, logo_id } =
    await request.json();

  await pool.query(
    "INSERT INTO restaurants (name, description, status, logo_id) VALUES (?,?,?,?)",
    [name, description, status, logo_id || null]
  );

  return Response.json({ success: true });
}

/* ===============================
   UPDATE RESTAURANT
================================ */
export async function PUT(request) {
  const admin = getAdmin(request);
  if (!admin)
    return Response.json({ success: false }, { status: 401 });

  const { id, name, description, status, logo_id } =
    await request.json();

  await pool.query(
    "UPDATE restaurants SET name=?, description=?, status=?, logo_id=? WHERE id=?",
    [name, description, status, logo_id || null, id]
  );

  return Response.json({ success: true });
}

/* ===============================
   DELETE RESTAURANT
================================ */
export async function DELETE(request) {
  const admin = getAdmin(request);
  if (!admin)
    return Response.json({ success: false }, { status: 401 });

  const { id } = await request.json();

  await pool.query("DELETE FROM restaurants WHERE id=?", [id]);

  return Response.json({ success: true });
}
