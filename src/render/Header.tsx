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
    "w-full transition-all duration-500 ease-in-out z-50",
    spec.sticky ? "fixed top-0" : "relative",
    spec.transparentUntilScroll 
      ? isScrolled 
        ? "bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg cyber-glow" 
        : "bg-gradient-to-r from-background/5 via-background/10 to-background/5 backdrop-blur-sm"
      : "bg-gradient-dark border-b border-primary/30 cyber-glow"
  );

  const brandClasses = cn(
    "flex items-center space-x-3 transition-all duration-300 hover-lift",
    spec.transparentUntilScroll && !isScrolled ? "text-gradient-primary" : "text-gradient-primary"
  );

  const navClasses = cn(
    "transition-all duration-300 font-medium relative group",
    "text-foreground/80 hover:text-primary",
    "after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0",
    "after:bg-gradient-primary after:transition-all after:duration-300",
    "hover:after:w-full hover:scale-105"
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
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className={brandClasses}>
            {spec.brand && (
              <a
                href={spec.brand.href || "/"}
                className="flex items-center space-x-3 hover:scale-110 transition-all duration-300 group"
                {...getSafeLinkProps(spec.brand.href || "/")}
              >
                {spec.brand.logoUrl && (
                  <div className="relative p-2 bg-gradient-primary rounded-xl hover-glow">
                    <img
                      src={spec.brand.logoUrl}
                      alt={spec.brand.label || "Logo"}
                      className="h-10 w-auto filter brightness-0 invert"
                    />
                  </div>
                )}
                {spec.brand.label && (
                  <span className="font-display font-bold text-2xl text-gradient-primary group-hover:scale-105 transition-transform duration-300">
                    {spec.brand.label}
                  </span>
                )}
              </a>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {spec.items.map((item, index) => (
              <a
                key={item.uid}
                href={item.href}
                className={navClasses}
                style={{ animationDelay: `${index * 0.1}s` }}
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
              <a
                href={spec.cta.href || "#"}
                className="hidden md:inline-flex btn-cyber animate-pulse-glow hover-lift"
                {...getSafeLinkProps(spec.cta.href || "#")}
              >
                {spec.cta.label}
              </a>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden p-3 bg-gradient-primary/10 border border-primary/30 hover:bg-gradient-primary hover:text-primary-foreground transition-all duration-300 hover-glow"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                >
                  {isMenuOpen ? 
                    <X className="h-6 w-6 text-primary" /> : 
                    <Menu className="h-6 w-6 text-primary" />
                  }
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[420px] bg-gradient-dark border-l border-primary/30 backdrop-blur-xl">
                <SheetHeader className="pb-6">
                  <SheetTitle className="text-left text-2xl font-display text-gradient-primary">
                    {spec.brand?.label || "Navigation"}
                  </SheetTitle>
                </SheetHeader>
                
                <div 
                  ref={menuRef}
                  id="mobile-menu"
                  className="flex flex-col space-y-6 mt-8"
                >
                  {/* Mobile Navigation Links */}
                  {spec.items.map((item, index) => (
                    <a
                      key={item.uid}
                      href={item.href}
                      className="text-xl font-medium text-foreground/80 hover:text-primary transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/30 hover-lift group animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setIsMenuOpen(false)}
                      {...getSafeLinkProps(item.href)}
                    >
                      <span className="relative">
                        {item.label}
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                    </a>
                  ))}
                  
                  {/* Mobile CTA */}
                  {spec.cta && (
                    <div className="pt-6 border-t border-primary/20">
                      <a
                        href={spec.cta.href || "#"}
                        className="btn-cyber w-full text-center block animate-pulse-glow hover-lift"
                        onClick={() => setIsMenuOpen(false)}
                        {...getSafeLinkProps(spec.cta.href || "#")}
                      >
                        {spec.cta.label}
                      </a>
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