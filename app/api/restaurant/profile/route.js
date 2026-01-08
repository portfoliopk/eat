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

/* GET PROFILE */
export async function GET(request) {
  const user = getRestaurantUser(request);
  if (!user)
    return Response.json({ success: false }, { status: 401 });

  const [rows] = await pool.query(
    `
    SELECT r.*, m.file_path AS logo_path
    FROM restaurants r
    LEFT JOIN media m ON m.id = r.logo_id
    WHERE r.user_id=?
    LIMIT 1
    `,
    [user.id]
  );

  return Response.json({ success: true, restaurant: rows[0] });
}

/* UPDATE PROFILE */
export async function PUT(request) {
  const user = getRestaurantUser(request);
  if (!user)
    return Response.json({ success: false }, { status: 401 });

  const { name, description, status, logo_id } =
    await request.json();

  await pool.query(
    `
    UPDATE restaurants
    SET name=?, description=?, status=?, logo_id=?
    WHERE user_id=?
    `,
    [name, description, status, logo_id || null, user.id]
  );

  return Response.json({ success: true });
}
