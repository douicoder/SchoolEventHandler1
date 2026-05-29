import Link from "next/link";
import { createEvent } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import PageShell from "@/components/page-shell";
import { CLASSES, formatClassRange } from "@/lib/class-level";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types/domain";

export default async function TeacherEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const profile = await requireRole(["teacher", "admin"]);
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", profile.id)
    .order("created_at", { ascending: false })
    .returns<Event[]>();

  return (
    <PageShell>
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Create Event</h1>
        {error && <p className="mt-2 rounded bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
        <form action={createEvent} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="rounded border border-slate-300 px-3 py-2 sm:col-span-2" name="title" placeholder="Event Title" required />
          <textarea className="rounded border border-slate-300 px-3 py-2 sm:col-span-2" name="description" placeholder="Description" required />
          <input className="rounded border border-slate-300 px-3 py-2" name="event_date" type="date" required />
          <input className="rounded border border-slate-300 px-3 py-2" name="spots_needed" type="number" min={1} placeholder="Spots Needed" required />
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Class from</span>
            <select className="w-full rounded border border-slate-300 px-3 py-2" name="class_min" required defaultValue={1}>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Class to</span>
            <select className="w-full rounded border border-slate-300 px-3 py-2" name="class_max" required defaultValue={12}>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </label>
          <button className="sm:col-span-2 rounded bg-slate-900 px-4 py-2 text-white" type="submit">
            Create Event
          </button>
        </form>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">My Events</h2>
        {(events ?? []).map((event) => (
          <article className="rounded-lg bg-white p-4 shadow-sm" key={event.id}>
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-slate-600">{event.description}</p>
            <p className="mt-1 text-sm">
              Status: {event.status} | Spots: {event.spots_needed} |{" "}
              {formatClassRange(event.class_min ?? 1, event.class_max ?? 12)}
            </p>
            <Link className="mt-3 inline-block rounded bg-slate-900 px-3 py-1.5 text-sm text-white" href={`/teacher/events/${event.id}`}>
              Manage Applicants
            </Link>
          </article>
        ))}
      </section>
    </div>
    </PageShell>
  );
}
