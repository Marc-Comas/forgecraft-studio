import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    quote: "SiteForge Studio transformed our landing page creation process. What used to take weeks now takes hours, and the quality is consistently outstanding.",
    gradient: "from-primary to-secondary",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Lead Developer",
    company: "StartupXYZ",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    quote: "The DOM-Patcher system is revolutionary. No more broken layouts or phantom changes. Every edit works exactly as intended.",
    gradient: "from-secondary to-accent",
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Creative Director",
    company: "Design Studio",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    quote: "The premium sections and animations are incredible. Our clients are amazed by the professional quality and smooth interactions.",
    gradient: "from-accent to-primary",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Freelance Developer",
    company: "Independent",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    quote: "As a freelancer, SiteForge Studio has 10x'd my productivity. I can deliver enterprise-quality sites in record time.",
    gradient: "from-primary to-secondary",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Marketing Director",
    company: "Growth Co",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    quote: "The A/B testing and analytics integration helped us improve our conversion rates by 300%. Absolutely game-changing.",
    gradient: "from-secondary to-accent",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/20 via-background to-card/20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl transform -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Trusted by
            <br />
            <span className="text-gradient-primary">Developers Worldwide</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers and teams who are building faster and better with SiteForge Studio.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border text-center relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed max-w-3xl mx-auto">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={testimonials[currentIndex].avatar} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-muted-foreground">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentIndex].gradient} opacity-5 pointer-events-none`} />
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevSlide}
            className="p-2 hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dot Indicators */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextSlide}
            className="p-2 hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Auto-play Indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {isAutoPlaying ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Auto-playing testimonials</span>
            </span>
          ) : (
            <span>Paused • Will resume in a few seconds</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;