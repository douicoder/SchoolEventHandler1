import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherHome() {
  const profile = await requireRole(["teacher", "admin"]);
  if (profile.role === "admin") {
    redirect("/admin/approvals");
  }
  redirect("/teacher/events");
}
