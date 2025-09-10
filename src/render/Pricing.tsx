import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExtendedPricingSpec } from '@/spec/ForgeSpec';

interface PricingProps {
  spec: ExtendedPricingSpec;
}

export default function Pricing({ spec }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    spec.toggle?.default || 'monthly'
  );

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {spec.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {spec.heading}
            </h2>
          )}
          {spec.subcopy && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {spec.subcopy}
            </p>
          )}
        </div>

        {/* Billing Toggle */}
        {spec.toggle && (
          <div className="flex justify-center mb-12">
            <div className="bg-muted p-1 rounded-lg inline-flex" role="group">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  billingCycle === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={billingCycle === 'monthly'}
                aria-label="Switch to monthly billing"
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  billingCycle === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={billingCycle === 'yearly'}
                aria-label="Switch to yearly billing"
              >
                Yearly
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <motion.div
          className="grid gap-8 lg:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {spec.plans.map((plan) => (
            <motion.div
              key={plan.uid}
              variants={cardVariants}
              className={cn(
                'relative bg-card border rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-200',
                plan.highlight &&
                  'border-primary ring-2 ring-primary/10 scale-105 lg:scale-110'
              )}
            >
              {/* Popular Badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <motion.div
                className="mb-6"
                variants={priceVariants}
                key={billingCycle}
              >
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'}
                    {billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Save ${(plan.monthly * 12) - plan.yearly} per year
                  </p>
                )}
              </motion.div>

              {/* Features */}
              <ul className="space-y-3 mb-8" role="list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.cta && (
                <Button
                  asChild
                  variant={plan.highlight ? 'default' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  <a
                    href={plan.cta.href || '#'}
                    aria-label={`Choose ${plan.name} plan`}
                  >
                    {plan.cta.label}
                  </a>
                </Button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        {spec.note && (
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            {spec.note}
          </p>
        )}
      </div>
    </section>
  );
}