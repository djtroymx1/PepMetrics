import { Zap, Clock, Activity, Brain } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "One-Tap Dose Tracking",
    description:
      "Log your peptides in seconds. Smart scheduling knows your protocol and reminds you exactly when it's time to inject.",
    icon: Zap,
    image: "/assets/landing/protocol-polished.png", // Using polished protocol management UI
    color: "text-teal-400",
    gradient: "from-teal-500/20 to-teal-500/0",
    imagePosition: "object-top",
  },
  {
    title: "Smart Fasting Timer",
    description:
      "Know exactly when it's safe to inject. Get alerts when you've reached your required fasting window for optimal absorption.",
    icon: Clock,
    image: "/assets/landing/calendar-landscape-final-v2.png",
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-violet-500/0",
    imagePosition: "object-center",
  },
  {
    title: "Synced Health Metrics",
    description:
      "Automatically pull sleep, HRV, and activity data from your wearable to see how your protocol affects your recovery.",
    icon: Activity,
    image: "/assets/landing/health-landscape-final-v5.png",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-500/0",
    imagePosition: "object-center",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Let our AI analyze correlations between your protocol and your health data to optimize your stack for peak performance.",
    icon: Brain,
    image: "/assets/landing/ai-insights-minimal.png",
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-pink-500/0",
    imagePosition: "object-center",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Everything you need to{" "}
            <span className="text-teal-500">optimize</span>
          </h2>
          <p className="text-lg text-zinc-400">
            Stop using notes apps and spreadsheets. PepMetrics brings
            professional-grade tracking to your biohacking routine.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-12 md:gap-24`}
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
                  {[1, 2, 3].map((i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-zinc-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      Feature benefit point {i}
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
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
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
