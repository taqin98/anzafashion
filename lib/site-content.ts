export type NavLink = {
  href: string;
  label: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type CollectionIcon = "kebaya" | "dress" | "blouse" | "gamis";

export type CollectionItem = {
  name: string;
  category: string;
  price: string;
  label: string;
  icon: CollectionIcon;
  featured?: boolean;
  badge?: string;
  badgeTone?: "rose" | "terracotta";
};

export type ServiceItem = {
  number: string;
  name: string;
  description: string;
};

export type TestimonialItem = {
  name: string;
  location: string;
  quote: string;
};

export type ContactItem = {
  type: "phone" | "instagram" | "location";
  label: string;
  value: string;
  href?: string;
};

export const navLinks: NavLink[] = [
  { href: "#koleksi", label: "Koleksi" },
  { href: "#layanan", label: "Layanan" },
  { href: "#tentang", label: "Tentang" },
];

export const heroStats: StatItem[] = [
  { value: "200+", label: "Pelanggan Puas" },
  { value: "5+", label: "Tahun Pengalaman" },
  { value: "100%", label: "Jahit Tangan" },
];

export const marqueeItems = [
  "Jahit Custom",
  "Kualitas Premium",
  "Desain Eksklusif",
  "Pengerjaan Teliti",
  "Kepuasan Terjamin",
];

export const collectionItems: CollectionItem[] = [
  {
    name: "Kebaya Modern Elegan",
    category: "Kebaya · Formal",
    price: "Mulai Rp 350.000",
    label: "Foto Produk 1",
    icon: "kebaya",
    featured: true,
    badge: "Terlaris",
    badgeTone: "rose",
  },
  {
    name: "Dress Batik Casual",
    category: "Dress · Kasual",
    price: "Mulai Rp 280.000",
    label: "Foto Produk 2",
    icon: "dress",
    badge: "Baru",
    badgeTone: "terracotta",
  },
  {
    name: "Blouse Tenun Premium",
    category: "Blouse · Semi-formal",
    price: "Mulai Rp 220.000",
    label: "Foto Produk 3",
    icon: "blouse",
  },
  {
    name: "Gamis Brokat Mewah",
    category: "Gamis · Pesta",
    price: "Mulai Rp 450.000",
    label: "Foto Produk 4",
    icon: "gamis",
  },
];

export const serviceItems: ServiceItem[] = [
  {
    number: "01",
    name: "Jahit Custom",
    description:
      "Buat pakaian dari nol sesuai model, ukuran, dan kain pilihan Anda. Konsultasi desain gratis.",
  },
  {
    number: "02",
    name: "Permak & Renovasi",
    description:
      "Perbaiki atau ubah ukuran pakaian lama agar kembali muat dan tampil segar seperti baru.",
  },
  {
    number: "03",
    name: "Busana Pesta & Pernikahan",
    description:
      "Gaun pengantin, bridesmaid, kebaya akad, dan busana pesta spesial untuk momen tak terlupakan.",
  },
  {
    number: "04",
    name: "Seragam & Pesanan Massal",
    description:
      "Tersedia untuk pesanan dalam jumlah banyak - seragam kantor, sekolah, atau komunitas.",
  },
];

export const testimonialItems: TestimonialItem[] = [
  {
    name: "Rina S.",
    location: "Jakarta",
    quote:
      "Hasilnya melebihi ekspektasi. Jahitannya sangat rapi dan pas di badan. Pasti order lagi untuk seragam kerja kami.",
  },
  {
    name: "Dewi P.",
    location: "Bekasi",
    quote:
      "Gaun pesta saya jadi sempurna. Dikerjakan cepat dan sesuai desain yang saya inginkan. Sangat recommended.",
  },
  {
    name: "Siti A.",
    location: "Depok",
    quote:
      "Sudah 3 kali order kebaya di sini. Kualitasnya konsisten bagus dan harga sangat terjangkau. Terima kasih.",
  },
];

export const contactItems: ContactItem[] = [
  {
    type: "phone",
    label: "WhatsApp",
    value: "0856-0006-6840",
    href: "https://wa.me/6285600066840",
  },
  {
    type: "instagram",
    label: "Instagram",
    value: "@anzafashionofficial",
    href: "https://instagram.com/anzafashionofficial",
  },
];

export const contactMapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.659353059105!2d110.48170089999999!3d-7.049255500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708dd3bde1980d%3A0xcf5ab909630e0e5c!2sAnza%20Fashion!5e0!3m2!1sen!2sid!4v1779604395398!5m2!1sen!2sid";

export const serviceOptions = [
  "Jahit Custom",
  "Permak / Renovasi",
  "Busana Pesta & Pernikahan",
  "Seragam & Pesanan Massal",
];
