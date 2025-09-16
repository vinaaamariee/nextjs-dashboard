import '@/app/ui/global.css';
import { inter }  from '@/app/ui/fonts';
import Link from 'next/link'
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