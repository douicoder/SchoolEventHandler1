import Link from "next/link";
import { login } from "@/app/actions";
import PageShell from "@/components/page-shell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <PageShell>
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <form action={login} className="mt-5 space-y-3">
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Sign In
        </button>
      </form>
      <p className="mt-3 text-sm text-slate-600">
        No account? <Link className="underline" href="/register">Register</Link>
      </p>
    </div>
    </PageShell>
  );
}
