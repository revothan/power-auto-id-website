import { useState } from 'react'
import { Button } from '@/components/ui/button'
import OptimizedImage from './OptimizedImage'

interface TestimonialImageGridProps {
  testimonialImages: string[]
}

export default function TestimonialImageGrid({ testimonialImages }: TestimonialImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {testimonialImages.map((imageUrl, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
            onClick={() => setSelectedImage(imageUrl)}
          >
            <div className="aspect-[9/16] overflow-hidden">
              <OptimizedImage
                src={imageUrl}
                alt={`Testimonial ${index + 1}`}
                className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                loading="lazy"
                width={540} // Half of the original width for better performance
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-50 group-hover:opacity-100">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Lihat Testimonial
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for enlarged view */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg">
            <OptimizedImage
              src={selectedImage}
              alt="Testimonial enlarged view"
              className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
              width={1080} // Full width for modal view
            />
            <button
              className="absolute right-4 top-4 rounded-full bg-white p-2 text-gray-800 shadow-md hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
