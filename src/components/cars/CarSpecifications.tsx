import { Car } from '@/types/supabase'

interface CarSpecificationsProps {
  car: Car
}

export default function CarSpecifications({ car }: CarSpecificationsProps) {
  // Translations for fuel types and transmissions
  const fuelTypeMap = {
    gasoline: 'Bensin',
    diesel: 'Solar',
    electric: 'Listrik',
    hybrid: 'Hybrid',
  }
  const transmissionMap = {
    automatic: 'Otomatis',
    manual: 'Manual',
  }
  
  // Define specifications to display
  const specifications = [
    { label: 'Merek', value: car.make },
    { label: 'Model', value: car.model },
    { label: 'Tahun', value: car.year },
    { label: 'Warna', value: car.color },
    { label: 'Transmisi', value: transmissionMap[car.transmission] },
    { label: 'Bahan Bakar', value: fuelTypeMap[car.fuel_type] },
    { label: 'Kilometer', value: `${car.mileage.toLocaleString()} km` },
    { label: 'Nomor VIN', value: car.vin },
    { label: 'Kapasitas Mesin', value: `${car.engine_size} cc` },
    { label: 'Tenaga', value: `${car.power} HP` },
    { label: 'Jumlah Kursi', value: `${car.seats} Kursi` },
    { label: 'Jumlah Pintu', value: `${car.doors} Pintu` },
    { label: 'Kondisi', value: {
      excellent: 'Sempurna',
      good: 'Baik',
      fair: 'Cukup Baik',
    }[car.condition] },
  ]

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="px-6 py-4">
        <h3 className="text-xl font-semibold">Spesifikasi</h3>
      </div>
      <div className="border-t">
        <dl>
          {specifications.map((spec, index) => (
            <div 
              key={spec.label} 
              className={`flex px-6 py-3 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <dt className="w-1/2 flex-none text-sm font-medium text-gray-900">
                {spec.label}
              </dt>
              <dd className="w-1/2 flex-none text-sm text-gray-700">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
