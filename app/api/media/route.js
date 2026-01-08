export const dynamic = "force-dynamic";

import pool from "../../../lib/db";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import path from "path";

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
   GET MEDIA
================================ */
export async function GET() {
  const [media] = await pool.query(
    "SELECT id,file_name,file_path FROM media ORDER BY id DESC"
  );

  return Response.json({ success: true, media });
}

/* ===============================
   UPLOAD MEDIA
================================ */
export async function POST(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return Response.json(
      { success: false, message: "No file" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = Date.now() + "-" + file.name;
  const uploadPath = path.join(
    process.cwd(),
    "public/uploads",
    fileName
  );

  await writeFile(uploadPath, buffer);

  const filePath = "/uploads/" + fileName;

  await pool.query(
    "INSERT INTO media (file_name, file_path) VALUES (?,?)",
    [fileName, filePath]
  );

  return Response.json({ success: true });
}

/* ===============================
   DELETE MEDIA
================================ */
export async function DELETE(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await request.json();
  await pool.query("DELETE FROM media WHERE id=?", [id]);

  return Response.json({ success: true });
}
