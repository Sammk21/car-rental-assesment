import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const listingId = parseInt(params.id);
    const db = await getDatabase();

    await db.run(
      `
      UPDATE listings 
      SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [session.username, listingId]
    );

    await db.run(
      `
      INSERT INTO audit_logs (listing_id, admin_username, action)
      VALUES (?, ?, ?)
    `,
      [listingId, session.username, "approve"]
    );

    return NextResponse.json({ message: "Listing approved successfully" });
  } catch (error) {
    console.error("Approve listing error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
