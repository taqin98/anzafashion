import type { SVGProps } from "react";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SiteLogo } from "@/components/site-logo";
import {
  collectionItems,
  contactItems,
  heroStats,
  marqueeItems,
  navLinks,
  serviceItems,
  testimonialItems,
  type CollectionIcon,
  type ContactItem,
} from "@/lib/site-content";

const sectionTagClassName =
  "mb-5 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.25em] text-[var(--rose)] before:block before:h-px before:w-7 before:bg-[var(--rose)] before:content-['']";

const sectionTitleClassName =
  "font-serif-display text-[clamp(2rem,3.5vw,3rem)] leading-[1.2] font-light";

const proseClassName =
  "text-[0.92rem] leading-[1.85] text-[var(--warm-gray)]";

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SectionTag({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <div
      className={classNames(
        sectionTagClassName,
        centered && "justify-center before:hidden",
      )}
    >
      {children}
    </div>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center bg-[var(--rose)] px-9 py-4 text-[0.8rem] uppercase tracking-[0.12em] text-white transition hover:-translate-y-px hover:bg-[var(--rose-dark)]"
    >
      {children}
    </a>
  );
}

function GhostLink({ href, children, dark = true }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className={classNames(
        "inline-flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.12em] transition",
        dark ? "text-[var(--charcoal)] hover:text-[var(--rose)]" : "text-[var(--cream)] hover:text-[var(--sand)]",
      )}
    >
      {children}
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}

function PlaceholderBox({
  icon,
  label,
  size = "default",
}: {
  icon: React.ReactNode;
  label: string;
  size?: "default" | "hero";
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-[var(--warm-gray)] opacity-[0.55]">
      <div className={size === "hero" ? "size-16" : "size-12"}>{icon}</div>
      <p
        className={classNames(
          "uppercase tracking-[0.1em]",
          size === "hero" ? "text-[0.8rem]" : "text-[0.7rem]",
        )}
      >
        {label}
      </p>
    </div>
  );
}

function HeroPlaceholderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <path d="M20 8h24l6 12v34a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20L20 8z" />
      <path d="M22 8c0 6 4 10 10 10s10-4 10-10" />
      <circle cx="32" cy="36" r="8" strokeDasharray="4 2" />
    </svg>
  );
}

function TailorPlaceholderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <circle cx="20" cy="12" r="6" />
      <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" />
    </svg>
  );
}

function FabricPlaceholderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <rect x="6" y="6" width="28" height="28" rx="1" />
      <path d="M6 20h28M20 6v28" />
    </svg>
  );
}

function CollectionPlaceholderIcon({
  icon,
  ...props
}: SVGProps<SVGSVGElement> & { icon: CollectionIcon }) {
  if (icon === "kebaya") {
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
        <path d="M14 6h20l8 10v26a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V16L14 6z" />
        <path d="M16 6c0 4.418 3.582 8 8 8s8-3.582 8-8" />
      </svg>
    );
  }

  if (icon === "dress") {
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
        <rect x="10" y="6" width="28" height="36" rx="2" />
        <path d="M10 18h28" />
      </svg>
    );
  }

  if (icon === "blouse") {
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
        <path d="M8 8l10 6h12l10-6v34H8V8z" />
        <path d="M18 14v28M30 14v28" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <path d="M24 8c-8 0-14 6-14 14v18h28V22c0-8-6-14-14-14z" />
      <path d="M16 24h16" />
    </svg>
  );
}

