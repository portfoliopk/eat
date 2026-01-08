export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
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

  const [rows] = await pool.query(
    "SELECT id,name,email,phone,address,avatar_id FROM users WHERE id=?",
    [user.id]
  );

  return Response.json({
    success: true,
    customer: rows[0],
  });
}

export async function PUT(req) {
  const user = getCustomer(req);
  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const { name, phone, address, avatar_id } = await req.json();

  await pool.query(
    `UPDATE users
     SET name=?, phone=?, address=?, avatar_id=?
     WHERE id=?`,
    [name, phone, address, avatar_id || null, user.id]
  );

  return Response.json({ success: true });
}
