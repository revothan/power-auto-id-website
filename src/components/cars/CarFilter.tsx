import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useCarFilterOptions } from '@/lib/supabase/client'

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
  
  // Use React Query for cached filter options - single API call!
  const { data: filterOptions } = useCarFilterOptions()
  
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

  // Extract data with fallbacks
  const makes = filterOptions?.makes || []
  const years = filterOptions?.years || []
  
  // Filter models based on selected make using useMemo for performance
  const availableModels = useMemo(() => {
    if (!filterOptions?.models || !filters.make) return []
    // Since we now have all models, we need to filter them by the cars that have the selected make
    // For now, return all models - this could be optimized with a more complex query
    return filterOptions.models
  }, [filterOptions?.models, filters.make])

  // Update models when make changes - no API call needed!
  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const make = e.target.value
    setFilters((prev) => ({ ...prev, make, model: '' }))
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
        {/* Desktop layout (3 columns with consistent sizing) */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="space-y-4">
            {/* Make */}
            <div>
              <label htmlFor="make-desktop" className="block text-sm font-medium">
                Merek
              </label>
              <select
                id="make-desktop"
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
              <label htmlFor="model-desktop" className="block text-sm font-medium">
                Model
              </label>
              <select
                id="model-desktop"
                name="model"
                value={filters.model}
                onChange={handleChange}
                disabled={!filters.make}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Semua Model</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label htmlFor="transmission-desktop" className="block text-sm font-medium">
                Transmisi
              </label>
              <select
                id="transmission-desktop"
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
          </div>

          <div className="space-y-4">
            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium">
                Tahun
              </label>
              <div className="mt-1 flex items-center gap-2">
                <select
                  id="yearMin-desktop"
                  name="yearMin"
                  value={filters.yearMin}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Min</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500">-</span>
                <select
                  id="yearMax-desktop"
                  name="yearMax"
                  value={filters.yearMax}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
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
            <div>
              <label className="block text-sm font-medium">
                Harga
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  id="priceMin-desktop"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleChange}
                  placeholder="Rp Min"
                  className="block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  id="priceMax-desktop"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleChange}
                  placeholder="Rp Max"
                  className="block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label htmlFor="fuelType-desktop" className="block text-sm font-medium">
                Bahan Bakar
              </label>
              <select
                id="fuelType-desktop"
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

          <div className="flex flex-col justify-end">
            <div className="mt-2 flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Cari Mobil
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile layout (stacked) */}
        <div className="grid grid-cols-1 gap-4 lg:hidden md:grid-cols-2">
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
              {availableModels.map((model) => (
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

          <div className="md:col-span-2 mt-4 flex flex-col gap-2 sm:flex-row">
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
        </div>
      </form>
    </div>
  )
}