function ContactIcon({ type }: { type: ContactItem["type"] }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current [stroke-width:1.8]">
        <path d="M4 5.5c0-1.1.9-2 2-2h2.1c.8 0 1.5.55 1.72 1.32l.68 2.39c.16.56.01 1.16-.4 1.58l-1.27 1.27a14.5 14.5 0 0 0 6.1 6.1l1.27-1.27c.42-.41 1.02-.56 1.58-.4l2.39.68c.77.22 1.32.92 1.32 1.72V18c0 1.1-.9 2-2 2h-1c-8.28 0-15-6.72-15-15v-.5Z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current [stroke-width:1.8]">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current [stroke-width:1.8]">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--sand-light)] bg-[rgba(250,246,240,0.92)] px-5 py-4 backdrop-blur-[12px] md:px-8 xl:px-16">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5">
        <a
          href="#"
          className="inline-flex items-center self-center font-serif-display text-[1.5rem] font-semibold tracking-[0.05em]"
        >
          <SiteLogo compact />
        </a>
        <ul className="hidden list-none items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[0.82rem] uppercase tracking-[0.12em] text-[var(--warm-gray)] transition hover:text-[var(--rose)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#kontak"
          className="inline-flex border border-[var(--rose)] px-4 py-2.5 text-[0.76rem] uppercase tracking-[0.12em] text-[var(--rose)] transition hover:bg-[var(--rose)] hover:text-white md:px-6"
        >
          Pesan Sekarang
        </a>
      </div>
    </nav>
  );
}

export function HeroSection() {
  return (
    <section className="grid min-h-screen pt-20 lg:grid-cols-2">
      <div className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-12 xl:px-20">
        <div className="absolute bottom-[20%] left-0 top-[20%] hidden w-[3px] bg-[linear-gradient(to_bottom,transparent,var(--rose),transparent)] lg:block" />
        <div className="hero-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="mb-6 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.25em] text-[var(--rose)] before:block before:h-px before:w-[30px] before:bg-[var(--rose)] before:content-['']">
            Koleksi Eksklusif 2025
          </div>
        </div>
        <div className="hero-fade-up" style={{ animationDelay: "250ms" }}>
          <h1 className="font-serif-display text-[clamp(3rem,5.5vw,5rem)] leading-[1.1] font-light">
            Jahitan <em className="font-light text-[var(--rose)]">Tangan</em>
            <br />
            Penuh Kasih
          </h1>
        </div>
        <div className="hero-fade-up" style={{ animationDelay: "400ms" }}>
          <p className="mt-7 max-w-[380px] text-[0.95rem] leading-[1.75] text-[var(--warm-gray)]">
            Setiap helai benang dirajut dengan kesabaran dan ketelitian. Kami
            menjahit bukan sekadar baju - kami mewujudkan gaya Anda.
          </p>
        </div>
        <div className="hero-fade-up" style={{ animationDelay: "550ms" }}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <PrimaryLink href="#koleksi">Lihat Koleksi</PrimaryLink>
            <GhostLink href="#kontak">Pesan Custom</GhostLink>
          </div>
        </div>
        <div className="hero-fade-up" style={{ animationDelay: "700ms" }}>
          <div className="mt-16 flex flex-wrap gap-8 border-t border-[var(--soft-gray)] pt-8">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif-display text-[2.2rem] font-light">
                  {stat.value}
                </div>
                <div className="mt-1 text-[0.75rem] uppercase tracking-[0.1em] text-[var(--warm-gray)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-[var(--sand-light)] px-6 py-14 sm:px-10 lg:min-h-full">
        <div className="relative flex h-[80%] w-full max-w-[540px] items-center justify-center border border-[rgba(201,137,122,0.3)] before:pointer-events-none before:absolute before:-inset-y-2 before:left-2 before:right-[-8px] before:border before:border-[rgba(201,137,122,0.15)] before:content-[''] sm:w-[72%]">
          <PlaceholderBox
            icon={<HeroPlaceholderIcon className="size-full" />}
            label="Foto Produk Utama"
            size="hero"
          />
        </div>
        <div className="absolute bottom-[8%] right-[3%] min-w-[130px] bg-[var(--rose)] px-6 py-5 text-center font-serif-display text-base italic text-white shadow-[0_8px_30px_rgba(139,83,71,0.25)] sm:right-[-5%]">
          Made with Love
          <span className="mt-1 block text-[0.7rem] not-italic uppercase tracking-[0.15em] opacity-[0.85]">
            Handcrafted
          </span>
        </div>
      </div>
    </section>
  );
}

