import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageSpecSchema, type PageSpec } from "@/spec/ForgeSpec";
import { Hero } from "@/render/Hero";

// Mock PageSpec for development/testing
const mockPageSpec: PageSpec = {
  meta: {
    title: "Preview Page - Modern Landing",
    description: "A preview of a modern landing page built with React and Tailwind CSS",
    keywords: ["preview", "landing", "modern", "react"],
    author: "Lovable",
    canonical: "https://example.com/preview",
    ogImage: "https://example.com/og-image.jpg"
  },
  sections: [
    {
      type: "hero",
      headline: "Build Amazing Experiences",
      subheadline: "Create stunning landing pages with our powerful page builder and modern components.",
      cta: {
        primary: {
          text: "Get Started",
          href: "/dashboard",
          variant: "default"
        },
        secondary: {
          text: "Learn More",
          href: "/docs",
          variant: "outline"
        }
      },
      media: {
        type: "image",
        src: "/src/assets/hero-bg.jpg",
        alt: "Hero background showing modern web design",
        parallaxSpeed: 0.5
      },
      ariaLabels: {
        section: "Hero section",
        headline: "Main headline",
        subheadline: "Supporting text",
        primaryCta: "Get started button",
        secondaryCta: "Learn more button",
        media: "Hero background image"
      },
      motion: {
        entrance: "fade",
        reduceOnPRM: true
      },
      themeTokens: {
        primary: "hsl(220, 100%, 50%)",
        secondary: "hsl(220, 20%, 90%)",
        accent: "hsl(280, 100%, 60%)"
      }
    }
  ]
};

export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const [pageSpec, setPageSpec] = useState<PageSpec | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageSpec = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get PageSpec from query parameters
        const specParam = searchParams.get('spec');
        const sourceParam = searchParams.get('source');

        let rawSpec: any = null;

        if (specParam) {
          // Direct JSON in query parameter
          try {
            rawSpec = JSON.parse(decodeURIComponent(specParam));
          } catch (parseError) {
            throw new Error('Invalid JSON in spec parameter');
          }
        } else if (sourceParam) {
          // Load from URL
          try {
            const response = await fetch(sourceParam);
            if (!response.ok) {
              throw new Error(`Failed to fetch spec from ${sourceParam}`);
            }
            rawSpec = await response.json();
          } catch (fetchError) {
            throw new Error(`Error loading spec from URL: ${fetchError}`);
          }
        } else {
          // Use mock data
          rawSpec = mockPageSpec;
        }

        // Validate with Zod
        const validatedSpec = PageSpecSchema.parse(rawSpec);
        setPageSpec(validatedSpec);

        // Update document meta
        if (validatedSpec.meta) {
          document.title = validatedSpec.meta.title;
          
          // Update meta description
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
          }
          metaDescription.setAttribute('content', validatedSpec.meta.description);

          // Update canonical URL if provided
          if (validatedSpec.meta.canonical) {
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (!canonicalLink) {
              canonicalLink = document.createElement('link');
              canonicalLink.setAttribute('rel', 'canonical');
              document.head.appendChild(canonicalLink);
            }
            canonicalLink.setAttribute('href', validatedSpec.meta.canonical);
          }

          // Update Open Graph image if provided
          if (validatedSpec.meta.ogImage) {
            let ogImage = document.querySelector('meta[property="og:image"]');
            if (!ogImage) {
              ogImage = document.createElement('meta');
              ogImage.setAttribute('property', 'og:image');
              document.head.appendChild(ogImage);
            }
            ogImage.setAttribute('content', validatedSpec.meta.ogImage);
          }
        }

      } catch (validationError) {
        console.error('PageSpec validation error:', validationError);
        if (validationError instanceof Error) {
          setError(`Validation Error: ${validationError.message}`);
        } else {
          setError('Invalid PageSpec format');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPageSpec();
  }, [searchParams]);

  const renderSection = (section: PageSpec['sections'][0], index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <Hero 
            key={`hero-${index}`}
            spec={section}
            variant="centered"
          />
        );
      
      case 'features':
        // TODO: Implement Features renderer
        return (
          <div key={`features-${index}`} className="min-h-screen flex items-center justify-center bg-muted">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Features Section</h2>
              <p className="text-muted-foreground">Features renderer not yet implemented</p>
            </div>
          </div>
        );

      case 'pricing':
        // TODO: Implement Pricing renderer
        return (
          <div key={`pricing-${index}`} className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Pricing Section</h2>
              <p className="text-muted-foreground">Pricing renderer not yet implemented</p>
            </div>
          </div>
        );

      case 'testimonials':
        // TODO: Implement Testimonials renderer
        return (
          <div key={`testimonials-${index}`} className="min-h-screen flex items-center justify-center bg-muted">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Testimonials Section</h2>
              <p className="text-muted-foreground">Testimonials renderer not yet implemented</p>
            </div>
          </div>
        );

      case 'faq':
        // TODO: Implement FAQ renderer
        return (
          <div key={`faq-${index}`} className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">FAQ Section</h2>
              <p className="text-muted-foreground">FAQ renderer not yet implemented</p>
            </div>
          </div>
        );

      case 'footer':
        // TODO: Implement Footer renderer
        return (
          <div key={`footer-${index}`} className="py-12 bg-muted">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Footer Section</h2>
              <p className="text-muted-foreground">Footer renderer not yet implemented</p>
            </div>
          </div>
        );

      default:
        return (
          <div key={`unknown-${index}`} className="min-h-96 flex items-center justify-center bg-destructive/10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-destructive">Unknown Section Type</h2>
              <p className="text-muted-foreground">
                Section type "{(section as any).type}" is not supported
              </p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading page specification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-destructive">Specification Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="bg-muted p-4 rounded-lg text-left text-sm">
            <p className="font-medium mb-2">Usage examples:</p>
            <code className="block mb-2">?spec={"{"}"meta":{"{"}"title":"My Page"{"}"},"sections":[...]{"}"}</code>
            <code className="block mb-2">?source=https://api.example.com/pagespec.json</code>
            <code className="block">No parameters = uses mock data</code>
          </div>
        </div>
      </div>
    );
  }

  if (!pageSpec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No page specification available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {pageSpec.sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}