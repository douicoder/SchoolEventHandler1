import PageShell from "@/components/page-shell";

export default function RejectedPage() {
  return (
    <PageShell>
    <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Account Rejected</h1>
      <p className="mt-3 text-slate-600">
        Your registration was rejected by an administrator. Please contact school admin.
      </p>
    </div>
    </PageShell>
  );
}
