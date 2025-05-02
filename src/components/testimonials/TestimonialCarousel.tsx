import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'

interface TestimonialCarouselProps {
  testimonialImages: string[]
  showNavigation?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  withCTA?: boolean
}

export default function TestimonialCarousel({
  testimonialImages,
  showNavigation = true,
  showDots = true,
  autoplay = true,
  autoplayInterval = 5000,
  withCTA = false
}: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean[]>([])

  // Initialize isLoaded state
  useEffect(() => {
    setIsLoaded(Array(testimonialImages.length).fill(false))
  }, [testimonialImages.length])

  const handleImageLoad = (index: number) => {
    setIsLoaded(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  // Set scroll snaps
  const onInit = useCallback(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [emblaApi])

  // Handle scroll events
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Navigation functions
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return
    
    onInit()
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onInit)
    
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onInit)
    }
  }, [emblaApi, onInit, onSelect])

  // Setup autoplay
  useEffect(() => {
    if (!emblaApi || !autoplay) return

    const intervalId = setInterval(() => {
      emblaApi.scrollNext()
    }, autoplayInterval)

    return () => clearInterval(intervalId)
  }, [emblaApi, autoplay, autoplayInterval])

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonialImages.map((imageUrl, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] md:flex-[0_0_auto] md:w-[95%] lg:w-auto max-w-full mx-2"
            >
              {!isLoaded[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                </div>
              )}
              <img 
                src={imageUrl}
                alt={`Testimonial ${index + 1}`}
                className={`rounded-lg shadow-md object-contain h-auto w-full max-h-[70vh] ${isLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {showNavigation && testimonialImages.length > 1 && (
        <>
          <button 
            onClick={scrollPrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={scrollNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {showDots && testimonialImages.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CTA Button */}
      {withCTA && (
        <div className="mt-6 text-center">
          <Button asChild>
            <Link to="/testimonials">Lihat Semua Testimonial</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
