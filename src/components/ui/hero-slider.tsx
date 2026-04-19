'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SliderItem } from '@/types'

interface HeroSliderProps {
  slides: SliderItem[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-48 md:h-64 lg:h-80 bg-linear-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            Welcome to TechPinik
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6">
            Your trusted electronics store in Bangladesh
          </p>
          <Button
            size="sm"
            className="sm:h-11 sm:px-6 sm:text-base bg-white text-yellow-600 hover:bg-gray-100"
          >
            Shop Now
          </Button>
        </div>
      </div>
    )
  }

  const slideCount = slides.length
  const trackPct = slideCount * 100
  const slidePct = 100 / slideCount

  return (
    <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg">
      {/* Track: width = N × viewport; translate by one viewport per slide */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          width: `${trackPct}%`,
          transform: `translateX(-${(currentSlide * 100) / slideCount}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative h-full shrink-0"
            style={{ width: `${slidePct}%` }}
          >
            {slide.image_url ? (
              <Image
                src={slide.image_url}
                alt={slide.title || 'Slider image'}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                unoptimized
                onError={(e) => {
                  console.error('Image failed to load:', slide.image_url)
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-yellow-400 to-blue-500" />
            )}
            {/* Light gradient: clearer image on top/center, slightly darker only toward bottom for text contrast */}
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-auto max-w-4xl px-4 text-center text-white">
                <h2 className="mb-2 text-lg font-bold drop-shadow-md sm:mb-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="mb-4 text-sm opacity-95 drop-shadow-md sm:mb-6 sm:text-base md:text-lg lg:text-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.75)]">
                    {slide.subtitle}
                  </p>
                )}
                {slide.link_url && (
                  <Link href={slide.link_url}>
                    <Button
                      size="sm"
                      className="sm:h-11 sm:px-6 sm:text-base bg-yellow-600 hover:bg-yellow-700 shadow-lg"
                    >
                      Shop Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-yellow-500 p-2 rounded-full transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-yellow-500 p-2 rounded-full transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-yellow-500' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
