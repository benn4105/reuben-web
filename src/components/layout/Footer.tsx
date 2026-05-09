import Link from "next/link";
import GithubIcon from "@/components/ui/GithubIcon";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A] py-12 mt-20" aria-label="Site footer">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group inline-flex">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#00F0FF] to-[#8A2BE2] flex items-center justify-center">
                <span className="font-bold text-white text-xs leading-none">R</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-glow transition-all duration-300">
                Reuben
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Building data-aware tools for modern computing. Reux is our prototype backend language for simulations, transactions, and decision logic.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/simulator" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Business Simulator
                </Link>
              </li>
              <li>
                <Link href="/founder-pilot" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Founder Pilot
                </Link>
              </li>
              <li>
                <Link href="/projects/reux" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Reux Language
                </Link>
              </li>
              <li>
                <Link href="/projects/plos" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  PLOS
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  All Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Developers</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Developer Preview
                </Link>
              </li>
              <li>
                <Link href="/projects/reux/roadmap" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Roadmap
                </Link>
              </li>
              <li>
                <a href="https://github.com/benn4105/Reux" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm flex items-center gap-1.5" aria-label="Reux GitHub repository (opens in new tab)">
                  <GithubIcon size={14} />
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Reuben Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
