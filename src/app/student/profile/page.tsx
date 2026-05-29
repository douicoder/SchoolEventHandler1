import { requireRole } from "@/lib/auth";
import PageShell from "@/components/page-shell";

export default async function StudentProfilePage() {
  const profile = await requireRole(["student"]);

  return (
    <PageShell>
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="font-medium">Full Name</dt>
          <dd>{profile.full_name}</dd>
          <dt className="font-medium">Class</dt>
          <dd>{profile.class}</dd>
          <dt className="font-medium">Admission Number</dt>
          <dd>{profile.admission_no}</dd>
          <dt className="font-medium">Email</dt>
          <dd>{profile.email}</dd>
          <dt className="font-medium">Status</dt>
          <dd className="capitalize">{profile.status}</dd>
        </dl>
      </div>
    </div>
    </PageShell>
  );
}
