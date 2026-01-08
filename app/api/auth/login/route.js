export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      "SELECT id, name, role, password FROM users WHERE email=? LIMIT 1",
      [email]
    );

    if (!rows.length) {
      return Response.json(
        { success: false, message: "Invalid login" },
        { status: 401 }
      );
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return Response.json(
        { success: false, message: "Invalid login" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
