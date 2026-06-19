import PublicNavbar from '@/components/PublicNavbar';
import HeroeSection from '@/components/landingPage/HeroeSection';
import TrustedOrganizations from '@/components/landingPage/TrustedOrganizations';
import Stats from '@/components/landingPage/Stats';
import Features from '@/components/landingPage/Features';
import HowItWorks from '@/components/landingPage/HowItWorks';
import Categories from '@/components/landingPage/Categories';
import SuccessMetrics from '@/components/landingPage/SuccessMetrics';
import Testimonials from '@/components/landingPage/Testimonials';
import TrainersSpotlight from '@/components/landingPage/TrainersSpotlight';
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
          <TrustedOrganizations />
          <Stats />
          <Features />
          <HowItWorks />
          <Categories />
          <SuccessMetrics />
          <Testimonials />
          <TrainersSpotlight />
          <FAQ />
          <CTA />
        </div>
        <Footer />
      </main>
    </>
  );
}