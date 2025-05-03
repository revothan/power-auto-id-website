import { Gift, CheckCircle } from 'lucide-react'

export default function CarBenefits() {
  // Free benefits data
  const freeBenefits = [
    'FREE Ganti Oli & Tune UP',
    'FREE Salon & Coating mobil',
    'FREE Garansi mesin & Transmisi 1 Thn',
    'FREE Derek 24 Jam apabila mogok',
    'FREE E - Tilang',
  ]

  // Power Auto benefits data
  const powerAutoBenefits = [
    'Mobil Lulus Inspeksi dan bersetifikasi',
    'Garansi Harga termurah',
    'Kredit Bunga 0 % dan Tanpa DP Rp 0,-',
    'BI Ceking & Col 5 (Rumah kontrakan/Kost) KTP Daerah bisa diproses di seluruh Indonesia',
    'Kredit Bisa buat Gojek/Grab dan Go car Tanpa DP',
    'Terima kredit buat TNI/Polri dan Pengacara',
    'Bisa Cash bertahap',
    'GARANSI BUY BACK, apabila menjual kembali hanya Potongan 5 % dari harga Pasaran',
    'Bisa bawa leasing sendiri dan terima KKB BCA & Mandiri',
    'Melayani pengiriman mobil ke seluruh Indonesia',
  ]

  return (
    <div className="space-y-6">
      {/* Free Benefits Section */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="bg-primary/10 px-6 py-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Gift className="h-5 w-5 mr-2 text-primary" />
            <span>Benefit Beli Mobil</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <span className="text-primary font-bold text-lg mr-2">•</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Power Auto Benefits Section */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="bg-primary/10 px-6 py-4">
          <h3 className="text-xl font-semibold flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            <span>Benefit Membeli Mobil di Power Auto</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {powerAutoBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <span className="min-w-8 text-primary font-bold mr-2">{index + 1}.</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
