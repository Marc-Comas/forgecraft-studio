import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Eye, 
  Download, 
  Github, 
  Globe, 
  Settings, 
  User,
  FolderOpen,
  Sparkles,
  Code2,
  Palette
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  created_at: string;
  status: 'draft' | 'generated' | 'published';
  preview_url?: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadProjects();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadProjects = async () => {
    // Mock data for now - in real app this would fetch from Supabase
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Tech Startup Landing',
        description: 'Modern landing page for a SaaS product',
        prompt: 'Create a modern tech startup landing page with hero section, features, and pricing',
        created_at: new Date().toISOString(),
        status: 'published',
        preview_url: '#'
      },
      {
        id: '2',
        name: 'E-commerce Store',
        description: 'Product showcase website',
        prompt: 'Build an e-commerce landing page with product grid and shopping features',
        created_at: new Date().toISOString(),
        status: 'draft'
      }
    ];
    setProjects(mockProjects);
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.prompt) {
      toast({
        title: "Error",
        description: "Please fill in project name and prompt",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const project: Project = {
        id: Date.now().toString(),
        ...newProject,
        created_at: new Date().toISOString(),
        status: 'generated'
      };
      
      setProjects(prev => [project, ...prev]);
      setNewProject({ name: '', description: '', prompt: '' });
      setShowNewProject(false);
      setLoading(false);
      
      toast({
        title: "Success!",
        description: "Project generated successfully",
      });
    }, 2000);
  };

  const handlePreview = (project: Project) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${project.name}`,
    });
  };

  const handleDownload = (project: Project) => {
    toast({
      title: "Download",
      description: `Downloading ${project.name} as ZIP`,
    });
  };

  const handleGithubPush = (project: Project) => {
    toast({
      title: "GitHub",
      description: `Pushing ${project.name} to GitHub`,
    });
  };

  const handleDeploy = (project: Project) => {
    toast({
      title: "Deploy",
      description: `Deploying ${project.name} to Netlify`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your AI-generated projects</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button 
              className="btn-cyber"
              onClick={() => setShowNewProject(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-gradient-primary">{projects.length}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Published</p>
                  <p className="text-2xl font-bold text-secondary">{projects.filter(p => p.status === 'published').length}</p>
                </div>
                <Globe className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-accent/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Generated</p>
                  <p className="text-2xl font-bold text-accent">{projects.filter(p => p.status === 'generated').length}</p>
                </div>
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Drafts</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'draft').length}</p>
                </div>
                <Code2 className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Project Modal */}
        {showNewProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Create New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Name</label>
                  <Input
                    placeholder="Enter project name..."
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                  <Input
                    placeholder="Brief description of your project..."
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">AI Prompt</label>
                  <Textarea
                    placeholder="Describe the website you want to create..."
                    className="min-h-[120px]"
                    value={newProject.prompt}
                    onChange={(e) => setNewProject(prev => ({ ...prev, prompt: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewProject(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="btn-cyber" 
                    onClick={handleCreateProject}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Project"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.description || "No description"}
                      </p>
                      <Badge 
                        variant={project.status === 'published' ? 'default' : project.status === 'generated' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreview(project)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(project)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      ZIP
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGithubPush(project)}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Push
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeploy(project)}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Deploy
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && !showNewProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first AI-generated project to get started</p>
            <Button 
              className="btn-cyber"
              onClick={() => setShowNewProject(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;