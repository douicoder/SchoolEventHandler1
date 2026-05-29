import PageShell from "@/components/page-shell";

export default function AdminGuidePage() {
  return (
    <PageShell>
    <div className="max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Admin Guide</h1>
      <p className="text-slate-600">
        Use admin tools to keep account access and event operations secure.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Open <strong>Pending Approvals</strong> to approve or reject student accounts.</li>
        <li>Approved students can immediately use home actions and event requests.</li>
        <li>Open <strong>User Management</strong> to review all users and current roles.</li>
        <li>Change roles in Supabase or admin tools (if enabled in your deployment).</li>
        <li>Role changes are reflected on the user home page on next refresh/sign-in.</li>
        <li>Only admins can run approval actions and permission-sensitive updates.</li>
      </ol>
    </div>
    </PageShell>
  );
}
