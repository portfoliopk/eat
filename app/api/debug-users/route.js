export const dynamic = "force-dynamic";

import pool from "../../../lib/db";

export async function GET() {
  const [users] = await pool.query(
    "SELECT id,name,email,role FROM users"
  );

  return Response.json({
    success: true,
    users,
  });
}
