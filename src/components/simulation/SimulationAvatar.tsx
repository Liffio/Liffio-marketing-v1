import Image from "next/image";

type SimulationAvatarProps = {
  name: string;
  gradient?: string;
  photoUrl?: string;
  /** Matches simulation scale: size × 4px (e.g. 6 → 24px). */
  size?: number;
  className?: string;
};

export function SimulationAvatar({
  name,
  gradient = "linear-gradient(135deg,#94a3b8,#475569)",
  photoUrl,
  size = 7,
  className = "",
}: SimulationAvatarProps) {
  const px = size * 4;
  const initials = name.slice(0, 2).toUpperCase();

  if (photoUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-gray-200 ring-1 ring-black/5 ${className}`}
        style={{ width: px, height: px, minWidth: px, minHeight: px }}
      >
        <Image src={photoUrl} alt="" fill sizes={`${px}px`} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{
        width: px,
        height: px,
        fontSize: size <= 5 ? 7 : size <= 7 ? 9 : 11,
        background: gradient,
        minWidth: px,
        minHeight: px,
      }}
    >
      {initials}
    </div>
  );
}
