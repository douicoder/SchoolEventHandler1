import Link from "next/link";
import { getMyProfile } from "@/lib/auth";
import { logout } from "@/app/actions";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profile = await getMyProfile();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold text-slate-900">
            School Event Portal
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            {!profile ? (
              <>
                <Link className="hover:text-slate-900" href="/login">Login</Link>
                <Link className="hover:text-slate-900" href="/register">Register</Link>
              </>
            ) : (
              <>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {profile.full_name} ({profile.role})
                </span>
                {profile.role === "student" && <Link className="hover:text-slate-900" href="/home">Home</Link>}
                {profile.role === "teacher" && <Link className="hover:text-slate-900" href="/teacher/events">My Events</Link>}
                {profile.role === "admin" && <Link className="hover:text-slate-900" href="/admin/approvals">Approvals</Link>}
                <Link className="hover:text-slate-900" href={`/guides/${profile.role}`}>
                  Guide
                </Link>
                <form action={logout}>
                  <button className="rounded bg-slate-900 px-3 py-1.5 text-white" type="submit">
                    Logout
                  </button>
                </form>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
