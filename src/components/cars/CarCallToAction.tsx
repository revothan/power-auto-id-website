import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { Car } from '@/types/supabase'
import { Button } from '@/components/ui/button'

interface CarCallToActionProps {
  car: Car
}

export default function CarCallToAction({ car }: CarCallToActionProps) {
  const whatsappMessage = `Halo, saya tertarik dengan ${car.year} ${car.make} ${car.model} yang dijual di website Anda. Boleh minta informasi lebih lanjut?`
  const whatsappLink = `https://wa.me/628119288855?text=${encodeURIComponent(whatsappMessage)}`
  
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Tertarik dengan mobil ini?</h3>
      
      <div className="space-y-3">
        <Button 
          variant="default" 
          className="w-full justify-start"
          asChild
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            <span>Hubungi via WhatsApp</span>
          </a>
        </Button>
        
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
        
        <Button 
          variant="secondary" 
          className="w-full justify-start"
          asChild
        >
          <a 
            href="https://calendly.com/powerautoid/kunjungan-showroom" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Calendar className="mr-2 h-5 w-5" />
            <span>Jadwalkan Kunjungan</span>
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
