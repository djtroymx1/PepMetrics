import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Simple pricing, no surprises
          </h2>
          <p className="mt-2 text-zinc-300 text-sm md:text-base">
            Start free and upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="rounded-2xl p-6 bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Free
              </h3>
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              $0<span className="text-sm text-zinc-400">/mo</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Track up to 3 peptides
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Fasting timer with &ldquo;Safe to Inject&rdquo; alerts
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                30-day dose history
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Manual health logging
              </li>
            </ul>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl p-6 bg-zinc-800/60 ring-2 ring-teal-500/40 hover:ring-teal-400/60 transition flex flex-col">
            <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-md bg-teal-500 text-black px-2.5 py-1 text-[11px] font-medium">
              <Sparkles className="w-3 h-3" /> Most Popular
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Pro
              </h3>
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              $9.99<span className="text-sm text-zinc-300">/mo</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">or $79/year — save 34%</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Unlimited peptides and protocols
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Garmin data import (sleep, HRV, stress, activity)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                AI-powered weekly insights
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Unlimited history and data export
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Bloodwork tracking (coming soon)
              </li>
            </ul>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-teal-500 text-black hover:bg-teal-400 transition"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Coach */}
          <div className="rounded-2xl p-6 bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-white">
                Coach / Practitioner
              </h3>
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Coming Soon
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Manage multiple clients from one dashboard
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                View client protocols and compliance
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Aggregate insights across your practice
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                White-label options available
              </li>
            </ul>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </section>
  );
}
