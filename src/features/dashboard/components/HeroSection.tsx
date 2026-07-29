import { formatCurrency } from "@/shared/lib/utils";
import { CURRENCY_SYMBOL, type Currency } from "@/shared/lib/currency";
import type { HeroData, SummaryMode } from "@/features/dashboard/lib";

interface HeroSectionProps {
  hero: Record<SummaryMode, HeroData>;
  currency: Currency;
}

export function HeroSection({ hero, currency }: HeroSectionProps) {
  const symbol = CURRENCY_SYMBOL[currency];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/22 bg-gradient-to-br from-bg-hero-from via-bg-hero-via to-bg-hero-to p-6">
      <div className="hero-glow absolute -top-16 -right-10 size-44 rounded-full" />

      <p className="relative text-xs font-semibold tracking-wide text-primary-muted">
        {hero.income.label}
      </p>
      <div className="relative mt-2 flex items-end gap-1.5">
        <span className="font-display text-2xl font-medium text-text-primary">{symbol}</span>
        <span className="font-display text-5xl font-extrabold tracking-tighter text-text-primary">
          {formatCurrency(hero.income.value, currency)}
        </span>
      </div>
      <p className="relative mt-3 text-sm text-text-muted">{hero.income.sub}</p>

      <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-surface-border pt-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary-muted">
            {hero.bills.label}
          </p>
          <p className="mt-1 font-display text-xl font-bold text-text-primary">
            {symbol}{formatCurrency(hero.bills.value, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary-muted">
            {hero.left.label}
          </p>
          <p className={`mt-1 font-display text-xl font-bold ${hero.left.colorClass}`}>
            {symbol}{formatCurrency(hero.left.value, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
