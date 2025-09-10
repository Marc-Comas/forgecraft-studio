import { z } from "zod";

// Base schemas for common fields
const AriaLabelsSchema = z.record(z.string()).optional();

const MotionSchema = z.object({
  entrance: z.enum(["fade", "slide", "scale", "bounce", "none"]).default("fade"),
  reduceOnPRM: z.boolean().default(true), // Prefers Reduced Motion
}).optional();

const ThemeTokensSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
  muted: z.string().optional(),
}).optional();

const MediaSchema = z.object({
  type: z.enum(["image", "video", "lottie"]),
  src: z.string(),
  alt: z.string().optional(),
  parallaxSpeed: z.number().min(0).max(2).optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
}).optional();

// Meta schema
const MetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  author: z.string().optional(),
  canonical: z.string().optional(),
  ogImage: z.string().optional(),
});

// Section schemas
const HeroSpecSchema = z.object({
  type: z.literal("hero"),
  headline: z.string(),
  subheadline: z.string().optional(),
  cta: z.object({
    primary: z.object({
      text: z.string(),
      href: z.string(),
      variant: z.enum(["default", "secondary", "outline", "ghost"]).default("default"),
    }),
    secondary: z.object({
      text: z.string(),
      href: z.string(),
      variant: z.enum(["default", "secondary", "outline", "ghost"]).default("outline"),
    }).optional(),
  }),
  media: MediaSchema,
  ariaLabels: AriaLabelsSchema,
  motion: MotionSchema,
  themeTokens: ThemeTokensSchema,
});

const FeaturesSpecSchema = z.object({
  type: z.literal("features"),
  headline: z.string(),
  subheadline: z.string().optional(),
  layout: z.enum(["grid", "list", "carousel"]).default("grid"),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
    media: MediaSchema,
  })),
  ariaLabels: AriaLabelsSchema,
  motion: MotionSchema,
  themeTokens: ThemeTokensSchema,
});

const PricingSpecSchema = z.object({
  type: z.literal("pricing"),
  headline: z.string(),
  subheadline: z.string().optional(),
  billing: z.enum(["monthly", "yearly", "both"]).default("both"),
  plans: z.array(z.object({
    name: z.string(),
    price: z.object({
      monthly: z.number(),
      yearly: z.number(),
    }),
    currency: z.string().default("USD"),
    features: z.array(z.string()),
    popular: z.boolean().default(false),
    cta: z.object({
      text: z.string(),
      href: z.string(),
    }),
  })),
  ariaLabels: AriaLabelsSchema,
  motion: MotionSchema,
  themeTokens: ThemeTokensSchema,
});

const TestimonialsSpecSchema = z.object({
  type: z.literal("testimonials"),
  headline: z.string(),
  subheadline: z.string().optional(),
  layout: z.enum(["grid", "carousel", "masonry"]).default("grid"),
  testimonials: z.array(z.object({
    content: z.string(),
    author: z.object({
      name: z.string(),
      title: z.string().optional(),
      company: z.string().optional(),
      avatar: z.string().optional(),
    }),
    rating: z.number().min(1).max(5).optional(),
  })),
  ariaLabels: AriaLabelsSchema,
  motion: MotionSchema,
  themeTokens: ThemeTokensSchema,
});

const FAQSpecSchema = z.object({
  type: z.literal("faq"),
  headline: z.string(),
  subheadline: z.string().optional(),
  layout: z.enum(["accordion", "grid"]).default("accordion"),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
  })),
  ariaLabels: AriaLabelsSchema,
  motion: MotionSchema,
  themeTokens: ThemeTokensSchema,
});

const FooterSpecSchema = z.object({
  type: z.literal("footer"),
  logo: z.object({
    src: z.string().optional(),
    alt: z.string().optional(),
  }).optional(),
  copyright: z.string(),
  links: z.array(z.object({
    group: z.string(),
    items: z.array(z.object({
      text: z.string(),
      href: z.string(),
    })),
  })).optional(),
  social: z.array(z.object({
    platform: z.string(),
    href: z.string(),
    icon: z.string().optional(),
  })).optional(),
  newsletter: z.object({
    headline: z.string(),
    description: z.string().optional(),
    placeholder: z.string().default("Enter your email"),
    cta: z.string().default("Subscribe"),
  }).optional(),
  ariaLabels: AriaLabelsSchema,
  motion: MotionSchema,
  themeTokens: ThemeTokensSchema,
});

// Union of all section types
const SectionSpecSchema = z.discriminatedUnion("type", [
  HeroSpecSchema,
  FeaturesSpecSchema,
  PricingSpecSchema,
  TestimonialsSpecSchema,
  FAQSpecSchema,
  FooterSpecSchema,
]);

// Main PageSpec schema
const PageSpecSchema = z.object({
  meta: MetaSchema,
  sections: z.array(SectionSpecSchema),
});

// Export Zod schemas
export {
  AriaLabelsSchema,
  MotionSchema,
  ThemeTokensSchema,
  MediaSchema,
  MetaSchema,
  HeroSpecSchema,
  FeaturesSpecSchema,
  PricingSpecSchema,
  TestimonialsSpecSchema,
  FAQSpecSchema,
  FooterSpecSchema,
  SectionSpecSchema,
  PageSpecSchema,
};

// Export TypeScript types
export type AriaLabels = z.infer<typeof AriaLabelsSchema>;
export type Motion = z.infer<typeof MotionSchema>;
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type HeroSpec = z.infer<typeof HeroSpecSchema>;
export type FeaturesSpec = z.infer<typeof FeaturesSpecSchema>;
export type PricingSpec = z.infer<typeof PricingSpecSchema>;
export type TestimonialsSpec = z.infer<typeof TestimonialsSpecSchema>;
export type FAQSpec = z.infer<typeof FAQSpecSchema>;
export type FooterSpec = z.infer<typeof FooterSpecSchema>;
export type SectionSpec = z.infer<typeof SectionSpecSchema>;
export type PageSpec = z.infer<typeof PageSpecSchema>;

// Additional types for extended pricing functionality
export type PricingPlan = {
  uid: string;
  name: string;
  monthly: number;
  yearly: number;
  currency?: "EUR" | "USD" | "GBP";
  highlight?: boolean;
  features: string[];
  cta?: { label: string; href?: string };
};

export type ExtendedPricingSpec = {
  kind: "pricing";
  uid: string;
  heading?: string;
  subcopy?: string;
  toggle?: { default: "monthly" | "yearly" };
  plans: PricingPlan[];
  note?: string; // IVA, disclaimers
};

// Additional types for extended testimonials functionality
export type TestimonialItem = {
  uid: string;
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
};

export type ExtendedTestimonialsSpec = {
  kind: "testimonials";
  uid: string;
  heading?: string;
  items: TestimonialItem[];
  autoplay?: { ms: number; pauseOnFocus?: boolean };
};

// Additional types for extended FAQ functionality
export type FAQItem = { uid: string; q: string; a: string };

export type ExtendedFAQSpec = {
  kind: "faq";
  uid: string;
  heading?: string;
  items: FAQItem[];
  allowMultipleOpen?: boolean;
  structuredData?: boolean; // schema.org FAQPage
};