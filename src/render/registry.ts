import React from "react";
import Features from "./Features";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Gallery from "./Gallery";
import Footer from "./Footer";
import Header from "./Header";
import CTABand from "./CTABand";

export const renderMap = {
  features: Features,
  pricing: Pricing,
  testimonials: Testimonials,
  faq: FAQ,
  gallery: Gallery,
  footer: Footer,
  header: Header,
  "cta-band": CTABand,
};

/**
 * Render a section based on its spec.kind
 * @param spec - Section specification with kind property
 * @returns React element for the section
 */
export function renderSection(spec: { kind: string; uid?: string; [key: string]: any }) {
  const Component = renderMap[spec.kind as keyof typeof renderMap];
  
  if (!Component) {
    return React.createElement("section", { 
      "data-uid": spec.uid || `unknown-${spec.kind}` 
    });
  }
  
  return React.createElement(Component as any, { spec });
}