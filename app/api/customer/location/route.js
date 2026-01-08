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

export async function POST(req) {
  const user = getCustomer(req);
  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const { address, latitude, longitude } = await req.json();

  await pool.query(
    `UPDATE users
     SET address=?, latitude=?, longitude=?
     WHERE id=?`,
    [address || null, latitude || null, longitude || null, user.id]
  );

  return Response.json({ success: true });
}