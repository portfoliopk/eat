export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

function getCustomer(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  try {
    const token = auth.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "customer") return null;
    return user;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const user = getCustomer(request);
    if (!user) {
      return Response.json(
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // ✅ phone removed (column does not exist)
    const [[profile]] = await pool.query(
      "SELECT id,name,email FROM users WHERE id=?",
      [user.id]
    );

    const [orders] = await pool.query(
      "SELECT id,total,status FROM orders WHERE customer_id=? ORDER BY id DESC",
      [user.id]
    );

    return Response.json({
      success: true,
      user: profile,
      orders,
    });
  } catch (e) {
    return Response.json({
      success: false,
      error: e.message,
    });
  }
}
