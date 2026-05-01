import Link from "next/link";
const GithubIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A] py-12 mt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Projects</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/simulator" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Business Simulator
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  All Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/benn4105/Reux" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <GithubIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Reuben Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-600">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