export function MarqueeSection() {
  const strip = marqueeItems.map((item) => `* ${item}`).join("   ");
  const content = `${strip}   ${strip}   ${strip}`;

  return (
    <div aria-hidden="true" className="overflow-hidden bg-[var(--charcoal)] py-4 text-[var(--sand-light)]">
      <div className="marquee-track inline-block whitespace-nowrap text-[0.72rem] uppercase tracking-[0.3em]">
        {content}
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="tentang" className="grid items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-12 xl:px-28">
      <div className="relative pr-0 lg:pr-16">
        <div className="aspect-[3/4] w-[75%] bg-[var(--rose-light)]">
          <div className="flex size-full items-center justify-center">
            <PlaceholderBox
              icon={<TailorPlaceholderIcon className="size-full" />}
              label="Foto Penjahit"
            />
          </div>
        </div>
        <div className="absolute -bottom-[8%] right-[5%] aspect-[4/3] w-[45%] border-[4px] border-[var(--cream)] bg-[var(--sand-light)]">
          <div className="flex size-full items-center justify-center">
            <PlaceholderBox
              icon={<FabricPlaceholderIcon className="size-full" />}
              label="Detail Kain"
            />
          </div>
        </div>
      </div>

      <div className="lg:pl-8">
        <SectionTag>Tentang Kami</SectionTag>
        <h2 className={sectionTitleClassName}>
          Menjahit Adalah
          <br />
          Seni Kami
        </h2>
        <p className={`${proseClassName} mb-5 mt-6`}>
          Berawal dari kecintaan pada dunia fashion dan keterampilan tangan yang
          terus diasah selama bertahun-tahun, kami hadir untuk memberikan layanan
          jahit berkualitas tinggi yang disesuaikan dengan kebutuhan Anda.
        </p>
        <p className={proseClassName}>
          Setiap pakaian dikerjakan dengan penuh perhatian pada detail - dari
          pemilihan bahan, pola, hingga jahitan akhir. Kami percaya bahwa busana
          yang baik bukan hanya soal tampilan, tetapi juga soal kenyamanan dan
          kepercayaan diri.
        </p>
        <div className="mt-8 font-serif-display text-[1.8rem] italic text-[var(--rose)]">
          Selamat datang di Anza Fashion.
        </div>
      </div>
    </section>
  );
}

