import { ImageResponse } from "next/og";
import { buildLogo } from "@/shared/lib/logo";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    buildLogo({ size: size.width, rounded: true }),
    size
  );
}
