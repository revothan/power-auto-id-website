interface TestimonialImageGridProps {
  testimonialImages: string[]
}

export default function TestimonialImageGrid({ testimonialImages }: TestimonialImageGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {testimonialImages.map((image, index) => (
        <div 
          key={index}
          className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
        >
          <img 
            src={image} 
            alt={`Testimonial ${index + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}
