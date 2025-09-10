import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CTABandSpec } from '@/spec/ForgeSpec';

interface CTABandProps {
  spec: CTABandSpec;
}

// Helper function to determine if link is external
const isExternalLink = (href: string): boolean => {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
};

// Helper function to get safe link props
const getSafeLinkProps = (href: string) => {
  if (isExternalLink(href)) {
    return {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return {};
};

export default function CTABand({ spec }: CTABandProps) {
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Determine button variant based on style
  const buttonVariant = spec.cta.style === 'ghost' ? 'ghost' : 'default';

  return (
    <section className="w-full bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          variants={spec.motion?.entrance === 'fade-up' ? animationVariants : undefined}
          initial={spec.motion?.entrance === 'fade-up' ? 'hidden' : undefined}
          whileInView={spec.motion?.entrance === 'fade-up' ? 'visible' : undefined}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6"
        >
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {spec.heading}
          </h2>

          {/* Subcopy */}
          {spec.subcopy && (
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              {spec.subcopy}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              asChild
              variant={buttonVariant}
              size="lg"
              className={cn(
                "text-lg px-8 py-6 h-auto",
                buttonVariant === 'ghost' && 
                  "border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              )}
            >
              <a
                href={spec.cta.href || '#'}
                {...getSafeLinkProps(spec.cta.href || '#')}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {spec.cta.label}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}