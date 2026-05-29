"use client";

import { CLASSES } from "@/lib/class-level";

type ClassSelectFieldProps = {
  name?: string;
  id?: string;
  label?: string;
  required?: boolean;
  defaultValue?: number;
};

export function ClassSelectField({
  name = "class",
  id = "class",
  label = "Class",
  required = true,
  defaultValue,
}: ClassSelectFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        className="w-full rounded border border-slate-300 px-3 py-2"
        defaultValue={defaultValue ?? ""}
        id={id}
        name={name}
        required={required}
      >
        <option disabled hidden value="">
          Choose class (1–12 only)
        </option>
        {CLASSES.map((classLevel) => (
          <option key={classLevel} value={classLevel}>
            Class {classLevel}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-500">Only classes 1 through 12 are allowed.</p>
    </label>
  );
}
