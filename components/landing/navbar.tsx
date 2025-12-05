import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/5 backdrop-blur-md saturate-150 supports-backdrop-filter:bg-black/20">
      <div className="container mx-auto px-4 h-20 sm:h-24 lg:h-28 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/landing/pepmetrics%20transparent%20white.png"
            alt="PepMetrics logo"
            width={420}
            height={126}
            className="h-16 sm:h-20 lg:h-28 w-auto max-w-[60vw] drop-shadow-[0_10px_22px_rgba(0,0,0,0.35)]"
            priority
          />
          <span className="sr-only">PepMetrics</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it Works
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link href="/login">
            <Button className="bg-white text-black hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
