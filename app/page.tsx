import Cta from '@/components/landing/cta';
import DashboardPreview from '@/components/landing/dashboard-preview';
import Features from '@/components/landing/features';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import Impact from '@/components/landing/impact';
import ProblemStatement from '@/components/landing/problem-statement';
import ResearchFoundation from '@/components/landing/research-foundation';
import Team from '@/components/landing/team';
import TechStack from '@/components/landing/tech-stack';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <div className="flex-1">
        <Hero />
        <ProblemStatement />
        <ResearchFoundation />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <Impact />
        <Team />
        <TechStack />
        <Cta />
      </div>
      <Footer />
    </div>
  );
}
