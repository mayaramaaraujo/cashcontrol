import type { ReactNode } from "react";
import { LogoMark } from "@/shared/components/LogoMark";

interface AuthShellProps {
  title: string;
  subtitle: string;
  termsNotice: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, termsNotice, children }: AuthShellProps) {
  return (
    <div
      className="flex flex-1 flex-col px-8 pb-16"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 4rem)" }}
    >
      <LogoMark className="size-14 rounded-xl shadow-glow-primary" />

      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-subtle">{subtitle}</p>

      <div className="mt-9 flex flex-1 flex-col">{children}</div>

      <p className="mt-4 text-center text-xs leading-relaxed text-text-faintest">{termsNotice}</p>
    </div>
  );
}
