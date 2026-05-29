import PageShell from "@/components/page-shell";

export default function PendingPage() {
  return (
    <PageShell>
    <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Account Pending Approval</h1>
      <p className="mt-3 text-slate-600">
        Your account is pending admin approval.
      </p>
    </div>
    </PageShell>
  );
}
