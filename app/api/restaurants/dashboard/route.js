export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

function getRestaurantUser(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.role === "restaurant" ? user : null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  const user = getRestaurantUser(request);
  if (!user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔹 Get restaurant
  const [restaurants] = await pool.query(
    "SELECT id, name, status FROM restaurants WHERE user_id=? LIMIT 1",
    [user.id]
  );

  if (!restaurants.length) {
    return Response.json({
      success: false,
      message: "Restaurant not found",
    });
  }

  const restaurant = restaurants[0];

  // 🔹 Count menu items
  const [[menu]] = await pool.query(
    "SELECT COUNT(*) AS total FROM menu_items WHERE restaurant_id=?",
    [restaurant.id]
  );

  // 🔹 Count categories
  const [[categories]] = await pool.query(
    "SELECT COUNT(*) AS total FROM categories WHERE restaurant_id=?",
    [restaurant.id]
  );

  return Response.json({
    success: true,
    dashboard: {
      restaurant,
      menuItems: menu.total,
      categories: categories.total,
    },
  });
}
