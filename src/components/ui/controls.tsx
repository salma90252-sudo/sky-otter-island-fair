import { cn } from "@/lib/cn";

export const controlClass =
  "h-11 w-full rounded-sm border border-line bg-canvas px-3 text-base text-ink";

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted">{label}</p>
      <div className="flex rounded-sm border border-line bg-canvas p-1" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.id)}
              className={cn(
                "press h-10 flex-1 rounded-xs text-sm font-medium",
                active ? "bg-accent text-accent-fg" : "text-muted",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
