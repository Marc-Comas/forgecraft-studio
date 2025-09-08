import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Rocket, 
  Zap, 
  Code2, 
  Palette, 
  Settings, 
  Globe, 
  Github, 
  ExternalLink,
  Play,
  FileText,
  MessageCircle,
  Search
} from "lucide-react";

const Docs = () => {
  const quickStartSteps = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Create Account",
      description: "Sign up for SiteForge Studio and access your dashboard"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Choose Template",
      description: "Select from our premium template library or start from scratch"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Customize Design", 
      description: "Use our AI-powered editor to customize colors, content, and layout"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Publish & Deploy",
      description: "Export your site or deploy directly to Netlify with one click"
    }
  ];

  const features = [
    {
      title: "AI-Powered Generation",
      description: "Generate entire websites from simple text prompts using advanced AI",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "DOM-Patcher System",
      description: "Make precise edits without breaking your website structure",
      icon: <Code2 className="w-5 h-5" />
    },
    {
      title: "Real-time Preview",
      description: "See your changes instantly across desktop, tablet, and mobile",
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: "Version Control",
      description: "Track changes and rollback to any previous version",
      icon: <Github className="w-5 h-5" />
    }
  ];

  const faqs = [
    {
      question: "How does AI generation work?",
      answer: "SiteForge Studio uses advanced language models to interpret your prompts and generate semantic website structures using our proprietary DSL (Domain Specific Language). This ensures consistent, high-quality output that follows web best practices."
    },
    {
      question: "What is the DOM-Patcher system?",
      answer: "Our DOM-Patcher is a revolutionary system that prevents 'phantom changes' - modifications that don't actually affect your website. It uses granular selectors and verification to ensure every edit you make has a real impact."
    },
    {
      question: "Can I export my website?",
      answer: "Yes! You can export your complete website as a ZIP file containing all assets, or deploy directly to platforms like Netlify and Vercel with integrated deployment tools."
    },
    {
      question: "Are the templates responsive?",
      answer: "Absolutely. All templates are built with mobile-first design principles and are fully responsive across all device sizes. Our editor includes device preview modes for testing."
    },
    {
      question: "Do I need coding knowledge?",
      answer: "No coding knowledge is required. However, advanced users can access the code editor for custom modifications. The platform is designed to be powerful for developers yet accessible to non-technical users."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="container mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about SiteForge Studio. 
            From getting started to advanced features.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover-lift cursor-pointer">
            <CardHeader className="text-center">
              <Play className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Quick Start</CardTitle>
              <CardDescription>Get up and running in minutes</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover-lift cursor-pointer">
            <CardHeader className="text-center">
              <Code2 className="w-8 h-8 text-secondary mx-auto mb-2" />
              <CardTitle className="text-lg">API Reference</CardTitle>
              <CardDescription>Detailed API documentation</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover-lift cursor-pointer">
            <CardHeader className="text-center">
              <MessageCircle className="w-8 h-8 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">Community</CardTitle>
              <CardDescription>Join our developer community</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to create your first website with SiteForge Studio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickStartSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground mx-auto mb-4">
                          {step.icon}
                        </div>
                        <h3 className="font-heading font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Installation & Setup</CardTitle>
                  <CardDescription>
                    Get SiteForge Studio running in your environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">System Requirements</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                      <li>Stable internet connection for AI features</li>
                      <li>Optional: Node.js 18+ for local development</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Browser Setup</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Simply visit our web application - no installation required:
                    </p>
                    <Button className="btn-cyber">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Launch SiteForge Studio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover-lift h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            {feature.icon}
                          </div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>
                    Explore the full power of SiteForge Studio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ai-generation">
                      <AccordionTrigger>AI Generation Engine</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Our AI engine uses a proprietary DSL (Domain Specific Language) to generate 
                          semantic website structures. It understands design principles, accessibility 
                          requirements, and modern web standards to create professional websites from 
                          simple text descriptions.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="dom-patcher">
                      <AccordionTrigger>DOM-Patcher Technology</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          The DOM-Patcher prevents "phantom changes" by using granular selectors and 
                          real-time verification. Every edit is validated to ensure it produces the 
                          intended visual result, maintaining website integrity throughout the editing process.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="responsive-design">
                      <AccordionTrigger>Responsive Design System</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          All generated websites are built with mobile-first responsive design principles. 
                          The editor includes device preview modes and automatically optimizes layouts 
                          for different screen sizes using modern CSS Grid and Flexbox techniques.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="api">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    API Reference
                  </CardTitle>
                  <CardDescription>
                    Integrate SiteForge Studio capabilities into your applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Base URL</h4>
                      <code className="text-sm bg-background px-2 py-1 rounded">
                        https://api.siteforge.studio/v1
                      </code>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Available Endpoints</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
                          <Badge variant="outline">POST</Badge>
                          <code className="text-sm">/generate</code>
                          <span className="text-sm text-muted-foreground">Generate website from prompt</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
                          <Badge variant="outline">POST</Badge>
                          <code className="text-sm">/patch</code>
                          <span className="text-sm text-muted-foreground">Apply DOM patches</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
                          <Badge variant="outline">GET</Badge>
                          <code className="text-sm">/templates</code>
                          <span className="text-sm text-muted-foreground">List available templates</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Button variant="outline" className="mr-3">
                        <FileText className="w-4 h-4 mr-2" />
                        View Full API Docs
                      </Button>
                      <Button variant="outline">
                        <Github className="w-4 h-4 mr-2" />
                        SDK Examples
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="faq">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Common questions about SiteForge Studio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Still have questions?</CardTitle>
                  <CardDescription>
                    Get help from our community and support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Community Forum
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Docs;