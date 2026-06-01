import Image from "next/image";

type SimulationPostImageProps = {
  src: string;
  alt: string;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function SimulationPostImage({
  src,
  alt,
  height = 148,
  className = "",
  priority = false,
}: SimulationPostImageProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${className}`} style={{ height }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 320px) 280px, 300px"
        className="object-cover"
        priority={priority}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.35) 100%)" }}
        aria-hidden
      />
    </div>
  );
}
