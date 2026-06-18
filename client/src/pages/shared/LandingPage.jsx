import PublicNavbar from '@/components/PublicNavbar';
import HeroeSection from '@/components/landingPage/HeroeSection';
import TrustedBy from '@/components/landingPage/TrustedBy';
import Features from '@/components/landingPage/Features';
import HowItWorks from '@/components/landingPage/HowItWorks';
import Categories from '@/components/landingPage/Categories';
import Testimonials from '@/components/landingPage/Testimonials';
import TrainersSpotlight from '@/components/landingPage/TrainersSpotlight';
import SuccessMetrics from '@/components/landingPage/SuccessMetrics';
import FAQ from '@/components/landingPage/FAQ';
import CTA from '@/components/landingPage/CTA';
import Footer from '@/components/landingPage/Footer';

export default function LandingPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-[90px] px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <HeroeSection />
          <TrustedBy />
          <Features />
          <HowItWorks />
          <Categories />
          <Testimonials />
          <TrainersSpotlight />
          <SuccessMetrics />
          <FAQ />
          <CTA />
        </div>
        <Footer />
      </main>
    </>
  );
}