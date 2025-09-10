import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HeaderSpec } from "@/spec/ForgeSpec";
import { cn } from "@/lib/utils";

interface HeaderProps {
  spec: HeaderSpec;
}

// Helper to detect external links
const isExternalLink = (href: string): boolean => {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
};

// Helper to get safe link props
const getSafeLinkProps = (href: string) => {
  if (isExternalLink(href)) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
};

const Header: React.FC<HeaderProps> = ({ spec }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for transparency
  useEffect(() => {
    if (!spec.transparentUntilScroll) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [spec.transparentUntilScroll]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const headerClasses = cn(
    "w-full transition-all duration-300 ease-in-out z-50",
    spec.sticky ? "fixed top-0" : "relative",
    spec.transparentUntilScroll 
      ? isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
        : "bg-transparent"
      : "bg-background border-b border-border"
  );

  const brandClasses = cn(
    "flex items-center space-x-2 transition-colors duration-200",
    spec.transparentUntilScroll && !isScrolled ? "text-foreground" : "text-foreground"
  );

  const navClasses = cn(
    "transition-colors duration-200",
    spec.transparentUntilScroll && !isScrolled ? "text-foreground/80" : "text-muted-foreground"
  );

  return (
    <header className={headerClasses} data-uid={spec.uid}>
      {/* Skip to main content link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] bg-background text-foreground px-4 py-2 rounded-md border border-border"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className={brandClasses}>
            {spec.brand && (
              <a
                href={spec.brand.href || "/"}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                {...getSafeLinkProps(spec.brand.href || "/")}
              >
                {spec.brand.logoUrl && (
                  <img
                    src={spec.brand.logoUrl}
                    alt={spec.brand.label || "Logo"}
                    className="h-8 w-auto"
                  />
                )}
                {spec.brand.label && (
                  <span className="font-semibold text-lg">{spec.brand.label}</span>
                )}
              </a>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {spec.items.map((item) => (
              <a
                key={item.uid}
                href={item.href}
                className={cn(
                  navClasses,
                  "hover:text-foreground transition-colors font-medium"
                )}
                {...getSafeLinkProps(item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA + Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop CTA */}
            {spec.cta && (
              <Button
                asChild
                className="hidden md:inline-flex"
                variant="default"
              >
                <a
                  href={spec.cta.href || "#"}
                  {...getSafeLinkProps(spec.cta.href || "#")}
                >
                  {spec.cta.label}
                </a>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    {spec.brand?.label || "Navigation"}
                  </SheetTitle>
                </SheetHeader>
                
                <div 
                  ref={menuRef}
                  id="mobile-menu"
                  className="flex flex-col space-y-4 mt-8"
                >
                  {/* Mobile Navigation Links */}
                  {spec.items.map((item) => (
                    <a
                      key={item.uid}
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                      {...getSafeLinkProps(item.href)}
                    >
                      {item.label}
                    </a>
                  ))}
                  
                  {/* Mobile CTA */}
                  {spec.cta && (
                    <div className="pt-4 border-t border-border">
                      <Button
                        asChild
                        className="w-full"
                        variant="default"
                      >
                        <a
                          href={spec.cta.href || "#"}
                          onClick={() => setIsMenuOpen(false)}
                          {...getSafeLinkProps(spec.cta.href || "#")}
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
  );
};

export default Header;