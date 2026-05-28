import { z } from 'zod'

// Permissive: matches the cars Insert/Update shape — every field optional /
// nullable / empty-string-allowed so drafts can save partial data on field
// blur. We never validate against this for submit.
export const listingDraftSchema = z.object({
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.number().int().optional().nullable(),
  color: z.string().optional().nullable(),
  transmission: z.enum(['manual', 'automatic']).optional().nullable(),
  fuel_type: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional().nullable(),
  mileage: z.number().int().optional().nullable(),
  engine_size: z.number().int().optional().nullable(),
  power: z.number().int().optional().nullable(),
  seats: z.number().int().optional().nullable(),
  doors: z.number().int().optional().nullable(),
  condition: z.enum(['excellent', 'good', 'fair']).optional().nullable(),
  vin: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  price: z.number().int().optional().nullable(),
  market_price: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  stnk_holder_name: z.string().optional().nullable(),
  bpkb_holder_name: z.string().optional().nullable(),
  tax_due_date: z.string().optional().nullable(), // ISO date
  service_history: z.string().optional().nullable(),
  branch_id: z.string().uuid().optional().nullable(),
  sales_pic_id: z.string().uuid().optional().nullable(),
})

export type ListingFormValues = z.infer<typeof listingDraftSchema>

// Strict: enforced when sales submits-for-approval or admin publishes.
export const listingSubmitSchema = z.object({
  make: z.string().min(1, 'Brand wajib diisi'),
  model: z.string().min(1, 'Model wajib diisi'),
  year: z
    .number({ invalid_type_error: 'Tahun wajib diisi' })
    .int()
    .min(1980)
    .max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Warna wajib diisi'),
  transmission: z.enum(['manual', 'automatic'], {
    errorMap: () => ({ message: 'Pilih transmisi' }),
  }),
  fuel_type: z.enum(['gasoline', 'diesel', 'electric', 'hybrid'], {
    errorMap: () => ({ message: 'Pilih jenis bahan bakar' }),
  }),
  mileage: z
    .number({ invalid_type_error: 'Kilometer wajib diisi' })
    .int()
    .min(0),
  engine_size: z.number().int().min(0).optional().nullable(),
  power: z.number().int().min(0).optional().nullable(),
  seats: z.number().int().min(1),
  doors: z.number().int().min(1),
  condition: z.enum(['excellent', 'good', 'fair'], {
    errorMap: () => ({ message: 'Pilih kondisi' }),
  }),
  vin: z.string().min(1, 'VIN wajib diisi'),
  plate_number: z.string().min(1, 'Plat nomor wajib diisi'),
  price: z.number({ invalid_type_error: 'Harga wajib diisi' }).int().min(1),
  market_price: z.number().int().min(0).optional().nullable(),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  features: z.array(z.string()).optional().nullable(),
  stnk_holder_name: z.string().min(1, 'Nama pemegang STNK wajib'),
  bpkb_holder_name: z.string().min(1, 'Nama pemegang BPKB wajib'),
  tax_due_date: z.string().optional().nullable(),
  service_history: z.string().optional().nullable(),
  branch_id: z.string().uuid({ message: 'Pilih cabang' }),
  sales_pic_id: z.string().uuid({ message: 'Pilih sales PIC' }),
})

// Step → which fields it owns. Used to scroll to the right step on submit errors.
export const STEP_FIELDS: Record<number, (keyof ListingFormValues)[]> = {
  0: [
    'make', 'model', 'year', 'color', 'transmission', 'fuel_type', 'mileage',
    'engine_size', 'power', 'seats', 'doors', 'condition', 'vin', 'plate_number',
  ],
  1: ['price', 'market_price'],
  2: ['description', 'features'],
  3: ['stnk_holder_name', 'bpkb_holder_name', 'tax_due_date', 'service_history'],
  // step 4 is photos — not in form values, validated separately
  5: ['branch_id', 'sales_pic_id'],
}

export const COMMON_FEATURES = [
  'AC double blower',
  'Power window',
  'Power steering',
  'Central lock',
  'Electric mirror',
  'Airbag',
  'ABS',
  'Keyless entry',
  'Push start',
  'Cruise control',
  'Camera mundur',
  'Sensor parkir',
  'Apple CarPlay',
  'Android Auto',
  'Velg racing',
  'Audio steering',
]
