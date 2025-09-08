import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  User as UserIcon,
  FolderOpen,
  Sparkles,
  Code2,
  Palette,
  Edit
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";
import type { User, Session } from '@supabase/supabase-js';

interface Project {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  html_content: string | null;
  css_content: string | null;
  js_content: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived' | 'generated';
  preview_url?: string | null;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProjects(session.user.id);
        } else {
          setProjects([]);
        }
        setInitialLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProjects(session.user.id);
      }
      setInitialLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProjects = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []).map(project => ({
        ...project,
        status: project.status as 'draft' | 'published' | 'archived' | 'generated'
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    }
  };

  const handleCreateProject = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newProject.name || !newProject.prompt) {
      toast({
        title: "Error",
        description: "Please fill in project name and prompt",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Generate basic HTML based on prompt
      const generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newProject.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">${newProject.name}</h1>
            <p class="text-xl text-gray-600 mb-8">${newProject.description || 'Generated with AI'}</p>
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
                <p class="text-gray-700">This project was generated based on: "${newProject.prompt}"</p>
                <button class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                </button>
            </div>
        </div>
    </div>
</body>
</html>`;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          description: newProject.description || null,
          prompt: newProject.prompt,
          html_content: generatedHtml,
          css_content: '',
          js_content: '',
          status: 'draft',
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const createdProject = {
        ...data,
        status: data.status as 'draft' | 'published' | 'archived' | 'generated'
      };

      setProjects(prev => [createdProject, ...prev]);
      setNewProject({ name: '', description: '', prompt: '' });
      setShowNewProject(false);
      
      toast({
        title: "Success!",
        description: "Project created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    navigate(`/editor/${project.id}`);
  };

  const handlePreview = (project: Project) => {
    if (!project.html_content) {
      toast({
        title: "No Content",
        description: "This project doesn't have any content to preview yet",
        variant: "destructive"
      });
      return;
    }

    // Create preview in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(project.html_content);
      previewWindow.document.close();
    }
  };

  const handleDownload = (project: Project) => {
    if (!project.html_content) {
      toast({
        title: "No Content",
        description: "This project doesn't have any content to download yet",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([project.html_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${project.name} has been downloaded`,
    });
  };

  const handleDelete = async (project: Project) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== project.id));
      
      toast({
        title: "Deleted",
        description: `${project.name} has been deleted`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sign in to continue</h3>
            <p className="text-muted-foreground mb-6">You need to be signed in to view your projects</p>
            <Button 
              className="btn-cyber"
              onClick={() => setShowAuthModal(true)}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <UserIcon className="w-4 h-4 mr-2" />
              Sign Out
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
                      className="btn-cyber"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
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
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(project)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
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

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
};

export default Dashboard;