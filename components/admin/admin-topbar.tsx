"use client";

type AdminTopbarProps = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export function AdminTopbar({
  title,
  subtitle,
  actionLabel,
  onActionClick,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-[73px] z-20 border-b border-[rgba(44,36,32,0.08)] bg-[rgba(253,248,240,0.94)] backdrop-blur lg:top-0">
      <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 lg:px-7">
        <div className="min-w-0">
          <div className="font-sans text-[1rem] font-medium text-[#2c2420]">
            {title}
          </div>
          <div className="font-sans text-[0.74rem] leading-5 text-[#7a6b63]">
            {subtitle}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {actionLabel && onActionClick ? (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-2 rounded-[12px] border border-[rgba(44,36,32,0.12)] px-3 py-2.5 font-sans text-[0.76rem] font-medium text-[#7a6b63] transition hover:bg-[#f3ece2] sm:px-4"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current [stroke-width:1.8]">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden sm:inline">{actionLabel}</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          ) : null}

          <div className="relative flex size-10 items-center justify-center rounded-[12px] border border-[rgba(44,36,32,0.08)] bg-[#f7f0e7] text-[#7a6b63]">
            <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current [stroke-width:1.8]">
              <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M10 17a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#d4a017]" />
          </div>
        </div>
      </div>
    </header>
  );
}
