import pool from "../../../../../lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return Response.json({ success: false }, { status: 401 });

  const user = jwt.verify(
    auth.split(" ")[1],
    process.env.JWT_SECRET
  );

  const [[row]] = await pool.query(
    `SELECT address,address_note,address_type,latitude,longitude
     FROM users WHERE id=?`,
    [user.id]
  );

  return Response.json({ success: true, address: row });
}
