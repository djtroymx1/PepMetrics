import { Smartphone, Settings, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Connect Your Wearable",
    description:
      "Sync with Garmin or Apple Health to pull in your sleep, HRV, and activity data automatically.",
    icon: Smartphone,
  },
  {
    title: "Set Your Protocol",
    description:
      "Input your peptides, dosages, and schedule. We'll handle the reminders and tracking.",
    icon: Settings,
  },
  {
    title: "Track & Optimize",
    description:
      "Log doses with a tap, monitor your fasting, and watch your health metrics improve over time.",
    icon: TrendingUp,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-zinc-900/30 border-y border-white/5"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How It Works
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Get started in minutes. No complex setup required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-zinc-800 via-teal-500/50 to-zinc-800" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:-translate-y-2 shadow-xl shadow-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-violet-500/10 rounded-2xl" />
                <step.icon className="w-10 h-10 text-white" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
