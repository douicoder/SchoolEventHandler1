import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentHome() {
  await requireRole(["student"]);
  redirect("/home");
}
