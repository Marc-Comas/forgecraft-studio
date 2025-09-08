import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Download, Star, Filter, Sparkles, Zap, Globe, Heart, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  rating: number;
  downloads: number;
  featured: boolean;
  premium: boolean;
}

const Templates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock templates data
  const templates: Template[] = [
    {
      id: "1",
      name: "SaaS Pro",
      description: "Modern SaaS landing page with pricing tiers and feature showcase",
      category: "saas",
      image: "/placeholder.svg",
      tags: ["SaaS", "Modern", "Pricing"],
      rating: 4.9,
      downloads: 1250,
      featured: true,
      premium: true
    },
    {
      id: "2",
      name: "Creative Portfolio",
      description: "Stunning portfolio template for designers and creators",
      category: "portfolio",
      image: "/placeholder.svg",
      tags: ["Portfolio", "Creative", "Animation"],
      rating: 4.8,
      downloads: 890,
      featured: true,
      premium: false
    },
    {
      id: "3",
      name: "E-commerce Store",
      description: "Complete online store with product catalog and checkout",
      category: "ecommerce",
      image: "/placeholder.svg",
      tags: ["E-commerce", "Store", "Products"],
      rating: 4.7,
      downloads: 650,
      featured: false,
      premium: true
    },
    {
      id: "4",
      name: "Corporate Business",
      description: "Professional business website with team and services sections",
      category: "business",
      image: "/placeholder.svg",
      tags: ["Business", "Corporate", "Professional"],
      rating: 4.6,
      downloads: 480,
      featured: false,
      premium: false
    },
    {
      id: "5",
      name: "Restaurant Menu",
      description: "Elegant restaurant website with menu and reservation system",
      category: "restaurant",
      image: "/placeholder.svg",
      tags: ["Restaurant", "Menu", "Booking"],
      rating: 4.8,
      downloads: 320,
      featured: false,
      premium: false
    },
    {
      id: "6",
      name: "Tech Startup",
      description: "High-converting startup landing page with investor pitch",
      category: "startup",
      image: "/placeholder.svg",
      tags: ["Startup", "Tech", "Investment"],
      rating: 4.9,
      downloads: 720,
      featured: true,
      premium: true
    }
  ];

  const categories = [
    { id: "all", label: "All Templates", count: templates.length },
    { id: "saas", label: "SaaS", count: templates.filter(t => t.category === "saas").length },
    { id: "portfolio", label: "Portfolio", count: templates.filter(t => t.category === "portfolio").length },
    { id: "ecommerce", label: "E-commerce", count: templates.filter(t => t.category === "ecommerce").length },
    { id: "business", label: "Business", count: templates.filter(t => t.category === "business").length },
    { id: "restaurant", label: "Restaurant", count: templates.filter(t => t.category === "restaurant").length },
    { id: "startup", label: "Startup", count: templates.filter(t => t.category === "startup").length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = templates.filter(t => t.featured);

  const handleUseTemplate = (template: Template) => {
    toast({
      title: "Using Template",
      description: `Creating new project with ${template.name} template...`
    });
  };

  const handlePreview = (template: Template) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${template.name}`
    });
  };

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
            Premium Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates. 
            Each template is optimized for performance, SEO, and conversion.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Template Sections */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-sm"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Featured Section */}
          {selectedCategory === "all" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-heading font-bold">Featured Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover-lift overflow-hidden">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-primary opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Globe className="w-12 h-12 text-primary opacity-60" />
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {template.featured && (
                            <Badge className="bg-accent text-accent-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {template.premium && (
                            <Badge className="bg-gradient-primary text-primary-foreground">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-heading">{template.name}</CardTitle>
                            <CardDescription className="mt-1">{template.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            {template.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {template.downloads}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(template)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1 btn-cyber"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Templates */}
          <TabsContent value={selectedCategory} className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: selectedCategory === "all" ? 0.3 : 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold">
                  {selectedCategory === "all" ? "All Templates" : 
                   categories.find(c => c.id === selectedCategory)?.label}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover-lift overflow-hidden">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-dark opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Globe className="w-12 h-12 text-muted-foreground opacity-60" />
                        </div>
                        {template.premium && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-primary text-primary-foreground">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="font-heading">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            {template.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {template.downloads}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(template)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1 btn-cyber"
                        >
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-heading text-muted-foreground mb-2">
                    No templates found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or category selection
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Templates;