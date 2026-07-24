import type { ReactNode } from "react";
import { Users } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div
      className="flex flex-1 flex-col px-8 pb-16"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 4rem)" }}
    >
      <div className="flex size-14 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary-darker shadow-glow-primary">
        <Users className="size-7 text-text-primary" />
      </div>

      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-subtle">{subtitle}</p>

      <div className="mt-9 flex flex-1 flex-col">{children}</div>

      <p className="mt-4 text-center text-xs leading-relaxed text-text-faintest">
        By continuing you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
