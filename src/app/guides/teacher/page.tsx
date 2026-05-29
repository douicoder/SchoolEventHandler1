import PageShell from "@/components/page-shell";

export default function TeacherGuidePage() {
  return (
    <PageShell>
    <div className="max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Teacher Guide</h1>
      <p className="text-slate-600">
        Use these steps to run event selection workflows.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Sign in using a teacher-approved account.</li>
        <li>Go to <strong>My Events</strong> and create an event with date and spots.</li>
        <li>Open <strong>Manage Applicants</strong> for an event.</li>
        <li>Use <strong>Select</strong>, <strong>Reject</strong>, or <strong>Unselect</strong> actions as needed.</li>
        <li>Students see status updates immediately on their side.</li>
        <li>Only event owners (or admins) can manage that event&apos;s applicants.</li>
      </ol>
    </div>
    </PageShell>
  );
}
