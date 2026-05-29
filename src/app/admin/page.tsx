import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminHome() {
  await requireRole(["admin"]);
  redirect("/admin/approvals");
}
