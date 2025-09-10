import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExtendedFAQSpec } from '@/spec/ForgeSpec';

interface FAQProps {
  spec: ExtendedFAQSpec;
}

export default function FAQ({ spec }: FAQProps) {
  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!spec.structuredData) return null;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": spec.items.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    );
  };

  if (spec.items.length === 0) {
    return null;
  }

  return (
    <>
      {generateStructuredData()}
      
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {spec.heading && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {spec.heading}
              </h2>
            </div>
          )}

          {/* FAQ Accordion */}
          <Accordion
            type={spec.allowMultipleOpen ? "multiple" : "single"}
            collapsible
            className="space-y-4"
          >
            {spec.items.map((item) => (
              <AccordionItem
                key={item.uid}
                value={item.uid}
                className="border border-border rounded-lg bg-card px-6 py-2"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left [&[data-state=open]>svg]:rotate-180">
                  <span className="text-lg font-medium text-foreground pr-4">
                    {item.q}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </AccordionTrigger>
                
                <AccordionContent className="pb-6 pt-2">
                  <div className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}