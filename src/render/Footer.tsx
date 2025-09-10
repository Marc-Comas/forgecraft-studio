import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Twitter, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ExtendedFooterSpec } from '@/spec/ForgeSpec';

interface FooterProps {
  spec: ExtendedFooterSpec;
}

// Newsletter form schema
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  honeypot: z.string().max(0, 'Bot detected'), // Honeypot field
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

// Social media icons mapping
const socialIcons = {
  x: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
} as const;

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

export default function Footer({ spec }: FooterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onNewsletterSubmit = async (data: NewsletterForm) => {
    try {
      if (spec.newsletter?.endpoint) {
        // In a real implementation, you would send to the endpoint
        const response = await fetch(spec.newsletter.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email }),
        });

        if (response.ok) {
          reset();
          // You might want to show a success message here
        }
      } else {
        // Fallback - just reset the form
        reset();
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 lg:gap-12">
          {/* Main content grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Footer columns */}
            {spec.columns.map((column) => (
              <div key={column.uid} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {column.heading}
                </h3>
                <ul className="space-y-3" role="list">
                  {column.links.map((link) => (
                    <li key={link.uid}>
                      <a
                        href={link.href}
                        {...getSafeLinkProps(link.href)}
                        className={cn(
                          "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter section */}
            {spec.newsletter?.enabled && (
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Newsletter
                </h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with our latest news and updates.
                </p>
                
                <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-3">
                  {/* Honeypot field - hidden from users */}
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor={`honeypot-${spec.uid}`}>
                      Leave this field empty
                    </Label>
                    <Input
                      id={`honeypot-${spec.uid}`}
                      {...register('honeypot')}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Email input */}
                  <div className="space-y-2">
                    <Label htmlFor={`email-${spec.uid}`} className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id={`email-${spec.uid}`}
                      type="email"
                      placeholder={spec.newsletter.placeholder || 'Enter your email'}
                      {...register('email')}
                      className={cn(
                        "w-full",
                        errors.email && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? `email-error-${spec.uid}` : undefined}
                    />
                    {errors.email && (
                      <p
                        id={`email-error-${spec.uid}`}
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="sm"
                  >
                    <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                    {isSubmitting 
                      ? 'Subscribing...' 
                      : (spec.newsletter.submitLabel || 'Subscribe')
                    }
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved.
            </p>

            {/* Social links */}
            {spec.socials && spec.socials.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground sr-only">
                  Follow us on social media
                </span>
                {spec.socials.map((social, index) => {
                  const Icon = socialIcons[social.platform];
                  const platformNames = {
                    x: 'X (Twitter)',
                    linkedin: 'LinkedIn',
                    github: 'GitHub',
                    instagram: 'Instagram',
                  };

                  return (
                    <a
                      key={index}
                      href={social.href}
                      {...getSafeLinkProps(social.href)}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                      )}
                      aria-label={`Follow us on ${platformNames[social.platform]}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}