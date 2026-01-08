import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email=? AND role='restaurant'",
    [email]
  );

  if (!rows.length) {
    return Response.json(
      { message: "Invalid login" },
      { status: 401 }
    );
  }

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return Response.json(
      { message: "Invalid login" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return Response.json({ token });
}
