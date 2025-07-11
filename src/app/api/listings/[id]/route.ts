import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const listingId = parseInt(params.id);
    const updates = await request.json();

    const db = await getDatabase();

    // Get current listing for audit log
    const currentListing = await db.get("SELECT * FROM listings WHERE id = ?", [
      listingId,
    ]);

    if (!currentListing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Update listing
    const updateQuery = `
      UPDATE listings 
      SET title = ?, description = ?, make = ?, model = ?, year = ?, 
          price_per_day = ?, location = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.run(updateQuery, [
      updates.title,
      updates.description,
      updates.make,
      updates.model,
      updates.year,
      updates.price_per_day,
      updates.location,
      updates.image_url,
      listingId,
    ]);

    // Create audit log
    await db.run(
      `
      INSERT INTO audit_logs (listing_id, admin_username, action, old_values, new_values)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        listingId,
        session.username,
        "edit",
        JSON.stringify(currentListing),
        JSON.stringify(updates),
      ]
    );

    return NextResponse.json({ message: "Listing updated successfully" });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
