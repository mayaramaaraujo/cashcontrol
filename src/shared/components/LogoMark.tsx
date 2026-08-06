import Image from "next/image";

interface LogoMarkProps {
  className?: string;
}

/** The Finkith brand mark, served from `src/app/icon.png`. */
export function LogoMark({ className }: LogoMarkProps) {
  return <Image src="/icon.png" alt="Finkith" width={56} height={56} className={className} />;
}
