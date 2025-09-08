import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Eye, 
  Download, 
  Star, 
  Users, 
  Palette,
  Sparkles,
  Code2,
  Globe,
  Smartphone,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Utensils
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  downloads: number;
  rating: number;
  tags: string[];
  icon: any;
  color: string;
}

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Tech Startup Landing',
      description: 'Modern landing page perfect for SaaS and tech companies',
      category: 'business',
      preview: '#',
      downloads: 1250,
      rating: 4.9,
      tags: ['SaaS', 'Modern', 'Responsive'],
      icon: Code2,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: '2',
      name: 'E-commerce Store',
      description: 'Complete online store template with product showcase',
      category: 'ecommerce',
      preview: '#',
      downloads: 980,
      rating: 4.7,
      tags: ['Shop', 'Products', 'Cart'],
      icon: ShoppingCart,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: '3',
      name: 'Portfolio Creative',
      description: 'Showcase your work with this stunning portfolio template',
      category: 'portfolio',
      preview: '#',
      downloads: 750,
      rating: 4.8,
      tags: ['Creative', 'Gallery', 'Minimalist'],
      icon: Palette,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: '4',
      name: 'Restaurant & Food',
      description: 'Delicious template for restaurants and food businesses',
      category: 'restaurant',
      preview: '#',
      downloads: 650,
      rating: 4.6,
      tags: ['Food', 'Menu', 'Booking'],
      icon: Utensils,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: '5',
      name: 'Corporate Business',
      description: 'Professional template for corporate and business websites',
      category: 'business',
      preview: '#',
      downloads: 890,
      rating: 4.5,
      tags: ['Corporate', 'Professional', 'Services'],
      icon: Briefcase,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: '6',
      name: 'Photography Studio',
      description: 'Beautiful template to showcase photography work',
      category: 'portfolio',
      preview: '#',
      downloads: 420,
      rating: 4.9,
      tags: ['Photography', 'Gallery', 'Visual'],
      icon: Camera,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: '7',
      name: 'Mobile App Landing',
      description: 'Perfect for promoting mobile applications',
      category: 'app',
      preview: '#',
      downloads: 1100,
      rating: 4.8,
      tags: ['Mobile', 'App', 'Download'],
      icon: Smartphone,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: '8',
      name: 'Educational Platform',
      description: 'Template for online courses and educational content',
      category: 'education',
      preview: '#',
      downloads: 580,
      rating: 4.7,
      tags: ['Education', 'Courses', 'Learning'],
      icon: GraduationCap,
      color: 'from-emerald-500 to-green-600'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'business', label: 'Business', count: templates.filter(t => t.category === 'business').length },
    { id: 'ecommerce', label: 'E-commerce', count: templates.filter(t => t.category === 'ecommerce').length },
    { id: 'portfolio', label: 'Portfolio', count: templates.filter(t => t.category === 'portfolio').length },
    { id: 'restaurant', label: 'Restaurant', count: templates.filter(t => t.category === 'restaurant').length },
    { id: 'app', label: 'App Landing', count: templates.filter(t => t.category === 'app').length },
    { id: 'education', label: 'Education', count: templates.filter(t => t.category === 'education').length },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (template: Template) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${template.name}`,
    });
  };

  const handleUseTemplate = (template: Template) => {
    toast({
      title: "Template Selected",
      description: `Creating new project with ${template.name}`,
    });
  };

  const handleDownload = (template: Template) => {
    toast({
      title: "Download",
      description: `Downloading ${template.name}`,
    });
  };

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
            Premium <span className="text-gradient-primary">Templates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates to jumpstart your project
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border hover:border-primary/20">
                <CardHeader className="pb-3">
                  {/* Template Preview */}
                  <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 relative overflow-hidden`}>
                    <template.icon className="w-12 h-12 text-white/80" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {template.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {template.downloads}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreview(template)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="btn-cyber flex-1"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or browse different categories</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 py-12 border-t border-border"
        >
          <h2 className="text-2xl font-heading font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create a custom template with our AI-powered generator
          </p>
          <Button className="btn-cyber">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Custom Template
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Templates;