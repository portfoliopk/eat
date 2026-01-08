export const dynamic = "force-dynamic";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  let lat = null;
  let lng = null;

  const auth = req.headers.get("authorization");
  if (auth) {
    const user = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    const [[u]] = await pool.query(
      "SELECT latitude,longitude FROM users WHERE id=?",
      [user.id]
    );
    lat = u.latitude;
    lng = u.longitude;
  }

  const [rows] = await pool.query(`
    SELECT r.id,r.name,r.description,
    r.latitude,r.longitude,
    (SELECT file_path FROM media WHERE id=r.logo_id) AS image
    FROM restaurants r
    WHERE r.status='active'
  `);

  const result = rows
    .map(r => {
      if (!lat || !lng || !r.latitude || !r.longitude) return null;

      const R = 6371;
      const dLat = (r.latitude - lat) * Math.PI / 180;
      const dLng = (r.longitude - lng) * Math.PI / 180;
      const a =
        Math.sin(dLat/2)**2 +
        Math.cos(lat*Math.PI/180) *
        Math.cos(r.latitude*Math.PI/180) *
        Math.sin(dLng/2)**2;

      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return dist <= 4 ? { ...r, distance: dist.toFixed(1) } : null;
    })
    .filter(Boolean);

  return Response.json({ success:true, restaurants: result });
}
