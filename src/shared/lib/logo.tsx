import type { ReactElement } from "react";

// Raw hex values, not Tailwind classes — `next/og`'s ImageResponse (satori)
// can't consume CSS custom properties, so these mirror --color-primary /
// --color-primary-darker from globals.css directly.
const GRADIENT = "linear-gradient(145deg, #c264af 0%, #8a3f7d 100%)";

/**
 * Builds the CashControl mark: the app's gradient tile plus a two-person
 * glyph (echoing AuthShell.tsx's lucide `Users` icon — the app's "shared
 * with someone" motif). Rendered as plain divs/border-radius rather than
 * the literal SVG path: satori (next/og's renderer) doesn't render nested
 * <svg>/<path> trees or SVG data-URI <img> sources, only flexbox + a CSS
 * subset (confirmed by testing both against this project's next/og build —
 * both silently produced a blank box), so the glyph is rebuilt from shapes
 * satori does support.
 */
export function buildLogo({ size, rounded }: { size: number; rounded: boolean }): ReactElement {
  const headSize = size * 0.16;
  const bodyWidth = size * 0.26;
  const bodyHeight = size * 0.14;
  const person = (scale: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: headSize * scale,
          height: headSize * scale,
          borderRadius: "50%",
          background: "#ffffff",
        }}
      />
      <div
        style={{
          marginTop: size * 0.02,
          width: bodyWidth * scale,
          height: bodyHeight * scale,
          borderRadius: `${bodyWidth}px ${bodyWidth}px 0 0`,
          background: "#ffffff",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: GRADIENT,
        borderRadius: rounded ? size * 0.22 : 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div style={{ display: "flex", marginRight: -size * 0.07, opacity: 0.6 }}>
          {person(0.82)}
        </div>
        <div style={{ display: "flex" }}>{person(1)}</div>
      </div>
    </div>
  );
}
