import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Download, Github, Globe, Settings, Eye, Trash2, Copy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "live" | "preview";
  lastModified: string;
  thumbnail: string;
  url?: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    prompt: ""
  });

  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "SaaS Landing",
      description: "Modern SaaS landing page with pricing tables",
      status: "live",
      lastModified: "2 hours ago",
      thumbnail: "/placeholder.svg",
      url: "https://example.com"
    },
    {
      id: "2",
      name: "Portfolio Site",
      description: "Creative portfolio with animations",
      status: "draft",
      lastModified: "1 day ago",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "3",
      name: "E-commerce Store",
      description: "Product showcase with shopping cart",
      status: "preview",
      lastModified: "3 days ago",
      thumbnail: "/placeholder.svg"
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: "draft",
      lastModified: "Just now",
      thumbnail: "/placeholder.svg"
    };

    setProjects([project, ...projects]);
    setNewProject({ name: "", description: "", prompt: "" });
    setIsCreateOpen(false);

    toast({
      title: "Project Created!",
      description: `${newProject.name} has been created successfully.`
    });
  };

  const handleAction = (action: string, projectId: string, projectName: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} for ${projectName} - Connect Supabase for full functionality`
    });
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "live": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "preview": return "bg-accent/20 text-accent border-accent/30";
      case "draft": return "bg-muted/20 text-muted-foreground border-muted/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="container mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-gradient-primary mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your SiteForge Studio projects
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-cyber">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Create New Project
                </DialogTitle>
                <DialogDescription>
                  Generate a premium landing page with AI assistance
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., SaaS Landing Page"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of your project"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="prompt">AI Prompt (Optional)</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want to build... e.g., 'Create a modern SaaS landing page with pricing tables, testimonials, and a hero section'"
                    rows={3}
                    value={newProject.prompt}
                    onChange={(e) => setNewProject({...newProject, prompt: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  className="btn-cyber flex-1"
                >
                  Generate Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-heading">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(project.status)} capitalize`}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="py-3">
                  <div className="aspect-video bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last modified: {project.lastModified}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("Preview", project.id, project.name)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("Download", project.id, project.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("GitHub Push", project.id, project.name)}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-heading text-muted-foreground mb-2">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first AI-generated landing page"
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="btn-cyber"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            )}
          </motion.div>
        )}

        {/* Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-card/30 border border-border/50 rounded-lg"
        >
          <div className="flex items-start gap-4">
            <Settings className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-semibold mb-2">Unlock Full Functionality</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Supabase account to enable project persistence, GitHub integration, 
                Netlify deployment, and real-time collaboration features.
              </p>
              <Button variant="outline" size="sm">
                Connect Supabase
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;