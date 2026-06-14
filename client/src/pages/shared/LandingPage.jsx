import PublicNavbar from '@/components/PublicNavbar';
import HeroSection from '@/components/landingPage/HeroeSection';
import Features from '@/components/landingPage/Features';
import CTA from '@/components/landingPage/CTA';
import Footer from '@/components/landingPage/Footer';

export default function LandingPage() {
  return (
    <>
      <PublicNavbar />

      <main className="pt-[90px] px-6">
        <div className="max-w-7xl mx-auto space-y-16">

          <HeroSection />

          <Features />

          <CTA />

        </div>

        <Footer />
      </main>
    </>
  );
}