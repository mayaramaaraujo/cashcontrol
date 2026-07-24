import { ImageResponse } from "next/og";
import { buildLogo } from "@/shared/lib/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    buildLogo({ size: size.width, rounded: false }),
    size
  );
}
