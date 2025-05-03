import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80"
            alt="Contact us"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-black/80" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Hubungi <span className="text-primary">Kami</span>
          </h1>
          <p className="mb-6 max-w-xl text-xl text-gray-300">
            Kami siap membantu Anda menemukan mobil impian dengan harga terbaik.
          </p>
        </div>
      </section>

      {/* Contact information */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Informasi Kontak
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Anda dapat menghubungi kami melalui berbagai cara berikut:
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Telepon</h3>
                  <p className="mt-1 text-gray-600">
                    <a href="tel:08119288855" className="hover:text-primary">
                      0811-9288-855
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">
                    <a href="mailto:powerauto.id@gmail.com" className="hover:text-primary">
                      powerauto.id@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">WhatsApp</h3>
                  <p className="mt-1 text-gray-600">
                    <a 
                      href="https://wa.me/628119288855" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      0811-9288-855
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Alamat</h3>
                  <p className="mt-1 text-gray-600">
                    <a 
                      href="https://maps.app.goo.gl/MrarwqXy3gih1T396" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      Ocean Park BSD City Unit FC10 - FC11,<br />
                      Jl. Pahlawan Seribu, Lengkong Gudang Tim.,<br />
                      Kec. Serpong, Kota Tangerang Selatan, Banten 15310
                    </a>
                  </p>
                  <div className="mt-2">
                    <Button asChild variant="outline" size="sm">
                      <a 
                        href="https://maps.app.goo.gl/MrarwqXy3gih1T396" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Buka di Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Jam Operasional</h3>
                  <p className="mt-1 text-gray-600">
                    Senin - Minggu: 8.00 am–5.00 pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.6312868968897!2d106.66193431476997!3d-6.305391995437397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fb535f3663d5%3A0x79c37605a26c12b6!2sOcean%20Park%20BSD%20City!5e0!3m2!1sen!2sid!4v1651238234754!5m2!1sen!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Power Auto ID Location"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button asChild size="lg">
              <a 
                href="https://maps.app.goo.gl/MrarwqXy3gih1T396" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Buka di Google Maps
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}