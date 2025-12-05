"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      // Manual SplitText Reveal
      const words = gsap.utils.toArray(".word");

      gsap.fromTo(
        words,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
        }
      );

      // Magnetic Button Effect
      const button = buttonRef.current;
      if (button) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(button, {
            x: x * 0.2, // Magnetic pull strength
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          button.removeEventListener("mousemove", handleMouseMove);
          button.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden relative"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Now with AI-powered insights
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white overflow-hidden">
            {/* Manual SplitText Wrapper */}
            <span className="sr-only">
              Track Your Peptides. See What&apos;s Working.
            </span>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {"Track Your Peptides. See What's Working."
                .split(" ")
                .map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden">
                    <span className="word inline-block">{word}</span>
                  </span>
                ))}
            </div>
          </h1>

          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fade-in_1s_ease-out_0.5s_forwards]">
            Log your doses, track your fasting windows, and connect your Garmin
            data - all in one place. Finally see if your protocols are actually
            making a difference.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fade-in_1s_ease-out_0.8s_forwards]">
            <Link href="/login">
              <span className="inline-block p-1 rounded-full bg-gradient-to-b from-teal-400 to-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                <Button
                  ref={buttonRef}
                  size="lg"
                  className="h-11 px-8 text-base bg-black/80 hover:bg-black text-white font-semibold backdrop-blur-sm border border-white/10 rounded-full transition-transform"
                >
                  Start Tracking Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </span>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-white/10 hover:bg-white/5 hover:text-white text-white rounded-full"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div className="relative mx-auto max-w-5xl mt-16 opacity-0 animate-[fade-up_1.2s_ease-out_1s_forwards]">
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
