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
   GET USERS
================================ */
export async function GET(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const [users] = await pool.query(
    "SELECT id,name,email,role FROM users"
  );

  return Response.json({ success: true, users });
}

/* ===============================
   CREATE USER
================================ */
export async function POST(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json({ success: false }, { status: 401 });
  }

  const { name, email, password, role } = await request.json();

  await pool.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, password, role]
  );

  return Response.json({ success: true });
}

/* ===============================
   UPDATE USER
================================ */
export async function PUT(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json({ success: false }, { status: 401 });
  }

  const { id, name, email, role } = await request.json();

  await pool.query(
    "UPDATE users SET name=?, email=?, role=? WHERE id=?",
    [name, email, role, id]
  );

  return Response.json({ success: true });
}

/* ===============================
   DELETE USER
================================ */
export async function DELETE(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json({ success: false }, { status: 401 });
  }

  const { id } = await request.json();

  await pool.query("DELETE FROM users WHERE id=?", [id]);

  return Response.json({ success: true });
}
