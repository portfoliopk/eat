import pool from "../../../../lib/db";
import { requireAdmin } from "../../_utils/auth";

export async function PUT(request, { params }) {
  const admin = requireAdmin();
  if (!admin) return Response.json({ success: false }, { status: 401 });

  const { name, description, logo_id, status } = await request.json();

  await pool.query(
    "UPDATE restaurants SET name=?, description=?, logo_id=?, status=? WHERE id=?",
    [name, description, logo_id, status, params.id]
  );

  return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin();
  if (!admin) return Response.json({ success: false }, { status: 401 });

  await pool.query("DELETE FROM restaurants WHERE id=?", [params.id]);
  return Response.json({ success: true });
}
