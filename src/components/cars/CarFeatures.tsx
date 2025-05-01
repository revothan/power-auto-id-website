import { Check } from 'lucide-react'

interface CarFeaturesProps {
  features: string[]
}

export default function CarFeatures({ features }: CarFeaturesProps) {
  // Group features into columns for better display
  const featureColumns = () => {
    // Determine column count based on feature count
    let columnCount = 1
    if (features.length > 5) columnCount = 2
    if (features.length > 12) columnCount = 3

    // Create arrays for each column
    const columns: string[][] = Array.from({ length: columnCount }, () => [])
    
    // Distribute features evenly across columns
    features.forEach((feature, index) => {
      const columnIndex = index % columnCount
      columns[columnIndex].push(feature)
    })
    
    return columns
  }

  const columns = featureColumns()

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-semibold">Fitur</h3>
      
      <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-2">
            {column.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
