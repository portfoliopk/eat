export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
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

export async function GET(request) {
  const admin = getAdmin(request);
  if (!admin) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const [[users]] = await pool.query(
    "SELECT COUNT(*) as total FROM users"
  );

  const [[restaurants]] = await pool.query(
    "SELECT COUNT(*) as total FROM restaurants"
  );

  const [[menu]] = await pool.query(
    "SELECT COUNT(*) as total FROM menu_items"
  );

  const [[media]] = await pool.query(
    "SELECT COUNT(*) as total FROM media"
  );

  return Response.json({
    success: true,
    stats: {
      users: users.total,
      restaurants: restaurants.total,
      menu: menu.total,
      media: media.total,
    },
  });
}
