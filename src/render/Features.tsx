import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeaturesSpec } from "@/spec/ForgeSpec";

interface FeaturesProps {
  spec: FeaturesSpec;
}

const Features: React.FC<FeaturesProps> = ({ spec }) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Apply theme tokens to CSS variables
  useEffect(() => {
    if (spec.themeTokens) {
      const root = document.documentElement;
      Object.entries(spec.themeTokens).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [spec.themeTokens]);

  const getMotionVariants = () => {
    if (shouldReduceMotion || spec.motion?.reduceOnPRM) {
      return {
        container: {},
        item: {}
      };
    }

    const entrance = spec.motion?.entrance || "fade";
    
    switch (entrance) {
      case "slide":
        return {
          container: {
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          },
          item: {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, ease: "easeOut" }
          }
        };
      case "scale":
        return {
          container: {
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          },
          item: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4, ease: "easeOut" }
          }
        };
      default: // fade
        return {
          container: {
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          },
          item: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.4, ease: "easeOut" }
          }
        };
    }
  };

  const motionVariants = getMotionVariants();

  const renderIcon = (iconClass: string | undefined, title: string) => {
    if (!iconClass) return null;

    // Render as icon class (e.g., "lucide-star", "fa-star", etc.)
    return (
      <div
        className={`w-6 h-6 mb-4 text-primary ${iconClass}`}
        aria-hidden="true"
      >
        <span className="sr-only">{title} icon</span>
      </div>
    );
  };

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="features-title"
      role="region"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {spec.subheadline && (
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-4">
              {spec.subheadline}
            </p>
          )}
          <h2
            id="features-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6"
          >
            {spec.headline}
          </h2>
        </div>

        {/* Features Grid */}
        <motion.div
          role="list"
          aria-label={spec.ariaLabels?.list || "Features list"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={motionVariants.container}
          initial="initial"
          animate="animate"
        >
          {spec.features.map((feature, index) => (
            <motion.div
              key={index}
              role="listitem"
              variants={motionVariants.item}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <CardHeader className="text-center">
                  {renderIcon(feature.icon, feature.title)}
                  <CardTitle 
                    className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors"
                    role="heading"
                    aria-level={3}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  
                  {/* Optional feature media */}
                  {feature.media && feature.media.type === "image" && (
                    <div className="mt-4">
                      <img
                        src={feature.media.src}
                        alt={feature.media.alt || `${feature.title} illustration`}
                        className="w-full h-48 object-cover rounded-md"
                        loading="lazy"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;