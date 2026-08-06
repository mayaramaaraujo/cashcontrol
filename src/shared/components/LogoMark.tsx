import Image from "next/image";

interface LogoMarkProps {
  className?: string;
}

/** The Finkith brand mark (wallet + cash + bar chart), served from `src/app/icon.svg`. */
export function LogoMark({ className }: LogoMarkProps) {
  return <Image src="/icon.svg" alt="Finkith" width={56} height={56} className={className} />;
}
