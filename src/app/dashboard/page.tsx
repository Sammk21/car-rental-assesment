import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/database";
import { Listing } from "@/types";
import DashboardClient from "./DashboardClient";

interface SearchParams {
  page?: string;
  status?: string;
  search?: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const db = await getDatabase();
  const page = parseInt(searchParams?.page || "1");
  const status = searchParams?.status || "all";
  const search = searchParams?.search || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM listings WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as total FROM listings WHERE 1=1";
  const params: any[] = [];

  if (status !== "all") {
    query += " AND status = ?";
    countQuery += " AND status = ?";
    params.push(status);
  }

  if (search) {
    query +=
      " AND (title LIKE ? OR make LIKE ? OR model LIKE ? OR location LIKE ?)";
    countQuery +=
      " AND (title LIKE ? OR make LIKE ? OR model LIKE ? OR location LIKE ?)";
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

  const listings = (await db.all(query, [
    ...params,
    limit,
    offset,
  ])) as Listing[];
  const totalResult = (await db.get(countQuery, params)) as { total: number };
  const total = totalResult.total;
  const totalPages = Math.ceil(total / limit);
  
  console.log("dashboard")

  return (
    <DashboardClient
      listings={listings}
      currentPage={page}
      totalPages={totalPages}
      currentStatus={status}
      currentSearch={search}
      username={session.username}
    />
  );
}
