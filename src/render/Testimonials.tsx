import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExtendedTestimonialsSpec } from '@/spec/ForgeSpec';

interface TestimonialsProps {
  spec: ExtendedTestimonialsSpec;
}

export default function Testimonials({ spec }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  const totalItems = spec.items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (spec.autoplay && !isPaused && totalItems > 1) {
      autoplayRef.current = setInterval(nextSlide, spec.autoplay.ms);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [spec.autoplay, isPaused, nextSlide, totalItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!carouselRef.current?.contains(event.target as Node)) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextSlide();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleMouseEnter = () => {
    if (spec.autoplay?.pauseOnFocus) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (spec.autoplay?.pauseOnFocus) {
      setIsPaused(false);
    }
  };

  const handleFocus = () => {
    if (spec.autoplay?.pauseOnFocus) {
      setIsPaused(true);
    }
  };

  const handleBlur = () => {
    if (spec.autoplay?.pauseOnFocus) {
      setIsPaused(false);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {spec.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {spec.heading}
            </h2>
          </div>
        )}

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          {/* Live region for screen readers */}
          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            Testimonial {currentIndex + 1} of {totalItems}
          </div>

          {/* Main testimonial display */}
          <div className="relative overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="bg-card border rounded-lg p-8 shadow-sm">
                  {/* Quote Icon */}
                  <Quote
                    className="h-8 w-8 text-primary mx-auto mb-6"
                    aria-hidden="true"
                  />

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                    "{spec.items[currentIndex].quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    {spec.items[currentIndex].avatarUrl && (
                      <img
                        src={spec.items[currentIndex].avatarUrl}
                        alt={`${spec.items[currentIndex].author} portrait`}
                        className="h-12 w-12 rounded-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="text-left">
                      <cite className="font-semibold text-foreground not-italic">
                        {spec.items[currentIndex].author}
                      </cite>
                      {spec.items[currentIndex].role && (
                        <p className="text-sm text-muted-foreground">
                          {spec.items[currentIndex].role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          {totalItems > 1 && (
            <>
              {/* Previous/Next Buttons */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  className="h-10 w-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center space-x-2 mt-6">
                {spec.items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all duration-200',
                      index === currentIndex
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-pressed={index === currentIndex}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fallback for no-JS */}
        <noscript>
          <div className="space-y-8">
            {spec.items.map((item) => (
              <div key={item.uid} className="bg-card border rounded-lg p-8 shadow-sm">
                <Quote
                  className="h-8 w-8 text-primary mx-auto mb-6"
                  aria-hidden="true"
                />
                <blockquote className="text-lg text-foreground leading-relaxed mb-6 text-center">
                  "{item.quote}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  {item.avatarUrl && (
                    <img
                      src={item.avatarUrl}
                      alt={`${item.author} portrait`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <cite className="font-semibold text-foreground not-italic">
                      {item.author}
                    </cite>
                    {item.role && (
                      <p className="text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}