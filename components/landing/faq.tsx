import { ChevronDown } from "lucide-react";

export function FAQ() {
  return (
    <section id="faq" className="relative">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center text-white">
          Questions, answered
        </h2>
        <div className="mt-8 space-y-3">
          <details className="group rounded-lg ring-1 ring-white/10 open:ring-white/20 bg-zinc-900/60 open:bg-zinc-900/70 transition">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm text-white">
              <span>Is my health data private?</span>
              <ChevronDown className="w-4 h-4 transition duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4 pt-0 text-sm text-zinc-300">
              Absolutely. Your data is encrypted and stored securely. We never
              sell your data to third parties.
            </div>
          </details>
          <details className="group rounded-lg ring-1 ring-white/10 open:ring-white/20 bg-zinc-900/60 open:bg-zinc-900/70 transition">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm text-white">
              <span>Which wearables do you support?</span>
              <ChevronDown className="w-4 h-4 transition duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4 pt-0 text-sm text-zinc-300">
              Currently we support direct integration with Garmin Connect and
              Apple Health (which connects to Oura, Whoop, and Eight Sleep).
            </div>
          </details>
          <details className="group rounded-lg ring-1 ring-white/10 open:ring-white/20 bg-zinc-900/60 open:bg-zinc-900/70 transition">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm text-white">
              <span>Can I track custom peptides?</span>
              <ChevronDown className="w-4 h-4 transition duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4 pt-0 text-sm text-zinc-300">
              Yes, you can add any custom compound, set your own dosage, and
              create a custom schedule.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
