import Link from "next/link";
const GithubIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const TwitterIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
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
              Engineering the future of systems. We build powerful, structurally sound tools for modern computing.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Projects</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/projects/reux" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  Reux
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-[#00F0FF] transition-colors text-sm">
                  View All
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/reuben" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <GithubIcon size={20} />
              </a>
              <a href="https://twitter.com/reuben" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="https://linkedin.com/company/reuben" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Reuben Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
