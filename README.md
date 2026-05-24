# Anza Fashion

Landing page katalog jahitan untuk **Anza Fashion**, dibangun dengan **Next.js App Router**, **TypeScript**, dan **Tailwind CSS**.

Project ini merupakan hasil migrasi dari file HTML statis `katalog-jahitan.html` menjadi aplikasi Next.js yang lebih rapi, reusable, dan siap deploy ke Vercel.

## Preview

- Production: `https://anzafashion.vercel.app`

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Vercel

## Features

- Landing page satu halaman dengan section terpisah dan reusable
- Styling berbasis Tailwind dengan design token di `app/globals.css`
- Data section dipusatkan di `lib/site-content.ts`
- Contact form mock dengan feedback sukses di sisi client
- Reveal-on-scroll animation memakai `IntersectionObserver`
- Branding `Anza Fashion` dengan logo SVG dan favicon custom

## Project Structure

```text
app/
  globals.css          Global styles dan design tokens
  icon.svg             Favicon / app icon
  layout.tsx           Root layout dan metadata
  page.tsx             Komposisi landing page

components/
  contact-form.tsx     Form kontak client-side
  landing-page.tsx     Seluruh section landing page
  reveal.tsx           Wrapper animasi reveal
  site-logo.tsx        Komponen logo brand

lib/
  site-content.ts      Data statis untuk nav, koleksi, layanan, testimoni, kontak

public/
  anza-logo.svg        Versi lockup logo
  anza-mark.svg        Versi mark/icon logo

references/
  katalog-jahitan.original.html  Arsip HTML asli sebelum migrasi
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

App akan berjalan di:

- `http://localhost:3000`

### 3. Lint

```bash
npm run lint
```

### 4. Production build

```bash
npm run build
```

### 5. Run production build locally

```bash
npm run start
```

## Branding Assets

Brand asset utama ada di file berikut:

- `public/anza-mark.svg`
- `public/anza-logo.svg`
- `app/icon.svg`

Jika ingin mengganti logo:

1. Ganti file SVG di `public/`
2. Sesuaikan komponen `components/site-logo.tsx` bila proporsi/logo lockup berubah
3. Ganti `app/icon.svg` jika favicon juga berubah

## Content Editing

Sebagian besar teks landing page bisa diubah tanpa menyentuh JSX layout:

- edit `lib/site-content.ts` untuk:
  - navigasi
  - statistik hero
  - koleksi
  - layanan
  - testimoni
  - kontak

Untuk teks yang memang menyatu dengan struktur section, edit:

- `components/landing-page.tsx`

## Deployment

Project ini ditujukan untuk deploy ke **Vercel**.

### Deploy via CLI

```bash
vercel
```

Untuk production deploy:

```bash
vercel --prod
```

Jika CLI global terlalu lama, gunakan:

```bash
npx vercel@latest --prod
```

## Notes

- Project menggunakan `next/font/google`, jadi proses build butuh akses internet untuk mengambil font.
- File `katalog-jahitan.html` dan `references/katalog-jahitan.original.html` disimpan sebagai referensi desain awal, bukan entrypoint aplikasi.
- Branding aktif di aplikasi sekarang adalah **Anza Fashion**.
