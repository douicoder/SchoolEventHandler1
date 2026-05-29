import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/domain";

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getMyProfile() {
  const user = await getSessionUser();
  if (!user) return null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    return data ?? null;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  await requireAuth();
  const profile = await getMyProfile();

  if (!profile) redirect("/login");
  if (profile.status === "pending") redirect("/pending");
  if (profile.status === "rejected") redirect("/rejected");
  if (!roles.includes(profile.role)) redirect("/");

  return profile;
}
