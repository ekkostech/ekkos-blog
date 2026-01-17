import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ekkOS Blog',
  description: 'Learn about AI memory, the golden loop, and how ekkOS makes AI agents smarter over time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">ekkOS<span className="text-purple-500">_</span></span>
                <span className="text-white/60">Blog</span>
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  href="https://ekkos.dev"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Platform
                </Link>
                <Link
                  href="https://docs.ekkos.dev"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Docs
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#050508] border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">ekkOS<span className="text-purple-500">_</span></span>
                <span className="text-white/40 text-sm">© 2025</span>
              </div>
              <nav className="flex items-center gap-6">
                <Link
                  href="https://ekkos.dev"
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Platform
                </Link>
                <Link
                  href="https://labs.ekkos.dev"
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Labs
                </Link>
                <Link
                  href="https://ekkos.ca"
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Company
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
