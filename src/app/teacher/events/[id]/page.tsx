import { updateApplicationStatus } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { requireRole } from "@/lib/auth";
import PageShell from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

interface ApplicantRow {
  id: string;
  status: string;
  profiles: {
    full_name: string;
    class: string;
    admission_no: string;
    email: string;
    father_name: string;
    yob: number;
  } | null;
}

export default async function TeacherEventApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["teacher", "admin"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id,title,description")
    .eq("id", id)
    .single();

  const { data: applicants } = await supabase
    .from("applications")
    .select("id,status,profiles(full_name,class,admission_no,email,father_name,yob)")
    .eq("event_id", id);

  return (
    <PageShell>
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Applicants - {event?.title}</h1>
      <p className="text-slate-600">{event?.description}</p>
      {(applicants as ApplicantRow[] | null)?.map((application) => (
        <article className="rounded-lg bg-white p-4 shadow-sm" key={application.id}>
          <h2 className="font-semibold">{application.profiles?.full_name}</h2>
          <p className="text-sm text-slate-600">
            Class: {application.profiles?.class} | Admission:{" "}
            {application.profiles?.admission_no}
          </p>
          <p className="text-sm text-slate-600">
            Email: {application.profiles?.email ?? "-"} | Father: {application.profiles?.father_name ?? "-"} | YOB:{" "}
            {application.profiles?.yob ?? "-"}
          </p>
          <p className="mt-1 text-sm capitalize">Current Status: {application.status}</p>
          <div className="mt-3 flex gap-2">
            <form action={updateApplicationStatus}>
              <input type="hidden" name="application_id" value={application.id} />
              <input type="hidden" name="status" value="selected" />
              <ConfirmSubmitButton
                className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:bg-emerald-200"
                confirmMessage="Select this student for the event?"
                disabled={application.status === "selected"}
                label="Select"
              />
            </form>
            <form action={updateApplicationStatus}>
              <input type="hidden" name="application_id" value={application.id} />
              <input type="hidden" name="status" value="rejected" />
              <ConfirmSubmitButton
                className="rounded bg-rose-600 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:bg-rose-200"
                confirmMessage="Reject this student application?"
                disabled={application.status === "rejected"}
                label="Reject"
              />
            </form>
            <form action={updateApplicationStatus}>
              <input type="hidden" name="application_id" value={application.id} />
              <input type="hidden" name="status" value="applied" />
              <ConfirmSubmitButton
                className="rounded bg-slate-600 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                confirmMessage="Move this student back to applied status?"
                disabled={application.status === "applied"}
                label="Unselect"
              />
            </form>
          </div>
        </article>
      ))}
    </div>
    </PageShell>
  );
}
