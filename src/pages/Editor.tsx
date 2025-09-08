import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Eye, Smartphone, Tablet, Monitor, Save, Download, Github, Globe, Layers, Settings, Paintbrush, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Editor = () => {
  const { toast } = useToast();
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeTab, setActiveTab] = useState("design");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const mockSections = [
    { id: "hero", name: "Hero Section", type: "hero", visible: true },
    { id: "features", name: "Features Grid", type: "features", visible: true },
    { id: "testimonials", name: "Testimonials", type: "testimonials", visible: true },
    { id: "pricing", name: "Pricing Table", type: "pricing", visible: false },
    { id: "cta", name: "Call to Action", type: "cta", visible: true },
  ];

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe what you want to modify or add",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "AI Generation Complete",
        description: "Changes applied successfully!"
      });
      setAiPrompt("");
    }, 2000);
  };

  const getDeviceWidth = () => {
    switch (activeDevice) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "100%";
    }
  };

  const handleAction = (action: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} functionality - Connect Supabase for full features`
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="flex h-[calc(100vh-5rem)]">
        
        {/* Left Sidebar - Tools & Properties */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-card/30 border-r border-border/50 flex flex-col"
        >
          <div className="p-6 border-b border-border/50">
            <h2 className="font-heading font-semibold text-lg mb-4">Project Editor</h2>
            
            {/* Device Toggle */}
            <div className="flex gap-1 p-1 bg-muted/30 rounded-lg mb-4">
              <Button
                size="sm"
                variant={activeDevice === "mobile" ? "default" : "ghost"}
                onClick={() => setActiveDevice("mobile")}
                className="flex-1"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={activeDevice === "tablet" ? "default" : "ghost"}
                onClick={() => setActiveDevice("tablet")}
                className="flex-1"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={activeDevice === "desktop" ? "default" : "ghost"}
                onClick={() => setActiveDevice("desktop")}
                className="flex-1"
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAction("Save")}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("Preview")}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
              <TabsTrigger value="design" className="text-xs">
                <Paintbrush className="w-4 h-4 mr-1" />
                Design
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">
                <Layers className="w-4 h-4 mr-1" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="design" className="p-6 mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">AI Assistant</h3>
                    <Textarea
                      placeholder="Describe what you want to change... e.g., 'Make the hero section background darker' or 'Add a pricing table below features'"
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="mb-3"
                    />
                    <Button
                      onClick={handleAiGenerate}
                      disabled={isGenerating}
                      className="w-full btn-cyber"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "Apply Changes"}
                    </Button>
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <h3 className="font-medium mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Paintbrush className="w-4 h-4 mr-2" />
                        Change Color Scheme
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Layers className="w-4 h-4 mr-2" />
                        Add New Section
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Code2 className="w-4 h-4 mr-2" />
                        Custom CSS
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layers" className="p-6 mt-0">
                <div className="space-y-2">
                  <h3 className="font-medium mb-3">Page Sections</h3>
                  {mockSections.map((section) => (
                    <Card key={section.id} className="bg-muted/20">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                            <span className="text-sm font-medium">{section.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {section.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6 mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Export Options</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download ZIP
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Github className="w-4 h-4 mr-2" />
                        Push to GitHub
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Globe className="w-4 h-4 mr-2" />
                        Deploy to Netlify
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <h3 className="font-medium mb-3">Project Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Theme</label>
                        <Select defaultValue="dark">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dark">Dark Theme</SelectItem>
                            <SelectItem value="light">Light Theme</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Main Canvas Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-muted/10 p-6 overflow-auto"
        >
          <div className="h-full flex items-center justify-center">
            <div 
              className="bg-background border border-border/50 rounded-lg shadow-2xl transition-all duration-300"
              style={{ 
                width: getDeviceWidth(),
                minHeight: activeDevice === "desktop" ? "80vh" : "600px",
                maxWidth: activeDevice === "desktop" ? "1200px" : getDeviceWidth()
              }}
            >
              {/* Mock Website Preview */}
              <div className="p-8 space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-primary rounded-lg mx-auto" />
                  <h1 className="text-2xl font-heading font-bold">Your Website Preview</h1>
                  <p className="text-muted-foreground">
                    This is a live preview of your project. Changes will appear here in real-time.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <div className="w-24 h-8 bg-primary/20 rounded animate-pulse" />
                    <div className="w-24 h-8 bg-secondary/20 rounded animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-card/50 rounded-lg">
                      <div className="w-12 h-12 bg-primary/30 rounded mb-3 animate-pulse" />
                      <div className="h-4 bg-muted/50 rounded mb-2 animate-pulse" />
                      <div className="h-3 bg-muted/30 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-4 p-8 bg-gradient-dark rounded-lg">
                  <div className="h-6 bg-primary/20 rounded w-48 mx-auto animate-pulse" />
                  <div className="h-4 bg-muted/20 rounded w-64 mx-auto animate-pulse" />
                  <div className="w-32 h-10 bg-primary/30 rounded mx-auto animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Editor;