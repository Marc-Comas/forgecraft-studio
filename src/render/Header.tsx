import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { HeaderSpec } from '@/spec/ForgeSpec';

interface HeaderProps {
  spec: HeaderSpec;
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

export default function Header({ spec }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Handle scroll effect for transparent until scroll
  useEffect(() => {
    if (!spec.transparentUntilScroll) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    // Use requestAnimationFrame to prevent jank
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }, [spec.transparentUntilScroll]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const headerClasses = cn(
    'w-full transition-all duration-300 ease-in-out border-b z-50',
    spec.sticky && 'sticky top-0',
    spec.transparentUntilScroll
      ? isScrolled
        ? 'bg-background/95 backdrop-blur-sm border-border shadow-sm'
        : 'bg-transparent border-transparent'
      : 'bg-background border-border'
  );

  return (
    <>
      {/* Skip Link */}
      <a
        href="#main"
        className={cn(
          'fixed top-4 left-4 z-[60] px-4 py-2 bg-primary text-primary-foreground rounded-md',
          'transform -translate-y-16 focus:translate-y-0 transition-transform duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        Skip to main content
      </a>

      <header ref={headerRef} className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand/Logo */}
            <div className="flex items-center">
              {spec.brand && (
                <a
                  href={spec.brand.href || '/'}
                  className={cn(
                    'flex items-center space-x-2 text-foreground hover:text-foreground/80 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
                  )}
                >
                  {spec.brand.logoUrl && (
                    <img
                      src={spec.brand.logoUrl}
                      alt={`${spec.brand.label} logo`}
                      className="h-8 w-auto"
                      loading="eager"
                    />
                  )}
                  <span className="font-semibold text-lg">
                    {spec.brand.label}
                  </span>
                </a>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation">
              <ul className="flex items-center space-x-8" role="list">
                {spec.items.map((item) => (
                  <li key={item.uid}>
                    <a
                      href={item.href}
                      {...getSafeLinkProps(item.href)}
                      className={cn(
                        'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop CTA + Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Desktop CTA */}
              {spec.cta && (
                <Button
                  asChild
                  className="hidden md:inline-flex"
                  size="sm"
                >
                  <a
                    href={spec.cta.href || '#'}
                    {...getSafeLinkProps(spec.cta.href || '#')}
                  >
                    {spec.cta.label}
                  </a>
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation links and actions
                  </SheetDescription>
                  
                  <div className="flex flex-col h-full">
                    {/* Mobile Brand */}
                    {spec.brand && (
                      <div className="flex items-center space-x-2 pb-6 border-b">
                        {spec.brand.logoUrl && (
                          <img
                            src={spec.brand.logoUrl}
                            alt={`${spec.brand.label} logo`}
                            className="h-6 w-auto"
                            loading="eager"
                          />
                        )}
                        <span className="font-semibold text-lg">
                          {spec.brand.label}
                        </span>
                      </div>
                    )}

                    {/* Mobile Navigation */}
                    <nav className="flex-1 py-6" role="navigation">
                      <ul className="space-y-4" role="list">
                        {spec.items.map((item) => (
                          <li key={item.uid}>
                            <a
                              href={item.href}
                              {...getSafeLinkProps(item.href)}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                'block text-lg font-medium text-foreground hover:text-primary transition-colors duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
                              )}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    {/* Mobile CTA */}
                    {spec.cta && (
                      <div className="pt-6 border-t">
                        <Button
                          asChild
                          className="w-full"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <a
                            href={spec.cta.href || '#'}
                            {...getSafeLinkProps(spec.cta.href || '#')}
                          >
                            {spec.cta.label}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}