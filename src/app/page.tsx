import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/auth";
import { getHomePath } from "@/lib/home-path";

export default async function LandingPage() {
  const profile = await getMyProfile();
  if (profile) {
    redirect(getHomePath(profile));
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 overflow-hidden">

      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Accent blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #0f172a 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-md text-center">

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium tracking-widest text-slate-500 uppercase shadow-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Now available
        </div>

        {/* Heading */}
        <h1
          className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          School Event
          <br />
          <span className="text-slate-400">Planner</span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-base text-slate-500 leading-relaxed">
          Organise, coordinate, and manage every school event — from assemblies to graduation — all in one place.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700 active:scale-[0.98]"
          >
            Get started — it's free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Log in
          </Link>
        </div>

        {/* Trust note */}
        <p className="mt-8 text-xs text-slate-400">
          Trusted by 200+ schools · No credit card required
        </p>

      </div>
    </div>
  );
}