import '@/app/ui/global.css';
// Removed `inter` import — not used in layout
import Link from 'next/link'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog"></Link>
          {/* No prefetching */}
          <a href="/contact"></a>
        </nav>
        {children}
      </body>
    </html>
  )
}