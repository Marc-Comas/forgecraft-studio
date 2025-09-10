import { useEffect, useRef } from "react";
import { motion, useReducedMotion, Transition } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroSpec } from "@/spec/ForgeSpec";

interface HeroProps {
  spec: HeroSpec;
  variant?: "split" | "centered";
}

export function Hero({ spec, variant = "centered" }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);

  // Apply theme tokens to CSS variables
  useEffect(() => {
    if (spec.themeTokens && mediaRef.current) {
      const element = mediaRef.current;
      Object.entries(spec.themeTokens).forEach(([key, value]) => {
        if (value) {
          element.style.setProperty(`--hero-${key}`, value);
        }
      });
    }
  }, [spec.themeTokens]);

  // Parallax setup with Lenis (if available)
  useEffect(() => {
    if (spec.media?.parallaxSpeed && !shouldReduceMotion && mediaRef.current) {
      const element = mediaRef.current;
      
      // Check if Lenis is available
      if (typeof window !== 'undefined' && (window as any).lenis) {
        const lenis = (window as any).lenis;
        
        const handleScroll = () => {
          const rect = element.getBoundingClientRect();
          const scrolled = window.pageYOffset;
          const parallax = scrolled * (spec.media?.parallaxSpeed || 0);
          
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.style.transform = `translateY(${parallax}px)`;
          }
        };

        lenis.on('scroll', handleScroll);
        return () => lenis.off('scroll', handleScroll);
      }
    }
  }, [spec.media?.parallaxSpeed, shouldReduceMotion]);

  // Animation variants
  const getMotionVariants = (): any => {
    if (shouldReduceMotion && spec.motion?.reduceOnPRM) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 }
      };
    }

    const commonTransition = { duration: 0.6, ease: "easeOut" };

    switch (spec.motion?.entrance || "fade") {
      case "slide":
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: commonTransition
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { ...commonTransition, duration: 0.5 }
        };
      case "bounce":
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, type: "spring", bounce: 0.4 }
        };
      case "none":
        return {};
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6 }
        };
    }
  };

  const motionProps = getMotionVariants();

  const renderMedia = () => {
    if (!spec.media) return null;

    const mediaClasses = "w-full h-full object-cover";

    switch (spec.media.type) {
      case "video":
        return (
          <video
            className={mediaClasses}
            autoPlay={spec.media.autoplay}
            loop={spec.media.loop}
            muted={spec.media.muted}
            playsInline
            aria-label={spec.media.alt}
          >
            <source src={spec.media.src} type="video/mp4" />
          </video>
        );
      case "lottie":
        return (
          <div 
            className={mediaClasses}
            data-lottie={spec.media.src}
            aria-label={spec.media.alt}
          />
        );
      default: // image
        return (
          <img
            src={spec.media.src}
            alt={spec.media.alt || ""}
            className={mediaClasses}
          />
        );
    }
  };

  if (variant === "split") {
    return (
      <section 
        className="min-h-screen flex items-center bg-background"
        aria-label={spec.ariaLabels?.section || "Hero section"}
        style={spec.themeTokens ? {
          '--primary': `var(--hero-primary, hsl(var(--primary)))`,
          '--secondary': `var(--hero-secondary, hsl(var(--secondary)))`,
          '--accent': `var(--hero-accent, hsl(var(--accent)))`,
        } as React.CSSProperties : undefined}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div 
              className="space-y-6"
              {...motionProps}
            >
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                aria-label={spec.ariaLabels?.headline}
              >
                {spec.headline}
              </h1>
              
              {spec.subheadline && (
                <p 
                  className="text-xl text-muted-foreground max-w-lg"
                  aria-label={spec.ariaLabels?.subheadline}
                >
                  {spec.subheadline}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Button
                  variant={spec.cta.primary.variant}
                  size="lg"
                  asChild
                  className="hover-scale"
                  aria-label={spec.ariaLabels?.primaryCta}
                >
                  <a href={spec.cta.primary.href}>
                    {spec.cta.primary.text}
                  </a>
                </Button>

                {spec.cta.secondary && (
                  <Button
                    variant={spec.cta.secondary.variant}
                    size="lg"
                    asChild
                    className="hover-scale"
                    aria-label={spec.ariaLabels?.secondaryCta}
                  >
                    <a href={spec.cta.secondary.href}>
                      {spec.cta.secondary.text}
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Media */}
            <motion.div
              ref={mediaRef}
              className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden bg-muted"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              aria-label={spec.ariaLabels?.media}
            >
              {renderMedia()}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Centered variant
  return (
    <section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background"
      aria-label={spec.ariaLabels?.section || "Hero section"}
      style={spec.themeTokens ? {
        '--primary': `var(--hero-primary, hsl(var(--primary)))`,
        '--secondary': `var(--hero-secondary, hsl(var(--secondary)))`,
        '--accent': `var(--hero-accent, hsl(var(--accent)))`,
      } as React.CSSProperties : undefined}
    >
      {/* Background Media */}
      {spec.media && (
        <motion.div
          ref={mediaRef}
          className="absolute inset-0 -z-10"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.2 }}
          aria-label={spec.ariaLabels?.backgroundMedia}
        >
          {renderMedia()}
          <div className="absolute inset-0 bg-background/60" />
        </motion.div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          className="max-w-4xl mx-auto space-y-8"
          {...motionProps}
        >
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
            aria-label={spec.ariaLabels?.headline}
          >
            {spec.headline}
          </h1>
          
          {spec.subheadline && (
            <p 
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
              aria-label={spec.ariaLabels?.subheadline}
            >
              {spec.subheadline}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={spec.cta.primary.variant}
              size="lg"
              asChild
              className="hover-scale text-lg px-8 py-4"
              aria-label={spec.ariaLabels?.primaryCta}
            >
              <a href={spec.cta.primary.href}>
                {spec.cta.primary.text}
              </a>
            </Button>

            {spec.cta.secondary && (
              <Button
                variant={spec.cta.secondary.variant}
                size="lg"
                asChild
                className="hover-scale text-lg px-8 py-4"
                aria-label={spec.ariaLabels?.secondaryCta}
              >
                <a href={spec.cta.secondary.href}>
                  {spec.cta.secondary.text}
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}