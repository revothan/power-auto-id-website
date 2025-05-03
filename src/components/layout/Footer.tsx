import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Instagram, Facebook, Mail, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Mobil Kami', href: '/cars' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Testimonial', href: '/testimonials' },
    { name: 'Kontak', href: '/contact' },
  ],
  social: [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/powerauto.id/',
      icon: Instagram,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=100028005073442&mibextid=ZbWKwL',
      icon: Facebook,
    },
    {
      name: 'Youtube',
      href: 'https://www.youtube.com/c/PowerAutoTV',
      icon: Youtube,
    },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo and Contact Info */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <span className="sr-only">Power Auto ID</span>
              <img
                className="h-14 w-auto"
                src="https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/branding//logo.png"
                alt="Power Auto ID Logo"
              />
            </Link>
            <div className="flex flex-col space-y-4 text-base text-gray-300">
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <a 
                  href="https://maps.app.goo.gl/MrarwqXy3gih1T396" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Ocean Park BSD City Unit FC10 - FC11, Jl. Pahlawan Seribu, Lengkong Gudang Tim., Kec. Serpong, Kota Tangerang Selatan, Banten 15310
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <a href="tel:08119288855" className="hover:text-primary">
                  0811-9288-855
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <a href="mailto:powerauto.id@gmail.com" className="hover:text-primary">
                  powerauto.id@gmail.com
                </a>
              </div>
              <div className="flex items-start">
                <Clock className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p>Senin - Minggu</p>
                  <p>8.00 am–5.00 pm</p>
                </div>
              </div>
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a 
                    href="https://maps.app.goo.gl/MrarwqXy3gih1T396" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Buka di Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-300 hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* USPs and Social Media */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Keunggulan Kami</h3>
              <ul className="mt-4 space-y-3 text-gray-300">
                <li>✓ DP 0%</li>
                <li>✓ Buyback Guarantee</li>
                <li>✓ Fully Serviced &amp; Detailed</li>
                <li>✓ TERMURAH SE-INDONESIA</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Ikuti Kami</h3>
              <div className="mt-4 flex space-x-4">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} Power Auto ID. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}