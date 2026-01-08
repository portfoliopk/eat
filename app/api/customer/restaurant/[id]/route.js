export const dynamic = "force-dynamic";
import pool from "../../../../../lib/db";

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return Response.json({
      success: false,
      error: "ID_MISSING",
    });
  }

  const [rows] = await pool.query(
    `
    SELECT 
      r.id,
      r.name,
      r.description,
      m.file_path AS image
    FROM restaurants r
    LEFT JOIN media m ON m.id = r.logo_id
    WHERE r.id = ?
    `,
    [id]
  );

  if (rows.length === 0) {
    return Response.json({
      success: false,
      error: "NOT_FOUND",
    });
  }

  const [menu] = await pool.query(
    `
    SELECT 
      mi.id,
      mi.name,
      mi.price,
      c.name AS category_name,
      md.file_path AS image
    FROM menu_items mi
    LEFT JOIN categories c ON c.id = mi.category_id
    LEFT JOIN media md ON md.id = mi.image_id
    WHERE mi.restaurant_id = ?
    `,
    [id]
  );

  return Response.json({
    success: true,
    restaurant: rows[0],
    menu,
  });
}
