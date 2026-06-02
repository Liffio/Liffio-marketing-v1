type CountryFlagProps = {
  countryCode: string | null | undefined;
  className?: string;
  size?: number;
};

/** Renders a country flag reliably (emoji flags often fail on Windows). */
export function CountryFlag({ countryCode, className = "", size = 20 }: CountryFlagProps) {
  const code = countryCode?.trim().toUpperCase();

  if (!code || code.length !== 2 || !/^[A-Z]{2}$/.test(code) || code === "XX") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-sm bg-gray-200 text-[10px] font-bold text-gray-600 ${className}`}
        style={{ width: Math.round(size * 1.25), height: size }}
        aria-hidden
      >
        🌍
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      width={Math.round(size * 1.25)}
      height={size}
      alt=""
      className={`inline-block shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-black/5 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