export function CollectionSection() {
  return (
    <section id="koleksi" className="bg-[var(--warm-white)] px-6 py-20 sm:px-10 lg:px-12 xl:px-28">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionTag>Galeri Karya</SectionTag>
          <h2 className={sectionTitleClassName}>Koleksi Pilihan</h2>
        </div>
        <GhostLink href="#kontak">Pesan Custom</GhostLink>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {collectionItems.map((item, index) => (
          <Reveal
            key={item.name}
            delayMs={index * 120}
            className={item.featured ? "xl:row-span-2" : ""}
          >
            <article className="group h-full cursor-pointer transition duration-300 hover:-translate-y-1">
              <div
                className={classNames(
                  "relative overflow-hidden bg-[var(--sand-light)]",
                  item.featured ? "h-full min-h-[26rem]" : "aspect-[3/4]",
                )}
              >
                <div className="flex size-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-[var(--warm-gray)] opacity-[0.45]">
                    <CollectionPlaceholderIcon icon={item.icon} className="size-12" />
                    <small className="text-[0.7rem] uppercase tracking-[0.1em]">
                      {item.label}
                    </small>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 flex items-end bg-[linear-gradient(to_top,rgba(44,36,32,0.65)_0%,transparent_55%)] p-6 opacity-0 transition group-hover:opacity-100">
                  <a
                    href="#kontak"
                    className="pointer-events-auto border border-white/60 px-5 py-2.5 text-[0.73rem] uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-[var(--charcoal)]"
                  >
                    Pesan Ini
                  </a>
                </div>

                {item.badge ? (
                  <div
                    className={classNames(
                      "absolute right-4 top-4 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-white",
                      item.badgeTone === "terracotta"
                        ? "bg-[var(--terracotta)]"
                        : "bg-[var(--rose)]",
                    )}
                  >
                    {item.badge}
                  </div>
                ) : null}
              </div>

              <div className="px-0 py-4">
                <h3 className="font-serif-display text-[1.25rem]">{item.name}</h3>
                <div className="mt-1 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--warm-gray)]">
                  {item.category}
                </div>
                <div className="mt-2 font-serif-display text-[1.1rem] text-[var(--rose)]">
                  {item.price}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section id="layanan" className="grid gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_1.6fr] lg:px-12 xl:gap-24 xl:px-28">
      <div>
        <SectionTag>Layanan Kami</SectionTag>
        <h2 className={sectionTitleClassName}>
          Apa yang
          <br />
          Kami Tawarkan
        </h2>
        <p className={`${proseClassName} mb-8 mt-4`}>
          Dari jahit custom sesuai selera hingga renovasi baju lama - kami siap
          membantu dengan pengerjaan rapi dan tepat waktu.
        </p>
        <PrimaryLink href="#kontak">Konsultasi Gratis</PrimaryLink>
      </div>

      <div className="flex flex-col gap-6">
        {serviceItems.map((item, index) => (
          <Reveal key={item.number} delayMs={index * 120}>
            <div className="grid gap-5 border border-[var(--soft-gray)] bg-[var(--warm-white)] p-6 transition hover:border-[var(--rose-light)] sm:grid-cols-[3rem_1fr]">
              <div className="font-serif-display text-[2rem] leading-none font-light text-[var(--rose-light)]">
                {item.number}
              </div>
              <div>
                <h3 className="font-serif-display text-[1.2rem]">{item.name}</h3>
                <p className="mt-2 text-[0.83rem] leading-[1.7] text-[var(--warm-gray)]">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-[var(--charcoal)] px-6 py-20 text-[var(--cream)] sm:px-10 lg:px-12 xl:px-28">
      <div className="mb-16 text-center">
        <SectionTag centered>Testimoni</SectionTag>
        <h2 className={`${sectionTitleClassName} text-[var(--cream)]`}>Kata Mereka</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {testimonialItems.map((item, index) => (
          <Reveal key={item.name} delayMs={index * 120}>
            <article className="border border-[rgba(212,184,150,0.2)] bg-white/[0.03] p-8 transition hover:border-[rgba(201,137,122,0.4)]">
              <div className="mb-4 text-[0.85rem] text-[var(--rose)]">★★★★★</div>
              <div className="mb-2 font-serif-display text-[3.5rem] leading-none text-[var(--rose)]">
                &ldquo;
              </div>
              <p className="mb-6 font-serif-display text-[1.05rem] leading-[1.8] text-[rgba(250,246,240,0.75)] italic">
                {item.quote}
              </p>
              <div className="text-[0.78rem] uppercase tracking-[0.15em] text-[var(--sand)]">
                - {item.name}, {item.location}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="kontak" className="grid gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-12 xl:gap-24 xl:px-28">
      <div>
        <SectionTag>Hubungi Kami</SectionTag>
        <h2 className={sectionTitleClassName}>
          Mari Mulai
          <br />
          Menjahit Bersama
        </h2>
        <p className={`${proseClassName} mb-10 mt-4`}>
          Konsultasikan kebutuhan jahit Anda bersama kami. Ceritakan model yang
          Anda impikan, kami wujudkan.
        </p>

        <div className="flex flex-col gap-5">
          {contactItems.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--rose-light)] text-[var(--rose-dark)]">
                <ContactIcon type={item.type} />
              </div>
              <div>
                <div className="mb-1 text-[0.7rem] uppercase tracking-[0.12em] text-[var(--warm-gray)]">
                  {item.label}
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[0.92rem] text-[var(--charcoal)] transition hover:text-[var(--rose)]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="text-[0.92rem] text-[var(--charcoal)]">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <ContactForm />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="flex flex-col gap-6 bg-[var(--charcoal)] px-6 py-10 text-center text-[rgba(250,246,240,0.55)] sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:text-left xl:px-28">
      <a href="#" className="text-[var(--cream)]">
        <SiteLogo tone="light" />
      </a>
      <p className="text-[0.78rem]">© 2025 Anza Fashion · Made with care</p>
      <div className="flex flex-wrap items-center justify-center gap-8 lg:justify-end">
        {navLinks.concat({ href: "#kontak", label: "Kontak" }).map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[0.75rem] uppercase tracking-[0.1em] text-[rgba(250,246,240,0.45)] transition hover:text-[var(--rose)]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
