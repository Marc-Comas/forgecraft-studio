import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GallerySpec } from '@/spec/ForgeSpec';

interface GalleryProps {
  spec: GallerySpec;
}

export default function Gallery({ spec }: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!galleryRef.current) return;

      const images = galleryRef.current.querySelectorAll('[data-parallax]');
      const scrollY = window.scrollY;

      images.forEach((img) => {
        const element = img as HTMLElement;
        const speed = parseFloat(element.dataset.parallax || '0');
        
        if (speed !== 0) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          const windowHeight = window.innerHeight;
          
          // Only apply parallax when element is in viewport
          if (rect.top < windowHeight && rect.bottom > 0) {
            const yPos = (scrollY - elementTop) * speed;
            element.style.transform = `translateY(${yPos}px)`;
          }
        }
      });
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (spec.items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {spec.heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {spec.heading}
            </h2>
          </div>
        )}

        {/* Gallery */}
        <motion.div
          ref={galleryRef}
          className={cn(
            "gap-6",
            spec.layout === "masonry" 
              ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4" 
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {spec.items.map((item) => (
            <motion.figure
              key={item.uid}
              variants={itemVariants}
              className={cn(
                "relative overflow-hidden rounded-lg bg-muted",
                spec.layout === "masonry" ? "mb-6 break-inside-avoid" : ""
              )}
            >
              <div className="relative min-h-[200px]">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  data-parallax={item.parallax?.speed || 0}
                  className={cn(
                    "w-full h-auto object-cover transition-transform duration-300 hover:scale-105",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  )}
                  style={{
                    aspectRatio: spec.layout === "grid" ? "4/3" : "auto"
                  }}
                />
                
                {/* Loading placeholder to prevent CLS */}
                <div 
                  className="absolute inset-0 bg-muted animate-pulse"
                  style={{ 
                    display: 'none' // Will be shown via CSS if image fails to load
                  }}
                />
              </div>

              {/* Caption */}
              {item.caption && (
                <figcaption className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                  <p className="text-sm leading-relaxed font-medium">
                    {item.caption}
                  </p>
                </figcaption>
              )}

              {/* Hover overlay for better interaction feedback */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 pointer-events-none" />
            </motion.figure>
          ))}
        </motion.div>

        {/* Screen reader description */}
        <div className="sr-only">
          Gallery containing {spec.items.length} images
          {spec.layout === "masonry" ? " in masonry layout" : " in grid layout"}
        </div>
      </div>
    </section>
  );
}