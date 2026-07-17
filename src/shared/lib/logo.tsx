import type { ReactElement } from "react";

const GRADIENT = "linear-gradient(145deg, #c264af 0%, #7d7bd6 100%)";
const ACCENT = "#6fd4ce";

/**
 * Builds the CashControl mark (gradient badge + "C" + coin accent) as a
 * satori-compatible JSX tree, for use inside `next/og` ImageResponse calls
 * (icon.tsx, apple-icon.tsx, and the PWA icon routes) — kept in one place so
 * every generated icon stays visually identical.
 */
export function buildLogo({
  size,
  rounded,
  withAccent,
}: {
  size: number;
  rounded: boolean;
  withAccent: boolean;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: GRADIENT,
        borderRadius: rounded ? size * 0.22 : 0,
      }}
    >
      <span
        style={{
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: size * 0.56,
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        C
      </span>
      {withAccent ? (
        <div
          style={{
            position: "absolute",
            right: size * 0.13,
            bottom: size * 0.13,
            width: size * 0.24,
            height: size * 0.24,
            borderRadius: "50%",
            display: "flex",
            background: ACCENT,
            border: `${size * 0.035}px solid rgba(255, 255, 255, 0.92)`,
          }}
        />
      ) : null}
    </div>
  );
}
