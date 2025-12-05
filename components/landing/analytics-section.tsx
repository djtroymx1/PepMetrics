import { Calendar, BadgeCheck, Users2 } from "lucide-react";
import Image from "next/image";

export function AnalyticsSection() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analytics Card */}
          <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  Weekly Progress
                </h3>
                <p className="mt-1 text-sm text-zinc-300">
                  Consistency drives results. Track volume, fasting, and
                  metrics.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10">
                <Calendar className="w-3 h-3" /> Last 7 days
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-black/60 ring-1 ring-white/10 p-3 overflow-hidden relative aspect-video group">
              <img
                src="/assets/landing/progress-landscape-cropped.png"
                alt="Weekly Progress"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-black/60 ring-1 ring-white/10 p-3">
                <div className="text-xs text-zinc-400">Fasting Hours</div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                  112
                </div>
              </div>
              <div className="rounded-lg bg-black/60 ring-1 ring-white/10 p-3">
                <div className="text-xs text-zinc-400">Avg HRV</div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                  48ms
                </div>
              </div>
              <div className="rounded-lg bg-black/60 ring-1 ring-white/10 p-3">
                <div className="text-xs text-zinc-400">Doses</div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                  14
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Card */}
          <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-6">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              What biohackers are saying
            </h3>
            <p className="mt-1 text-sm text-zinc-300">
              Real stories. Real optimization. Join the community.
            </p>
            <div className="mt-5 space-y-4">
              <div className="flex gap-4 p-4 rounded-lg bg-black/60 ring-1 ring-white/10">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                  AK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight text-white">
                      Amina K.
                    </span>
                    <span className="text-[11px] text-teal-300 inline-flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-1">
                    “Finally a way to track my cycles properly. The fasting
                    timer integration is a game changer.”
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-black/60 ring-1 ring-white/10">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                  LM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight text-white">
                      Leo M.
                    </span>
                    <span className="text-[11px] text-teal-300 inline-flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-1">
                    “Seeing my HRV trends alongside my protocol helped me dial
                    in my dosage perfectly.”
                  </p>
                </div>
              </div>
            </div>

            <div
              id="community"
              className="mt-5 flex items-center justify-between"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full ring-2 ring-zinc-900 bg-zinc-800 flex items-center justify-center text-xs text-zinc-500"
                  >
                    U{i}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full ring-2 ring-zinc-900 bg-zinc-800 text-[11px] flex items-center justify-center text-zinc-300">
                  +2k
                </div>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-200 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition"
              >
                <Users2 className="w-3 h-3" />
                Join community
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </section>
  );
}
