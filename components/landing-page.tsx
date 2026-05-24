"use client";

import { useState, type SVGProps } from "react";
import Image from "next/image";

import { CollectionModal } from "@/components/collection-modal";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SiteLogo } from "@/components/site-logo";
import {
  collectionItems,
  contactMapEmbedUrl,
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

const heroLayoutVariant: "v1" | "v2" = "v2";

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

function HeroCollagePhoto({
  src,
  alt,
  className,
  objectPosition,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div
      className={classNames(
        "absolute overflow-hidden bg-[var(--warm-white)] p-3 shadow-[0_22px_60px_rgba(44,36,32,0.12)]",
        className,
      )}
    >
      <div className="relative size-full overflow-hidden bg-[var(--soft-gray)]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          priority={priority}
          sizes={sizes}
        />
      </div>
    </div>
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
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--sand-light)] bg-[rgba(250,246,240,0.92)] px-6 py-4 backdrop-blur-[12px] sm:px-10 lg:px-12 xl:px-20">
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

function HeroVisualV1() {
  return (
    <div className="relative px-6 pb-16 pt-2 sm:px-10 lg:flex lg:min-h-full lg:items-start lg:justify-center lg:px-8 lg:pb-10 lg:pt-0 xl:px-12">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,var(--warm-white)_0%,var(--warm-white)_48%,rgba(212,184,150,0.38)_48%,rgba(212,184,150,0.38)_100%)]" />

      <div className="relative mx-auto w-full max-w-[28rem] md:hidden">
        <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,rgba(253,249,244,0.96)_0%,rgba(253,249,244,0.96)_58%,rgba(212,184,150,0.34)_58%,rgba(212,184,150,0.34)_100%)]" />
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(44,36,32,0.08)] px-4 pb-6 pt-6">
          <p className="max-w-[16rem] text-[0.95rem] leading-[1.7] text-[var(--warm-gray)]">
            Desain elegan dengan detail jahitan yang rapi untuk momen yang terasa spesial.
          </p>

          <div className="relative mt-6 h-[24rem]">
            <div className="absolute left-0 top-12 h-16 w-16 bg-[rgba(212,184,150,0.42)]" />
            <div className="absolute left-0 top-32 h-16 w-16 bg-[rgba(139,83,71,0.9)]" />
            <div className="absolute left-5 top-8 h-[15rem] w-[68%] border-[3px] border-[rgba(44,36,32,0.22)]" />

            <HeroCollagePhoto
              src="/hero/hero-photo-middle.jpg"
              alt="Detail busana Anza Fashion"
              className="left-6 top-10 z-10 h-[15rem] w-[68%]"
              objectPosition="center 78%"
              priority
              sizes="(max-width: 767px) 70vw, 0px"
            />

            <HeroCollagePhoto
              src="/hero/hero-photo-bottom.jpg"
              alt="Potret pelanggan Anza Fashion"
              className="bottom-0 right-0 z-20 h-[10rem] w-[48%]"
              objectPosition="center 18%"
              sizes="(max-width: 767px) 45vw, 0px"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto hidden w-full max-w-[780px] md:block lg:pt-0">
        <div className="relative h-[34rem] lg:h-[35.5rem] xl:h-[34.5rem]">
          <div className="absolute right-[7%] top-[6%] h-[11.5rem] w-[29%] border-[3px] border-[rgba(44,36,32,0.28)] lg:h-[13rem]" />
          <div className="absolute left-[13%] top-[35%] h-[18rem] w-[58%] border-[3px] border-[rgba(44,36,32,0.28)] lg:h-[20rem] lg:w-[60%]" />
          <div className="absolute bottom-[1%] right-[6%] h-[11.5rem] w-[32%] border-[3px] border-[rgba(44,36,32,0.28)] lg:h-[13rem]" />

          <div className="absolute left-[2%] top-[43%] flex -translate-y-1/2 flex-col gap-5">
            <div className="h-16 w-16 bg-[rgba(212,184,150,0.42)] lg:h-20 lg:w-20" />
            <div className="h-16 w-16 bg-[rgba(139,83,71,0.9)] lg:h-20 lg:w-20" />
          </div>

          <HeroCollagePhoto
            src="/hero/hero-photo-middle.jpg"
            alt="Foto utama koleksi Anza Fashion"
            className="left-[19%] top-[41%] z-20 h-[16.5rem] w-[62%] -translate-y-1/2 lg:h-[18.5rem] lg:w-[64%]"
            objectPosition="center 65%"
            priority
            sizes="(max-width: 1023px) 62vw, 38vw"
          />

          <HeroCollagePhoto
            src="/hero/hero-photo-top.jpg"
            alt="Detail lengan dan tekstur busana Anza Fashion"
            className="right-[8%] top-[9%] z-30 h-[11rem] w-[31%] lg:h-[12.5rem]"
            objectPosition="center 20%"
            sizes="(max-width: 1023px) 28vw, 18vw"
          />

          <HeroCollagePhoto
            src="/hero/hero-photo-bottom.jpg"
            alt="Potret pelanggan mengenakan busana Anza Fashion"
            className="bottom-[2%] right-[7%] z-20 h-[10rem] w-[33%] lg:h-[11.5rem]"
            objectPosition="center 14%"
            sizes="(max-width: 1023px) 30vw, 20vw"
          />
        </div>
      </div>
    </div>
  );
}

