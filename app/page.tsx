import {
  AboutSection,
  CollectionSection,
  ContactSection,
  Footer,
  HeroSection,
  MarqueeSection,
  Navbar,
  ServicesSection,
  TestimonialsSection,
} from "@/components/landing-page";

export default function HomePage() {
  return (
    <main className="bg-[var(--cream)] text-[var(--charcoal)]">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <CollectionSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

