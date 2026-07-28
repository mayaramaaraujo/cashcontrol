import type { TrendPoint } from "@/features/history/lib";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

interface TrendChartProps {
  trend: TrendPoint[];
  dict: Dictionary;
}

export function TrendChart({ trend, dict }: TrendChartProps) {
  const hasActivity = trend.some((point) => point.total > 0);

  return (
    <div className="rounded-3xl border border-surface-border bg-surface-1 p-4">
      {hasActivity ? (
        <div className="mt-0.5 flex items-end gap-2.5">
          {trend.map((point) => (
            <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-26 w-full flex-col justify-end">
                <div
                  className={`w-full rounded-md ${point.isCurrent ? "bg-primary" : "bg-primary/32"}`}
                  style={{ height: `${Math.max(point.percentOfMax, 4)}%` }}
                />
              </div>
              <span
                className={`text-xs font-semibold ${point.isCurrent ? "text-text-primary" : "text-text-subtle"}`}
              >
                {point.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-text-subtle">{dict.history.noIncomeSixMonths}</p>
      )}
    </div>
  );
}
