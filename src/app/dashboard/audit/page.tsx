import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/database";
import { AuditLog } from "@/types";
import AuditClient from "./AuditClient";

export default async function AuditPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const db = await getDatabase();
  const auditLogs = (await db.all(`
    SELECT al.*, l.title as listing_title 
    FROM audit_logs al 
    LEFT JOIN listings l ON al.listing_id = l.id 
    ORDER BY al.created_at DESC 
    LIMIT 100
  `)) as (AuditLog & { listing_title: string })[];

  return <AuditClient auditLogs={auditLogs} />;
}
