import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-black text-zinc-400 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-violet-600 rounded-md" />
              <span className="font-bold text-lg text-white">PepMetrics</span>
            </div>
            <p className="mb-4">
              PepMetrics helps you track your peptide protocols and understand how they affect your health. We&apos;re a tracking tool—not medical advice.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">
                  Documentation <span className="text-xs">(Coming Soon)</span>
                </span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">
                  Peptide Guide <span className="text-xs">(Coming Soon)</span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p>
            &copy; {new Date().getFullYear()} PepMetrics. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
