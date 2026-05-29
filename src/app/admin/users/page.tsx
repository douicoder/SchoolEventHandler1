import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateUserRole } from "@/app/actions";
import PageShell from "@/components/page-shell";

interface AdminUserRow {
  id: string;
  full_name: string;
  class: string;
  admission_no: string;
  role: string;
  status: string;
  email: string;
}

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, class, admission_no, role, status, email")
    .order("created_at", { ascending: false });

  return (
    <PageShell>
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Users</h1>
      <div className="overflow-x-auto rounded-lg bg-white p-2 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Role</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2 text-left">Admission</th>
              <th className="px-2 py-2 text-left">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {(users as AdminUserRow[] | null)?.map((user) => (
              <tr key={user.id} className="border-b last:border-b-0">
                <td className="px-2 py-2">{user.full_name}</td>
                <td className="px-2 py-2">{user.email}</td>
                <td className="px-2 py-2 capitalize">{user.role}</td>
                <td className="px-2 py-2 capitalize">{user.status}</td>
                <td className="px-2 py-2">{user.admission_no ?? "-"}</td>
                <td className="px-2 py-2">
                  <form action={updateUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="user_id" value={user.id} />
                    <select
                      aria-label={`Role for ${user.email}`}
                      className="rounded border border-slate-300 px-2 py-1 text-sm"
                      defaultValue={user.role}
                      name="role"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="rounded bg-slate-900 px-2.5 py-1 text-xs text-white"
                      type="submit"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </PageShell>
  );
}