function HeroVisualV2() {
  return (
    <div className="flex items-start justify-center bg-[var(--warm-white)] px-0 pb-6 pt-2 sm:pb-8 sm:pt-3 lg:pb-0 lg:pt-0">
      <Image
        src="/hero/full-hero-utama.jpg"
        alt="Hero utama Anza Fashion versi full image"
        width={4496}
        height={4500}
        priority
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 92vw, (max-width: 1535px) 54vw, 52rem"
        className="block h-auto w-full max-w-[34rem] object-contain sm:max-w-[38rem] md:max-w-[42rem] lg:max-w-none xl:max-w-[50rem] 2xl:max-w-[52rem]"
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="grid min-h-screen overflow-hidden pt-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
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

      {heroLayoutVariant === "v2" ? <HeroVisualV2 /> : <HeroVisualV1 />}
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalProductName, setModalProductName] = useState("");

  function openModal(images: string[], productName: string) {
    setModalImages(images);
    setModalProductName(productName);
    setModalOpen(true);
  }

  return (
    <section id="koleksi" className="bg-[var(--warm-white)] px-6 py-20 sm:px-10 lg:px-12 xl:px-28">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionTag>Galeri Karya</SectionTag>
          <h2 className={sectionTitleClassName}>Koleksi Pilihan</h2>
        </div>
        <GhostLink href="#kontak">Pesan Custom</GhostLink>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {collectionItems.map((item, index) => {
          const cardImage = item.image || item.images?.[0];
          const hasModal = item.images && item.images.length > 0;

          return (
          <Reveal key={item.name} delayMs={index * 120}>
            <article
              className="group h-full cursor-pointer transition duration-300 hover:-translate-y-1"
              onClick={() => {
                if (hasModal) openModal(item.images!, item.name);
              }}
            >
              <div className="relative aspect-square overflow-hidden bg-[var(--sand-light)]">
                {cardImage ? (
                  <Image
                    src={cardImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 639px) 30vw, (max-width: 1023px) 29vw, 28vw"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-[var(--warm-gray)] opacity-[0.45]">
                      <CollectionPlaceholderIcon icon={item.icon} className="size-12" />
                      <small className="text-[0.7rem] uppercase tracking-[0.1em]">
                        {item.label}
                      </small>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 flex items-end bg-[linear-gradient(to_top,rgba(44,36,32,0.65)_0%,transparent_55%)] p-6 opacity-0 transition group-hover:opacity-100">
                  <a
                    href="#kontak"
                    onClick={(e) => e.stopPropagation()}
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
          );
        })}
      </div>

      <CollectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={modalImages}
        productName={modalProductName}
      />
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
    <section id="kontak" className="flex flex-col gap-10 px-6 py-20 sm:px-10 lg:px-12 xl:px-28">
      <div className="grid gap-12 lg:grid-cols-2 xl:gap-24">
        <div>
          <SectionTag>Hubungi Kami</SectionTag>
          <h2 className={sectionTitleClassName}>
            Mari Mulai
            <br />
            Menjahit Bersama
          </h2>
          <p className={`${proseClassName} mb-10 mt-4`}>
            Konsultasikan kebutuhan jahit Anda bersama kami. Ceritakan model
            yang Anda impikan, kami wujudkan.
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
                    <div className="text-[0.92rem] text-[var(--charcoal)]">
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>

      <div className="space-y-4">
        <div className="px-1">
          <div className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--rose)]">
            Lokasi
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif-display text-[1.2rem] font-light text-[var(--charcoal)]">
              Anza Fashion, Semarang
            </p>
            <a
              href="https://maps.app.goo.gl/jifjMwcKwkMiRqgs8"
              target="_blank"
              rel="noreferrer"
              className="text-[0.78rem] uppercase tracking-[0.14em] text-[var(--warm-gray)] transition hover:text-[var(--rose)]"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.25rem] border border-[var(--soft-gray)] bg-[var(--sand-light)]">
          <iframe
            src={contactMapEmbedUrl}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta lokasi Anza Fashion"
            className="h-[260px] w-full md:h-[300px]"
          />
        </div>
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
