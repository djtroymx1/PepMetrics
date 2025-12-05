import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-900/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-16 text-center shadow-2xl shadow-teal-900/20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to optimize your health?
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join the community of biohackers using PepMetrics to track, analyze,
            and improve their protocols.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="h-14 px-10 text-lg bg-teal-500 hover:bg-teal-400 text-black font-bold shadow-lg shadow-teal-500/20"
              >
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            No credit card required. Free forever for basic tracking.
          </p>
        </div>
      </div>
    </section>
  );
}
