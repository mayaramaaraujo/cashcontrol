import { ImageResponse } from "next/og";
import { buildLogo } from "@/shared/lib/logo";

const size = { width: 192, height: 192 };

export function GET() {
  return new ImageResponse(
    buildLogo({ size: size.width, rounded: true, withAccent: true }),
    size
  );
}
