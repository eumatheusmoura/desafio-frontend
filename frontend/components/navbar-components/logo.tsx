import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo_ot.png"
      alt="Logo da empresa"
      width={25}
      height={0}
      priority
      className="h-auto w-auto max-h-10"
    />
  );
}
