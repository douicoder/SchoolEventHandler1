import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import PageShell from "@/components/page-shell";

interface StudentApplicationRow {
  id: string;
  status: string;
  created_at: string;
  events: { title: string; event_date: string } | null;
}

export default async function StudentApplicationsPage() {
  const profile = await requireRole(["student"]);
  const supabase = await createClient();

  const { data } = await supabase
    .from("applications")
    .select("id, status, created_at, events(title, event_date)")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell>
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Applications</h1>
      <div className="grid gap-3">
        {(data as StudentApplicationRow[] | null)?.map((application) => (
          <article className="rounded-lg bg-white p-4 shadow-sm" key={application.id}>
            <h2 className="font-semibold">{application.events?.title ?? "Unknown Event"}</h2>
            <p className="mt-1 text-sm text-slate-600">
              Date: {application.events?.event_date ?? "-"}
            </p>
            <p className="mt-2 text-sm font-medium capitalize">
              Status: {application.status}
            </p>
          </article>
        ))}
      </div>
    </div>
    </PageShell>
  );
}
