"use client";

import { Zap, Clock, Activity, Brain } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "One-Tap Dose Logging",
    description:
      'Log your injections in seconds. Set up your protocol once—daily, weekly, or custom cycling schedules—and never wonder "did I take that already?" again.',
    icon: Zap,
    image: "/assets/landing/protocol-polished.png",
    color: "text-teal-400",
    gradient: "from-teal-500/20 to-teal-500/0",
    imagePosition: "object-top",
    bullets: [
      "Supports 90+ peptides with pre-filled dosing info",
      "Daily, weekly, or custom cycling schedules",
      "Visual calendar shows your complete protocol history",
    ],
  },
  {
    title: "Your Protocol at a Glance",
    description:
      "See your entire protocol history on one visual calendar. Every dose logged, every day tracked—so you always know where you are in your cycle and what's coming next.",
    icon: Clock,
    image: "/assets/landing/calendar-landscape-final-v2.png",
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-violet-500/0",
    imagePosition: "object-center",
    bullets: [
      "Color-coded view shows completed, missed, and upcoming doses",
      "Tap any day to log or edit entries",
      "Perfect for cycling protocols and multi-peptide stacks",
    ],
  },
  {
    title: "Connect Your Garmin Data",
    description:
      "Import your sleep scores, HRV, stress levels, and Body Battery directly from Garmin Connect. See your health trends alongside your protocol timeline.",
    icon: Activity,
    image: "/assets/landing/health-landscape-final-v5.png",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-500/0",
    imagePosition: "object-center",
    bullets: [
      "Full Garmin data export support (sleep, HRV, stress, steps)",
      "Trend charts that overlay with your protocol start dates",
      "No API keys or complex setup—just upload your export file",
    ],
  },
  {
    title: "AI That Connects the Dots",
    description:
      "Our AI analyzes your dosing patterns alongside your health data and surfaces observations you might miss. Weekly summaries highlight what's trending up, what's trending down, and what might be worth adjusting.",
    icon: Brain,
    image: "/assets/landing/ai-insights-minimal.png",
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-pink-500/0",
    imagePosition: "object-center",
    bullets: [
      "Weekly insight reports delivered to your dashboard",
      "Ask questions about your data in plain English",
      "Correlation detection between protocols and health metrics",
    ],
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".feature-item");

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%", // Animation starts when top of item hits 80% of viewport height
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Everything you need{" "}
            <span className="text-teal-500">in one place</span>
          </h2>
          <p className="text-lg text-zinc-400">
            Stop juggling spreadsheets, notes apps, and scattered reminders.
            PepMetrics brings all your peptide tracking together—so you can
            focus on results.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-item flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-12 md:gap-24 opacity-0`} // Initial opacity 0 for GSAP
            >
              {/* Text Side */}
              <div className="flex-1 space-y-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/10 ${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-zinc-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Side */}
              <div className="flex-1 w-full">
                <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50`}
                  />
                  <div className="absolute inset-4 md:inset-8 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                        feature.imagePosition || "object-center"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
