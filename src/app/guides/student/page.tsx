import PageShell from "@/components/page-shell";

export default function StudentGuidePage() {
  return (
    <PageShell>
    <div className="max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Student Guide</h1>
      <p className="text-slate-600">
        Follow these steps to participate in events.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Register using the student signup form.</li>
        <li>Wait for admin approval. Until then, your account remains pending.</li>
        <li>After approval, open home and click <strong>Browse Events</strong>.</li>
        <li>Open an event and click <strong>Apply</strong>.</li>
        <li>Track results in <strong>My Applications</strong> (applied/selected/rejected).</li>
        <li>Review your details anytime in <strong>My Profile</strong>.</li>
      </ol>
    </div>
    </PageShell>
  );
}
