import type { Profile } from "@/types/domain";

export function getHomePath(profile: Profile): string {
  if (profile.status === "pending") return "/pending";
  if (profile.status === "rejected") return "/rejected";
  if (profile.role === "student") return "/home";
  if (profile.role === "teacher") return "/teacher/events";
  return "/admin/approvals";
}
