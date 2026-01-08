
export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

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
    "SELECT id, logo_id FROM restaurants WHERE user_id=?",
    [user.id]
  );

  const [media] = await pool.query(
    `
    SELECT DISTINCT m.*
    FROM media m
    LEFT JOIN menu_items mi ON mi.image_id = m.id
    WHERE m.id = ?
       OR mi.restaurant_id = ?
    ORDER BY m.id DESC
    `,
    [restaurant.logo_id || 0, restaurant.id]
  );

  return Response.json({ success: true, media });
}

/* POST */
export async function POST(request) {
  const user = getRestaurantUser(request);
  if (!user) return Response.json({ success: false }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) return Response.json({ success: false }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const safeName = Date.now() + "-" + file.name.replace(/\s+/g, "-");
  const filePath = "/uploads/" + safeName;

  fs.writeFileSync(path.join(uploadDir, safeName), buffer);

  const [result] = await pool.query(
    "INSERT INTO media (file_name, file_path) VALUES (?,?)",
    [safeName, filePath]
  );

  return Response.json({
    success: true,
    media: { id: result.insertId, file_path: filePath },
  });
}

/* DELETE */
export async function DELETE(request) {
  const user = getRestaurantUser(request);
  if (!user) return Response.json({ success: false }, { status: 401 });

  const { id } = await request.json();

  await pool.query("UPDATE restaurants SET logo_id=NULL WHERE logo_id=?", [id]);
  await pool.query("UPDATE menu_items SET image_id=NULL WHERE image_id=?", [id]);

  const [[row]] = await pool.query(
    "SELECT file_path FROM media WHERE id=?",
    [id]
  );

  if (row?.file_path) {
    const full = path.join(process.cwd(), "public", row.file_path);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  }

  await pool.query("DELETE FROM media WHERE id=?", [id]);

  return Response.json({ success: true });
}
