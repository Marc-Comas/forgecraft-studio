import { useState } from "react";
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
  Monitor
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Editor = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'ai'>('code');
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome to Editor
            </h1>
            <p class="text-xl text-gray-300 mb-8">
                Start editing your project here
            </p>
            <button class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Started
            </button>
        </div>
    </div>
</body>
</html>`);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    toast({
      title: "Saved!",
      description: "Your changes have been saved successfully.",
    });
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
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Your project has been downloaded as HTML file.",
    });
  };

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
                <div className="flex items-center space-x-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-heading font-bold">Code Editor</h1>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <FileCode className="w-3 h-3 mr-1" />
                  index.html
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
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