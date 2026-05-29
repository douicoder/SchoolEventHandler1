import Link from "next/link";
import { applyToEvent } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import PageShell from "@/components/page-shell";
import { requireRole } from "@/lib/auth";
import {
  formatClassRange,
  getStudentClass,
  isClassEligible,
} from "@/lib/class-level";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types/domain";

interface AppliedEventRow {
  id: string;
  status: "applied" | "selected" | "rejected";
  events: Event | null;
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

function statusLabel(status: AppliedEventRow["status"]) {
  if (status === "selected") return "Selected";
  if (status === "rejected") return "Rejected";
  return "Applied";
}

export default async function StudentHomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const profile = await requireRole(["student"]);
  const studentClass = getStudentClass(profile);
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "open")
    .order("event_date", { ascending: true })
    .returns<Event[]>();

  const { data: appliedRows } = await supabase
    .from("applications")
    .select("id,status,events(*)")
    .eq("student_id", profile.id)
    .returns<AppliedEventRow[]>();

  const appliedByEventId = new Map(
    (appliedRows ?? [])
      .filter((row) => row.events?.id)
      .map((row) => [row.events!.id, row]),
  );

  const availableEvents = (events ?? []).filter((event) => {
    if (appliedByEventId.has(event.id)) return false;
    const min = event.class_min ?? 1;
    const max = event.class_max ?? 12;
    return isClassEligible(studentClass, min, max);
  });

  const ineligibleEvents = (events ?? []).filter((event) => {
    if (appliedByEventId.has(event.id)) return false;
    const min = event.class_min ?? 1;
    const max = event.class_max ?? 12;
    return !isClassEligible(studentClass, min, max);
  });

  return (
    <PageShell>
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome {firstName(profile.full_name)}!
      </h1>
      {studentClass != null && (
        <p className="text-sm text-slate-600">Your class: {studentClass}</p>
      )}
      {error === "class" && (
        <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          You cannot apply to this event because your class is outside the allowed range.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Applied events</h2>
        <div className="min-h-[120px] rounded-xl border-2 border-slate-300 bg-white p-4">
          {(appliedRows ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {(appliedRows ?? []).map((row) => (
                <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={row.id}>
                  <div>
                    <Link
                      className="font-medium text-slate-900 underline-offset-2 hover:underline"
                      href={`/home/events/${row.events?.id}`}
                    >
                      {row.events?.title ?? "Unknown event"}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {row.events?.event_date ?? ""} ·{" "}
                      {formatClassRange(row.events?.class_min ?? 1, row.events?.class_max ?? 12)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium capitalize text-slate-700">
                    {statusLabel(row.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Events</h2>
        <div className="min-h-[120px] rounded-xl border-2 border-slate-300 bg-white p-4">
          {availableEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No open events for your class right now.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {availableEvents.map((event) => (
                <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={event.id}>
                  <div>
                    <Link
                      className="font-medium text-slate-900 underline-offset-2 hover:underline"
                      href={`/home/events/${event.id}`}
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {event.event_date} · {event.spots_needed} spots ·{" "}
                      {formatClassRange(event.class_min ?? 1, event.class_max ?? 12)}
                    </p>
                  </div>
                  <form action={applyToEvent}>
                    <input name="event_id" type="hidden" value={event.id} />
                    <ConfirmSubmitButton
                      className="shrink-0 rounded-md border border-slate-800 px-4 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
                      confirmMessage={`Apply for ${event.title}?`}
                      label="Apply"
                    />
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {ineligibleEvents.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Not available for your class</h2>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <ul className="divide-y divide-slate-200">
              {ineligibleEvents.map((event) => (
                <li className="py-3 first:pt-0 last:pb-0" key={event.id}>
                  <Link
                    className="font-medium text-slate-700 underline-offset-2 hover:underline"
                    href={`/home/events/${event.id}`}
                  >
                    {event.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {formatClassRange(event.class_min ?? 1, event.class_max ?? 12)} — your class:{" "}
                    {studentClass ?? "?"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
    </PageShell>
  );
}
