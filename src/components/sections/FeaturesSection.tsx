import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3,
  Code2,
  Layers3,
  Bot
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Generation",
    description: "Generate professional landing pages from simple prompts with GPT-4 intelligence.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Code2,
    title: "DOM-Patcher System",
    description: "Granular edits with anti-phantom verification ensure precise changes every time.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Layers3,
    title: "Premium Sections",
    description: "Professional components with animations, parallax, and accessibility built-in.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Palette,
    title: "Design System",
    description: "Multi-brandable themes with semantic tokens and consistent visual identity.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "98+ Lighthouse scores with optimized images, lazy loading, and RSC architecture.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Shield,
    title: "Security & A11y",
    description: "WCAG 2.1 compliance, CSP headers, and enterprise-grade security standards.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Globe,
    title: "i18n Ready",
    description: "Multi-language support with localized routes and content management.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: BarChart3,
    title: "Analytics & A/B",
    description: "Built-in analytics with A/B testing and conversion optimization tools.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Sparkles,
    title: "One-Click Deploy",
    description: "Export or deploy directly to Vercel, Netlify, or your preferred hosting platform.",
    gradient: "from-accent to-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Everything You Need to
            <br />
            <span className="text-gradient-primary">Build & Scale</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade tools and features designed for modern web development.
            From AI generation to deployment, we've got you covered.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 group hover-lift">
                <motion.div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Ready to experience the future of web development?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-cyber px-8 py-4 text-lg group"
          >
            <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Try UX/I Studio
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;