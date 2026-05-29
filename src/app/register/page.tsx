import Link from "next/link";
import { registerStudent } from "@/app/actions";
import { ClassSelectField } from "@/components/class-select-field";
import PageShell from "@/components/page-shell";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <PageShell>
    <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Student Registration</h1>
      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <form action={registerStudent} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          className="rounded border border-slate-300 px-3 py-2 sm:col-span-2"
          name="full_name"
          placeholder="Full Name"
          required
        />
        <div className="sm:col-span-2">
          <ClassSelectField label="Class (required)" />
        </div>
        <input
          className="rounded border border-slate-300 px-3 py-2"
          name="yob"
          type="number"
          min={1980}
          max={2035}
          placeholder="Year of Birth"
          required
        />
        <input
          className="rounded border border-slate-300 px-3 py-2"
          name="admission_no"
          placeholder="Admission Number"
          required
        />
        <input
          className="rounded border border-slate-300 px-3 py-2 sm:col-span-2"
          name="father_name"
          placeholder="Father's Name"
          required
        />
        <input
          className="rounded border border-slate-300 px-3 py-2 sm:col-span-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="rounded border border-slate-300 px-3 py-2 sm:col-span-2"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button className="sm:col-span-2 rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Register
        </button>
      </form>
      <p className="mt-3 text-sm text-slate-600">
        Already registered? <Link className="underline" href="/login">Login</Link>
      </p>
    </div>
    </PageShell>
  );
}
