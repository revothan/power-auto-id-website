import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getCarMakes, getCarModels, getCarYears } from '@/lib/supabase/client'

interface FilterValues {
  make: string
  model: string
  yearMin: string
  yearMax: string
  priceMin: string
  priceMax: string
  transmission: string
  fuelType: string
}

export default function CarFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [filters, setFilters] = useState<FilterValues>({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    yearMin: searchParams.get('yearMin') || '',
    yearMax: searchParams.get('yearMax') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
  })

  // Fetch makes, models and years on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const makesList = await getCarMakes()
        setMakes(makesList)

        const yearsList = await getCarYears()
        setYears(yearsList)

        // If a make is already selected, load its models
        if (filters.make) {
          const modelsList = await getCarModels(filters.make)
          setModels(modelsList)
        }
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }

    fetchFilterOptions()
  }, [filters.make])

  // Update models when make changes
  const handleMakeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const make = e.target.value
    setFilters((prev) => ({ ...prev, make, model: '' }))

    if (make) {
      try {
        const modelsList = await getCarModels(make)
        setModels(modelsList)
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    } else {
      setModels([])
    }
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Apply filters
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new URLSearchParams
    const newParams = new URLSearchParams()
    
    // Only add non-empty filters to the URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      }
    })
    
    // Update URL
    setSearchParams(newParams)
  }

  // Reset filters
  const handleReset = () => {
    setFilters({
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      priceMin: '',
      priceMax: '',
      transmission: '',
      fuelType: '',
    })
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Filter Mobil</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Make */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium">
              Merek
            </label>
            <select
              id="make"
              name="make"
              value={filters.make}
              onChange={handleMakeChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
            >
              <option value="">Semua Merek</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium">
              Model
            </label>
            <select
              id="model"
              name="model"
              value={filters.model}
              onChange={handleChange}
              disabled={!filters.make}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Semua Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="yearMin" className="block text-sm font-medium">
                Tahun Min
              </label>
              <select
                id="yearMin"
                name="yearMin"
                value={filters.yearMin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
              >
                <option value="">Min</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="yearMax" className="block text-sm font-medium">
                Tahun Max
              </label>
              <select
                id="yearMax"
                name="yearMax"
                value={filters.yearMax}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
              >
                <option value="">Max</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="priceMin" className="block text-sm font-medium">
                Harga Min
              </label>
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                placeholder="Rp"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="priceMax" className="block text-sm font-medium">
                Harga Max
              </label>
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                placeholder="Rp"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium">
              Transmisi
            </label>
            <select
              id="transmission"
              name="transmission"
              value={filters.transmission}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
            >
              <option value="">Semua Transmisi</option>
              <option value="automatic">Otomatis</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium">
              Bahan Bakar
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={filters.fuelType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
            >
              <option value="">Semua Bahan Bakar</option>
              <option value="gasoline">Bensin</option>
              <option value="diesel">Solar</option>
              <option value="electric">Listrik</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="flex-1">
            Cari Mobil
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset Filter
          </Button>
        </div>
      </form>
    </div>
  )
}
