export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json(
      { success: false, message: "All fields required" },
      { status: 400 }
    );
  }

  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email=?",
    [email]
  );

  if (exists.length) {
    return Response.json(
      { success: false, message: "Email already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, hashedPassword, "customer"]
  );

  return Response.json({ success: true });
}
