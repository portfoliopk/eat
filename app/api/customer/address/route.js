import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return Response.json({ success:false }, { status:401 });

  const user = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);

  const { address, note, type, latitude, longitude } =
    await req.json();

  await pool.query(
    `UPDATE users
     SET address=?, address_note=?, address_type=?, latitude=?, longitude=?
     WHERE id=?`,
    [address, note, type, latitude, longitude, user.id]
  );

  return Response.json({ success:true });
}
