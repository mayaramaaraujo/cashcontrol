import { ImageResponse } from "next/og";
import { buildLogo } from "@/shared/lib/logo";

const size = { width: 512, height: 512 };

export function GET() {
  return new ImageResponse(
    buildLogo({ size: size.width, rounded: false }),
    size
  );
}
