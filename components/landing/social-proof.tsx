import Image from "next/image";

export function SocialProof() {
  return (
    <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-zinc-500 mb-8">
          INTEGRATES SEAMLESSLY WITH YOUR FAVORITE DEVICES
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/assets/landing/garmin-logo.png"
                alt="Garmin Connect"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Garmin Connect</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/landing/apple-fitness-logo.png"
                alt="Apple Fitness+"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Apple Fitness+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
