"use client";

type ConfirmSubmitButtonProps = {
  label: string;
  confirmMessage?: string;
  className?: string;
  disabled?: boolean;
};

export function ConfirmSubmitButton({
  label,
  confirmMessage,
  className,
  disabled = false,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={(event) => {
        if (!confirmMessage || disabled) return;
        const ok = window.confirm(confirmMessage);
        if (!ok) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      {label}
    </button>
  );
}
