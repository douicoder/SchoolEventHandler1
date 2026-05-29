import Link from "next/link";
import PageShell from "@/components/page-shell";

export default function GuidesIndexPage() {
  return (
    <PageShell>
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold">How To Use The App</h1>
      <p className="text-slate-600">
        Select your role guide for step-by-step instructions.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100" href="/guides/student">
          <h2 className="font-semibold">Student Guide</h2>
          <p className="mt-2 text-sm text-slate-600">Registration, applying, and tracking status.</p>
        </Link>
        <Link className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100" href="/guides/teacher">
          <h2 className="font-semibold">Teacher Guide</h2>
          <p className="mt-2 text-sm text-slate-600">Creating events and selecting applicants.</p>
        </Link>
        <Link className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100" href="/guides/admin">
          <h2 className="font-semibold">Admin Guide</h2>
          <p className="mt-2 text-sm text-slate-600">Approvals, users, and permissions workflow.</p>
        </Link>
      </div>
    </div>
    </PageShell>
  );
}
