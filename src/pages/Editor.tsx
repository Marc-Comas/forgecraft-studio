import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code2, 
  Eye, 
  Save, 
  Download, 
  Undo, 
  Redo, 
  Settings,
  Play,
  Palette,
  Sparkles,
  FileCode,
  Monitor,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

interface Project {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  html_content: string | null;
  css_content: string | null;
  js_content: string | null;
  status: 'draft' | 'published' | 'archived' | 'generated';
  user_id: string;
}

const Editor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'ai'>('code');
  const [project, setProject] = useState<Project | null>(null);
  const [code, setCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkUserAndLoadProject = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        navigate('/dashboard');
        return;
      }

      // Load project
      if (projectId) {
        await loadProject(projectId, user.id);
      }
      
      setInitialLoading(false);
    };

    checkUserAndLoadProject();
  }, [projectId, navigate]);

  const loadProject = async (id: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setProject({
        ...data,
        status: data.status as 'draft' | 'published' | 'archived' | 'generated'
      });
      setCode(data.html_content || '');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  };

  const handleSave = async () => {
    if (!project || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ html_content: code })
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setActiveTab('preview');
  };

  const handleAiEdit = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an AI prompt",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "AI Edit Applied",
        description: "Your code has been updated based on the AI prompt",
      });
      setAiPrompt('');
    }, 2000);
  };

  const handleDownload = () => {
    if (!project) return;
    
    const blob = new Blob([code], { type: 'text/html' });
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
      description: `${project.name} has been downloaded.`,
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Project not found</h3>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border bg-card/30 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center space-x-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-heading font-bold">{project.name}</h1>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <FileCode className="w-3 h-3 mr-1" />
                  index.html
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mt-4">
              <Button
                variant={activeTab === 'code' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('code')}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Code
              </Button>
              <Button
                variant={activeTab === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('preview')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('ai')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          {activeTab === 'code' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 p-6"
            >
              <div className="h-full">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full font-mono text-sm resize-none bg-muted/20 border-border"
                  placeholder="Enter your HTML code here..."
                />
              </div>
            </motion.div>
          )}

          {/* Preview */}
          {activeTab === 'preview' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 p-6"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <iframe
                    srcDoc={code}
                    className="w-full h-full border-0 rounded-b-lg"
                    title="Preview"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Assistant */}
          {activeTab === 'ai' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 p-6"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    AI Code Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe the changes you want to make:
                    </label>
                    <Textarea
                      placeholder="e.g., 'Add a navigation bar with logo and menu items', 'Change the color scheme to dark theme', 'Add a contact form'..."
                      className="min-h-[120px]"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    className="btn-cyber w-full"
                    onClick={handleAiEdit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Apply AI Changes
                      </>
                    )}
                  </Button>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Palette className="w-4 h-4 mr-2" />
                        Change Colors
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Add Components
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Monitor className="w-4 h-4 mr-2" />
                        Make Responsive
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Play className="w-4 h-4 mr-2" />
                        Add Animations
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;