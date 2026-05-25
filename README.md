# Anza Fashion Landing Page

Landing page katalog jahitan untuk **Anza Fashion**, dibangun dengan **Next.js App Router**, **TypeScript**, dan **Tailwind CSS**.

Project ini merupakan hasil migrasi dari file HTML statis yang kini diarsipkan di `references/katalog-jahitan.original.html` menjadi aplikasi Next.js yang lebih rapi, reusable, dan siap deploy ke Vercel.

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
- API route `/api/collections` untuk data koleksi dari Google Spreadsheet via Google Apps Script
- API route `/api/contact` untuk menyimpan form kontak ke Google Spreadsheet via Google Apps Script
- Reveal-on-scroll animation memakai `IntersectionObserver`
- Branding `Anza Fashion` dengan logo SVG dan favicon custom

## Project Structure

```text
app/
  globals.css          Global styles dan design tokens
  icon.svg             Favicon / app icon
  layout.tsx           Root layout dan metadata
  page.tsx             Komposisi landing page
  api/contact/route.ts Backend submit form kontak

components/
  contact-form.tsx     Form kontak client-side
  landing-page.tsx     Seluruh section landing page
  reveal.tsx           Wrapper animasi reveal
  site-logo.tsx        Komponen logo brand

lib/
  collection-api.ts    Shared type dan meta response koleksi
  collection-source.server.ts  Loader server-side untuk Apps Script / fallback
  contact-api.ts       Shared type payload/response form kontak
  contact-submit.server.ts  Submitter server-side ke Apps Script
  site-content.ts      Data statis untuk nav, koleksi, layanan, testimoni, kontak

public/
  anza-logo.svg        Versi lockup logo
  anza-mark.svg        Versi mark/icon logo

references/
  google-apps-script-collections.gs Template Apps Script untuk expose spreadsheet
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

- `public/anza-mark.png`
- `public/anza-mark-dark.svg`
- `public/anza-mark-light.svg`
- `public/anza-mark.svg`
- `public/anza-logo.svg`
- `app/icon.png`

Jika ingin mengganti logo:

1. Ganti file SVG di `public/`
2. Sesuaikan komponen `components/site-logo.tsx` bila proporsi/logo lockup berubah
3. Ganti `app/icon.svg` jika favicon juga berubah

## Content Editing

Sebagian besar teks landing page bisa diubah tanpa menyentuh JSX layout:

- edit `lib/site-content.ts` untuk:
  - navigasi
  - statistik hero
  - layanan
  - testimoni
  - kontak

Untuk teks yang memang menyatu dengan struktur section, edit:

- `components/landing-page.tsx`

Data koleksi utama sekarang sebaiknya dikelola dari Google Spreadsheet.

## Collections API

Endpoint koleksi tersedia di:

- `GET /api/collections`

Query params:

- `page` default `1`
- `limit` default `6`

Contoh response:

```json
{
  "data": [
    {
      "name": "Kebaya Modern Elegan",
      "category": "Kebaya · Formal",
      "price": "Rp450.000",
      "label": "Foto Produk 1",
      "icon": "kebaya",
      "image": "https://...",
      "images": ["https://..."],
      "badge": "Best Seller",
      "badgeTone": "rose"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 6,
    "totalItems": 12,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "source": "google-apps-script"
  }
}
```

Jika `GOOGLE_APPS_SCRIPT_URL` belum diisi atau Apps Script gagal diakses, API akan fallback ke data statis di `lib/site-content.ts`.

## Contact API

Endpoint form kontak tersedia di:

- `POST /api/contact`

Request body:

```json
{
  "fullName": "Nama Anda",
  "phoneNumber": "08123456789",
  "serviceType": "Jahit Custom",
  "description": "Butuh kebaya untuk acara keluarga."
}
```

Response sukses:

```json
{
  "ok": true,
  "message": "Pesan berhasil dikirim."
}
```

## Google Spreadsheet Setup

1. Buat sheet bernama `collections`
2. Gunakan header baris pertama:
   `name`, `category`, `price`, `label`, `icon`, `image`, `images`, `badge`, `badge_tone`, `sort_order`, `is_active`
3. Isi `images` dengan daftar URL dipisah koma atau JSON array
4. Nilai `icon` yang didukung: `kebaya`, `dress`, `blouse`, `gamis`
5. Ambil spreadsheet ID dari URL Google Sheets:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
6. Buat Apps Script baru dan tempel file `references/google-apps-script-collections.gs`, lalu ganti `YOUR_SPREADSHEET_ID`
7. Jalankan `setupCollectionsSheet()` sekali jika ingin script otomatis membuat sheet koleksi, field, dan sample data referensi
8. Jalankan `setupContactRequestsSheet()` sekali jika ingin script otomatis membuat sheet form kontak
9. Deploy ulang sebagai Web App dengan akses `Anyone with the link`
10. Simpan URL hasil deploy ke `.env.local`:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
COLLECTION_IMAGE_HOSTS=lh3.googleusercontent.com,images.unsplash.com
```

Gunakan host gambar yang benar-benar dipakai URL pada kolom `image` atau `images`. Jika domain belum didaftarkan di `COLLECTION_IMAGE_HOSTS`, `next/image` akan menolak render gambar remote tersebut.

Sheet form kontak yang dibuat otomatis bernama `contact_requests` dengan field:
`submitted_at`, `full_name`, `phone_number`, `service_type`, `description`, `status`, `source`

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
- File `references/katalog-jahitan.original.html` disimpan sebagai referensi desain awal, bukan entrypoint aplikasi.
- Branding aktif di aplikasi sekarang adalah **Anza Fashion**.
