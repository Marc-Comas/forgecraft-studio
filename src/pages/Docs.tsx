import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  Code2, 
  Zap, 
  Settings, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  FileText,
  Video,
  Users,
  MessageCircle,
  Github,
  ArrowRight
} from "lucide-react";

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const quickStart = [
    {
      title: "Getting Started",
      description: "Learn the basics of creating your first project",
      icon: BookOpen,
      time: "5 min read",
      link: "#getting-started"
    },
    {
      title: "AI Prompts Guide",
      description: "Master the art of writing effective AI prompts",
      icon: Zap,
      time: "10 min read",
      link: "#ai-prompts"
    },
    {
      title: "Code Editor Tutorial",
      description: "Advanced editing features and shortcuts",
      icon: Code2,
      time: "8 min read",
      link: "#code-editor"
    },
    {
      title: "Deployment Options",
      description: "Deploy your projects to various platforms",
      icon: Settings,
      time: "12 min read",
      link: "#deployment"
    }
  ];

  const documentation = [
    {
      category: "Basics",
      articles: [
        { title: "Introduction to SiteForge Studio", description: "Overview of features and capabilities" },
        { title: "Creating Your First Project", description: "Step-by-step tutorial" },
        { title: "Understanding AI Generation", description: "How our AI works" },
        { title: "Project Management", description: "Organizing and managing projects" }
      ]
    },
    {
      category: "Advanced",
      articles: [
        { title: "Custom Code Integration", description: "Adding custom HTML, CSS, and JavaScript" },
        { title: "API Integration", description: "Connecting external services" },
        { title: "Performance Optimization", description: "Speed and SEO best practices" },
        { title: "Collaboration Features", description: "Working with team members" }
      ]
    },
    {
      category: "Deployment",
      articles: [
        { title: "GitHub Integration", description: "Sync with your repositories" },
        { title: "Netlify Deployment", description: "One-click publishing" },
        { title: "Custom Domain Setup", description: "Configure your own domain" },
        { title: "SSL and Security", description: "Secure your deployments" }
      ]
    }
  ];

  const resources = [
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      color: "from-red-500 to-pink-600",
      link: "#videos"
    },
    {
      title: "Community Forum",
      description: "Get help from the community",
      icon: Users,
      color: "from-blue-500 to-purple-600",
      link: "#community"
    },
    {
      title: "Live Chat Support",
      description: "Talk to our support team",
      icon: MessageCircle,
      color: "from-green-500 to-teal-600",
      link: "#support"
    },
    {
      title: "GitHub Repository",
      description: "Explore our open-source code",
      icon: Github,
      color: "from-gray-500 to-gray-700",
      link: "#github"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-heading font-bold mb-4">
            <span className="text-gradient-primary">Documentation</span> & Help
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need to know about using SiteForge Studio effectively
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-heading font-bold mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.time}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Read more
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-heading font-bold mb-6">Documentation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {documentation.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * sectionIndex }}
              >
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-primary" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.articles.map((article, articleIndex) => (
                      <motion.div
                        key={article.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + sectionIndex * 0.1 + articleIndex * 0.05 }}
                      >
                        <div className="group cursor-pointer p-3 -m-3 rounded-lg hover:bg-muted/20 transition-colors">
                          <h4 className="font-medium group-hover:text-primary transition-colors text-sm">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {article.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-heading font-bold mb-6">Resources & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4`}>
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Access
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-card/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <HelpCircle className="w-6 h-6 mr-2 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">How does AI generation work?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our AI analyzes your prompt and generates professional HTML, CSS, and JavaScript code based on modern best practices.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I edit the generated code?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Yes! You have full access to edit the generated code in our built-in editor or download it for external editing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is there a free plan?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Yes, we offer a free plan with limited projects. Upgrade for unlimited projects and premium features.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How do I deploy my project?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deploy with one click to Netlify, push to GitHub, or download the files for manual deployment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12 border-t border-border"
        >
          <h2 className="text-2xl font-heading font-bold mb-4">
            Need more help?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Our support team is here to help you succeed with SiteForge Studio
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button className="btn-cyber">
              <Users className="w-4 h-4 mr-2" />
              Join Community
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Docs;