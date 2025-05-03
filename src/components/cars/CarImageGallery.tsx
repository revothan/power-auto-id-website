import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { optimizeImage } from '@/lib/image-utils'

interface CarImageGalleryProps {
  images: string[]
  title: string
}

interface OptimizedImage {
  thumbnail: string
  full: string
  original: string
}

export default function CarImageGallery({ images, title }: CarImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [optimizedImages, setOptimizedImages] = useState<OptimizedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])) // Track loaded images

  // Optimize images on component mount
  useEffect(() => {
    if (images && images.length > 0) {
      const optimized = images.map(img => ({
        thumbnail: optimizeImage(img, 200, 150, 80),
        full: optimizeImage(img, 1024, 768, 85),
        original: img
      }))
      
      setOptimizedImages(optimized)
      
      // Preload the first image
      const firstImg = new Image()
      firstImg.onload = () => {
        setIsLoading(false)
        setLoadedImages(prev => new Set(prev).add(0))
      }
      firstImg.src = optimized[0].full
      
      // Preload the next few images in the background
      const preloadNextImages = async () => {
        for (let i = 1; i < Math.min(3, optimized.length); i++) {
          const img = new Image()
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(i))
          }
          img.src = optimized[i].full
        }
      }
      
      preloadNextImages()
    }
  }, [images])

  // Preload next image when current index changes
  useEffect(() => {
    if (optimizedImages.length === 0) return
    
    // Preload the next image
    const nextIndex = (currentIndex + 1) % optimizedImages.length
    if (!loadedImages.has(nextIndex)) {
      const img = new Image()
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(nextIndex))
      }
      img.src = optimizedImages[nextIndex].full
    }
    
    // Also preload the previous image
    const prevIndex = currentIndex === 0 ? optimizedImages.length - 1 : currentIndex - 1
    if (!loadedImages.has(prevIndex)) {
      const img = new Image()
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(prevIndex))
      }
      img.src = optimizedImages[prevIndex].full
    }
  }, [currentIndex, optimizedImages, loadedImages])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false)
        } else if (e.key === 'ArrowLeft') {
          prevImage()
        } else if (e.key === 'ArrowRight') {
          nextImage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, currentIndex])

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isFullscreen])

  // Navigation functions
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const selectThumbnail = (index: number) => {
    setCurrentIndex(index)
  }

  // No images to display
  if (!images.length) {
    return (
      <div className="aspect-[4/3] w-full rounded-lg bg-gray-200 text-center text-gray-500">
        Tidak ada gambar
      </div>
    )
  }

  return (
    <>
      {/* Main image */}
      <div className="relative mb-2 overflow-hidden rounded-lg">
        {isLoading || !loadedImages.has(currentIndex) ? (
          <div className="aspect-[4/3] w-full flex items-center justify-center bg-gray-100">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <img
            src={optimizedImages[currentIndex]?.full || images[currentIndex]}
            alt={`${title} - Gambar ${currentIndex + 1}`}
            className="aspect-[4/3] w-full cursor-pointer object-cover"
            onClick={() => setIsFullscreen(true)}
          />
        )}
        
        {/* Navigation controls */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            prevImage()
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            nextImage()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      <div className="flex w-full gap-2 overflow-x-auto pb-2">
        {optimizedImages.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-[4/3] w-20 flex-none cursor-pointer overflow-hidden rounded-md border-2 ${
              index === currentIndex ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => selectThumbnail(index)}
          >
            <img
              src={image.thumbnail}
              alt={`${title} - Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <img
            src={optimizedImages[currentIndex]?.original || images[currentIndex]}
            alt={`${title} - Gambar ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}