import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Now with AI-powered insights
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Track Your Peptides. See What&apos;s Working.
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Log your doses, track your fasting windows, and connect your Garmin data - all in one place. Finally see if your protocols are actually making a difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-teal-500 hover:bg-teal-400 text-black font-semibold"
              >
                Start Tracking Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-white/10 hover:bg-white/5 hover:text-white text-white"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div className="relative mx-auto max-w-5xl mt-16">
          <div className="aspect-video bg-zinc-900/50 rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-teal-500/10 relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            <Image
              src="/assets/landing/CTA.png"
              alt="PepMetrics CTA Preview"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
