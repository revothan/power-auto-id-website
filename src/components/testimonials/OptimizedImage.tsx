import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  onClick?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onClick
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imgSrc, setImgSrc] = useState('')

  // Generate optimized image URL with width and quality parameters
  useEffect(() => {
    // Parse the URL to determine if it's from Supabase
    const isSupabaseUrl = src.includes('supabase.co')
    
    if (isSupabaseUrl && width) {
      // For Supabase storage URLs, add width parameter
      const separator = src.includes('?') ? '&' : '?'
      setImgSrc(`${src}${separator}width=${width}&quality=80`)
    } else {
      setImgSrc(src)
    }
  }, [src, width])

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
      />
    </div>
  )
}
