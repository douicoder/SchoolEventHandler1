"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isClassEligible, parseClass } from "@/lib/class-level";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

async function getCurrentProfileOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) redirect("/login");
  if (profile.status === "pending") redirect("/pending");
  if (profile.status === "rejected") redirect("/rejected");

  return { supabase, user, profile };
}

export async function registerStudent(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const studentClass = parseClass(formData.get("class"));
  if (!studentClass) {
    redirect("/register?error=Please%20select%20a%20valid%20class%20(1-12)");
  }

  const metadata = {
    full_name: String(formData.get("full_name") ?? ""),
    class: studentClass,
    yob: Number(formData.get("yob") ?? 0),
    admission_no: String(formData.get("admission_no") ?? ""),
    father_name: String(formData.get("father_name") ?? ""),
  };

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/pending");
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createEvent(formData: FormData) {
  const { supabase, user, profile } = await getCurrentProfileOrRedirect();
  if (!["teacher", "admin"].includes(profile.role)) redirect("/");

  const classMin = parseClass(formData.get("class_min"));
  const classMax = parseClass(formData.get("class_max"));
  if (!classMin || !classMax || classMin > classMax) {
    redirect("/teacher/events?error=Invalid%20class%20range");
  }

  await supabase.from("events").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    event_date: String(formData.get("event_date") ?? ""),
    spots_needed: Number(formData.get("spots_needed") ?? 1),
    class_min: classMin,
    class_max: classMax,
    status: "open",
    created_by: user.id,
  });
  revalidatePath("/");
  revalidatePath("/teacher/events");
}

export async function applyToEvent(formData: FormData) {
  const { supabase, user, profile } = await getCurrentProfileOrRedirect();
  if (profile.role !== "student") redirect("/");

  const eventId = String(formData.get("event_id") ?? "");
  const studentClass = parseClass(profile.class);
  const { data: event } = await supabase
    .from("events")
    .select("id, class_min, class_max, status")
    .eq("id", eventId)
    .single();

  const classMin = event?.class_min ?? 1;
  const classMax = event?.class_max ?? 12;

  if (!event || event.status !== "open" || !isClassEligible(studentClass, classMin, classMax)) {
    redirect("/home?error=class");
  }

  await supabase.from("applications").insert({
    event_id: eventId,
    student_id: user.id,
    status: "applied",
  });
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/student/applications");
}

export async function updateApplicationStatus(formData: FormData) {
  const { supabase, user, profile } = await getCurrentProfileOrRedirect();
  if (!["teacher", "admin"].includes(profile.role)) redirect("/");

  const applicationId = String(formData.get("application_id") ?? "");
  const status = String(formData.get("status") ?? "applied");

  if (!["applied", "selected", "rejected"].includes(status)) {
    redirect("/");
  }

  if (profile.role === "teacher") {
    const { data: ownedApplication } = await supabase
      .from("applications")
      .select("id, events!inner(created_by)")
      .eq("id", applicationId)
      .eq("events.created_by", user.id)
      .maybeSingle();

    if (!ownedApplication) redirect("/");
  }

  await supabase
    .from("applications")
    .update({
      status,
      selected_at: status === "selected" ? new Date().toISOString() : null,
    })
    .eq("id", applicationId);
  revalidatePath("/");
  revalidatePath("/teacher");
  revalidatePath("/teacher/events");
  revalidatePath("/student/applications");
}

export async function approveStudent(formData: FormData) {
  const { supabase, profile } = await getCurrentProfileOrRedirect();
  if (profile.role !== "admin") redirect("/");

  await supabase
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", String(formData.get("student_id") ?? ""));
  revalidatePath("/");
  revalidatePath("/pending");
  revalidatePath("/admin/approvals");
}

export async function rejectStudent(formData: FormData) {
  const { supabase, profile } = await getCurrentProfileOrRedirect();
  if (profile.role !== "admin") redirect("/");

  await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", String(formData.get("student_id") ?? ""));
  revalidatePath("/");
  revalidatePath("/rejected");
  revalidatePath("/admin/approvals");
}

export async function updateUserRole(formData: FormData) {
  const { supabase, profile } = await getCurrentProfileOrRedirect();
  if (profile.role !== "admin") redirect("/");

  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || !["student", "teacher", "admin"].includes(role)) {
    redirect("/admin/users");
  }

  await supabase.from("profiles").update({ role }).eq("id", userId);

  revalidatePath("/");
  revalidatePath("/admin/users");
  revalidatePath("/admin/approvals");
}
