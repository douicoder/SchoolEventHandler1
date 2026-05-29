import { approveStudent, rejectStudent } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import PageShell from "@/components/page-shell";

interface PendingStudentRow {
  id: string;
  full_name: string;
  class: string;
  admission_no: string;
  email: string;
  status: string;
}

export default async function AdminApprovalsPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { data: pendingStudents, error } = await supabase
    .from("profiles")
    .select("id, full_name, class, admission_no, email, status")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <PageShell>
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Student Approvals</h1>
      {error && (
        <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          Could not load pending approvals: {error.message}
        </p>
      )}
      {!error && (!pendingStudents || pendingStudents.length === 0) && (
        <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
          No pending users found right now.
        </p>
      )}
      {(pendingStudents as PendingStudentRow[] | null)?.map((student) => (
        <article className="rounded-lg bg-white p-4 shadow-sm" key={student.id}>
          <h2 className="font-semibold">{student.full_name}</h2>
          <p className="text-sm text-slate-600">
            Class {student.class} | {student.admission_no} | {student.email}
          </p>
          <div className="mt-3 flex gap-2">
            <form action={approveStudent}>
              <input type="hidden" name="student_id" value={student.id} />
              <button className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white" type="submit">
                Approve
              </button>
            </form>
            <form action={rejectStudent}>
              <input type="hidden" name="student_id" value={student.id} />
              <button className="rounded bg-rose-600 px-3 py-1.5 text-sm text-white" type="submit">
                Reject
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
    </PageShell>
  );
}
