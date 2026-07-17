interface ProgressBarProps {
  percent: number;
  color?: string;
  className?: string;
}

export function ProgressBar({ percent, color = "bg-primary", className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-surface-3 ${className}`}>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
