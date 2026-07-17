/** Formats a number as the design's currency string, e.g. 1234 -> "1.234" (de-DE grouping, no symbol — the € sign is rendered separately). */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("de-DE");
}

/** Uppercase initial(s) for an avatar, e.g. "Elena" -> "E". */
export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

/** Translucent tint of a hex color, for icon/badge backgrounds. */
export function tint(hex: string, alpha = 0.16): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Diagonal gradient from a hex color to a darkened variant, used for avatar backgrounds. */
export function avatarGradient(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const dark = `rgb(${Math.round(r * 0.62)}, ${Math.round(g * 0.62)}, ${Math.round(b * 0.62)})`;
  return `linear-gradient(145deg, rgb(${r}, ${g}, ${b}), ${dark})`;
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
}
