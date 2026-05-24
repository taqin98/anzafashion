import Image from "next/image";

type SiteLogoProps = {
  tone?: "dark" | "light";
  compact?: boolean;
};

export function SiteLogo({
  tone = "dark",
  compact = false,
}: SiteLogoProps) {
  const textColor =
    tone === "light" ? "text-[var(--cream)]" : "text-[var(--charcoal)]";
  const subColor =
    tone === "light"
      ? "text-[rgba(250,246,240,0.62)]"
      : "text-[var(--warm-gray)]";

  const logoFrameClassName = compact
    ? "rounded-md p-0.5"
    : "rounded-lg p-1";
  const logoSizeClassName = compact
    ? "h-9 w-9 md:h-10 md:w-10"
    : "h-11 w-11 md:h-12 md:w-12";
  const titleClassName = compact
    ? "text-sm md:text-[0.95rem]"
    : "text-sm md:text-base";

  return (
    <span className="inline-flex items-center gap-3">
      <span className={`inline-flex shrink-0 bg-black ${logoFrameClassName}`}>
        <Image
          src="/anza-mark.png"
          alt="Anza Fashion logo"
          width={500}
          height={500}
          className={`${logoSizeClassName} h-auto object-contain`}
          priority
        />
      </span>
      <span className="flex flex-col">
        <span
          className={`${textColor} ${titleClassName} font-medium uppercase tracking-[0.22em]`}
        >
          Anza Fashion
        </span>
        {!compact ? (
          <span className={`${subColor} text-[0.62rem] tracking-[0.18em] md:text-[0.68rem]`}>
            Made in Indonesia
          </span>
        ) : null}
      </span>
    </span>
  );
}
