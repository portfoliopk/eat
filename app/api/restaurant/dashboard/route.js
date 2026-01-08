export const dynamic = "force-dynamic";

import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

function getRestaurantUser(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  try {
    const token = auth.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "restaurant") return null;
    return user;
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
    "SELECT id, name FROM restaurants WHERE user_id=? LIMIT 1",
    [user.id]
  );

  if (!restaurants.length) {
    return Response.json(
      {
        success: false,
        message: "Restaurant not linked",
      },
      { status: 404 }
    );
  }

  const restaurant = restaurants[0];

  // 🔹 Count menu items
  const [[menu]] = await pool.query(
    "SELECT COUNT(*) AS total FROM menu_items WHERE restaurant_id=?",
    [restaurant.id]
  );

  // 🔹 Count orders
  const [[orders]] = await pool.query(
    "SELECT COUNT(*) AS total FROM orders WHERE restaurant_id=?",
    [restaurant.id]
  );

  return Response.json({
    success: true,
    dashboard: {
      restaurant: restaurant.name,
      menu: menu.total,
      orders: orders.total,
    },
  });
}
