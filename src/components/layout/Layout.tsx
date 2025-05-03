import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '../common/WhatsAppButton'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({
  children,
  title = 'Power Auto ID - Mobil Second Termurah Se-Indonesia',
  description = 'Power Auto ID - Mobil Second Termurah Se-Indonesia di BSD, Tangerang. Dapatkan mobil bekas berkualitas dengan DP 0% dan garansi buyback.',
}: LayoutProps) {
  // Base title and meta tags for SEO
  const metaTitle = title
  const metaDescription = description
  
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="jual mobil second di bsd, jual mobil murah di bsd, jual mobil termurah seindonesia, jual mobil di bsd, jual mobil di tangerang, jual mobil murah di tangerang" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Power Auto ID" />
        <meta property="og:locale" content="id_ID" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="canonical" href="https://powerautoid.com" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  )
}
