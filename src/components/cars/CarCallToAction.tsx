import { useState } from 'react'
import { Phone, MessageCircle, ChevronDown } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { Car } from '@/types/supabase'
import { Button } from '@/components/ui/button'

interface CarCallToActionProps {
  car: Car
}

type ContactPerson = {
  name: string
  number: string
}

export default function CarCallToAction({ car }: CarCallToActionProps) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  
  const contacts: ContactPerson[] = [
    { name: 'Alfi', number: '+62 811-8297-666' },
    { name: 'Audy', number: '+62 811 1260 1717' },
    { name: 'Jimmy', number: '+62 811-9288-855' }
  ]

  const whatsappMessage = `Halo, saya tertarik dengan ${car.year} ${car.make} ${car.model} yang dijual di website Anda. Boleh minta informasi lebih lanjut?`
  
  const handleContactClick = (number: string) => {
    // Clean the number by removing spaces and dashes
    const cleanNumber = number.replace(/\s|-/g, '')
    const encodedMessage = encodeURIComponent(whatsappMessage)
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank')
    setIsWhatsAppOpen(false)
  }
  
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Tertarik dengan mobil ini?</h3>
      
      <div className="space-y-3">
        {/* WhatsApp Button with Popover */}
        <div className="relative">
          <Button 
            variant="default" 
            className="w-full justify-between"
            onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          >
            <div className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              <span>Hubungi via WhatsApp</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isWhatsAppOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* WhatsApp Contact Popover */}
          {isWhatsAppOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-2 shadow-lg">
              <div className="flex flex-col space-y-2">
                {contacts.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => handleContactClick(contact.number)}
                    className="flex items-center justify-between rounded-md bg-gray-100 p-3 text-left transition hover:bg-gray-200"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                    </div>
                    <FaWhatsapp className="text-[#25D366] text-xl" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          asChild
        >
          <a href="tel:08119288855">
            <Phone className="mr-2 h-5 w-5" />
            <span>Telepon Langsung</span>
          </a>
        </Button>
      </div>
      
      <div className="mt-4 border-t border-gray-200 pt-4">
        <h4 className="mb-2 text-sm font-medium">Alamat Showroom:</h4>
        <p className="text-sm">
          Ocean Park BSD City Unit FC10 - FC11, Jl. Pahlawan Seribu, Lengkong Gudang Tim., 
          Kec. Serpong, Kota Tangerang Selatan, Banten 15310
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Jam Operasional:</span> Senin-Minggu, 8.00 am–5.00 pm
        </p>
      </div>
    </div>
  )
}