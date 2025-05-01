import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Home', href: '/', },
  { name: 'Mobil Kami', href: '/cars' },
  { name: 'Tentang Kami', href: '/about' },
  { name: 'Testimonial', href: '/testimonials' },
  { name: 'Kontak', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Power Auto ID</span>
            <img
              className="h-12 w-auto"
              src="https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/branding//logo.png"
              alt="Power Auto ID Logo"
            />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-base font-semibold transition-colors duration-200 ${
                location.pathname === item.href 
                  ? 'text-primary' 
                  : 'text-gray-900 hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Call button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild>
            <a 
              href="tel:08119288855" 
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <span>0811-9288-855</span>
            </a>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between gap-x-6 px-6 py-4">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Power Auto ID</span>
                <img
                  className="h-8 w-auto"
                  src="https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/branding//logo.png"
                  alt="Power Auto ID Logo"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 px-6">
              <div className="text-2xl font-bold text-primary">
                TERMURAH SE-INDONESIA
              </div>
            </div>
            <div className="mt-8 px-6">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-base font-semibold transition-colors duration-200 ${
                      location.pathname === item.href 
                        ? 'text-primary' 
                        : 'text-gray-900 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-8">
                <Button asChild className="w-full">
                  <a 
                    href="tel:08119288855"
                    className="flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>0811-9288-855</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
