import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AnalyticsSection } from "@/components/landing/analytics-section";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-teal-500/30 selection:text-teal-100">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_20%,black,transparent)]">
          {/* Using a placeholder or generated gradient if image not available, but user provided unsplash link. 
              I'll use a CSS gradient fallback or the generated health preview as a subtle background if needed.
              For now, I'll use a subtle noise/gradient effect to match the 'premium' feel without relying on external hotlinks. */}
          <div className="w-full h-full bg-zinc-950" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120rem] h-[40rem] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-violet-500/10 blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <Navbar />
      <main>
        <Hero />
        <Features />
        <AnalyticsSection />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
