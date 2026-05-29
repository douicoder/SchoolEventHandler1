import Link from "next/link";
import { applyToEvent } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { requireRole } from "@/lib/auth";
import PageShell from "@/components/page-shell";
import {
  formatClassRange,
  getStudentClass,
  isClassEligible,
} from "@/lib/class-level";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types/domain";

interface ParticipantRow {
  id: string;
  status: string;
  profiles: {
    full_name: string;
    class: number;
    admission_no: string;
  } | null;
}

export default async function StudentEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireRole(["student"]);
  const studentClass = getStudentClass(profile);
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single<Event>();

  if (!event) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Event not found.</p>
        <Link className="text-sm font-medium text-indigo-700" href="/home">
          Back to home
        </Link>
      </div>
    );
  }

  const classMin = event.class_min ?? 1;
  const classMax = event.class_max ?? 12;
  const eligible = isClassEligible(studentClass, classMin, classMax);

  const { data: myApplication } = await supabase
    .from("applications")
    .select("id, status")
    .eq("event_id", id)
    .eq("student_id", profile.id)
    .maybeSingle();

  const { data: participants } = await supabase
    .from("applications")
    .select("id,status,profiles(full_name,class,admission_no)")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  return (
    <PageShell>
    <div className="mx-auto max-w-2xl space-y-6">
      <Link className="text-sm font-medium text-indigo-700" href="/home">
        ← Back to home
      </Link>

      <section className="rounded-xl border-2 border-slate-300 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
        <p className="mt-2 text-slate-600">{event.description}</p>
        <p className="mt-3 text-sm text-slate-700">
          Date: {event.event_date} · Spots: {event.spots_needed} ·{" "}
          {formatClassRange(classMin, classMax)}
        </p>

        {myApplication ? (
          <p className="mt-4 text-sm font-medium capitalize text-slate-800">
            Your status: {myApplication.status}
          </p>
        ) : eligible && event.status === "open" ? (
          <form action={applyToEvent} className="mt-4">
            <input name="event_id" type="hidden" value={event.id} />
            <ConfirmSubmitButton
              className="rounded-md border border-slate-800 px-4 py-2 text-sm font-medium"
              confirmMessage={`Apply for ${event.title}?`}
              label="Apply"
            />
          </form>
        ) : (
          <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">
            {!eligible
              ? `Your class (${studentClass ?? "?"}) is not eligible. This event is for ${formatClassRange(classMin, classMax)}.`
              : "Applications are closed for this event."}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Who participated</h2>
        <div className="rounded-xl border-2 border-slate-300 bg-white p-4">
          {!(participants as ParticipantRow[] | null)?.length ? (
            <p className="text-sm text-slate-500">No students have applied yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {((participants ?? []) as unknown as ParticipantRow[]).map((row) => (
                <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={row.id}>
                  <div>
                    <p className="font-medium text-slate-900">{row.profiles?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-slate-500">
                      Class {row.profiles?.class ?? "?"} · {row.profiles?.admission_no ?? "-"}
                    </p>
                  </div>
                  <span className="text-sm capitalize text-slate-700">{row.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
    </PageShell>
  );
}
