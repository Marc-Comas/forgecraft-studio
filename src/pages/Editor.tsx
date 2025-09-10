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
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [generationPhase, setGenerationPhase] = useState<string>('');
  const [codeHistory, setCodeHistory] = useState<string[]>([]);
  const [canRevert, setCanRevert] = useState(false);

// ⚠️ Fragmento esencial: añade esta utilidad en tu Editor (tras los imports)
function injectForgeCSSandJS(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(
      html || "<!doctype html><html><head></head><body><main></main></body></html>",
      "text/html"
    );
    const head = doc.head || doc.getElementsByTagName("head")[0];
    const body = doc.body || doc.getElementsByTagName("body")[0];

    // 1) CSS base — idempotente, se inserta una sola vez
    if (!doc.getElementById("forgecss")) {
      const style = doc.createElement("style");
      style.id = "forgecss";
      style.innerHTML = `
:root {
  --bg:#0b0f1c; --card:#12172a; --muted:#a7b0d7; --text:#f3f6ff; --brand:#b8ff00; --accent:#00d4ff; --radius:16px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial;line-height:1.6}
img{max-width:100%;height:auto;display:block}
a{color:var(--accent);text-decoration:none}
.container{max-width:1200px;margin:0 auto;padding:1rem}
.grid{display:grid;gap:1rem}
.btn{display:inline-flex;align-items:center;justify-content:center;font-weight:700;padding:.75rem 1rem;border-radius:12px;background:var(--brand);color:#101210;border:1px solid #00000022;transition:filter .2s ease,transform .1s ease}
.btn:hover{filter:brightness(.95)}
.btn:active{transform:translateY(1px)}
.card{background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);border-radius:var(--radius);backdrop-filter:blur(6px);padding:1rem}
.h1{font-size:clamp(2rem,6vw,3rem);font-weight:800;margin:.25rem 0 .5rem}
.h2{font-size:clamp(1.5rem,4vw,2rem);font-weight:700;margin:.25rem 0 .5rem}
.muted{color:var(--muted)}
.section{padding:clamp(2rem,6vw,4rem) 1rem}
.hero{display:grid;gap:1.5rem;align-items:center}
@media(min-width:960px){.hero{grid-template-columns:1.15fr .85fr}}
.reveal{opacity:0;transform:translateY(12px);transition:opacity .6s ease, transform .6s ease}
.reveal.revealed{opacity:1;transform:none}
.parallax{will-change:transform;transform:translate3d(0,0,0)}
.carousel{position:relative;overflow:hidden}
.carousel-track{display:flex;transition:transform .5s ease}
.carousel-nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}
.carousel-nav button{pointer-events:auto}
figure{margin:0}
      `;
      head.appendChild(style);
    }

    // 2) Runtime para animaciones/parallax — idempotente
    if (!doc.getElementById("forgejs")) {
      const script = doc.createElement("script");
      script.id = "forgejs";
      script.type = "text/javascript";
      script.innerHTML = `
(function(){
  try {
    var prm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Reveal on scroll
    if (!prm) {
      var els = Array.prototype.slice.call(document.querySelectorAll('[data-anim]'));
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('revealed'); } });
      }, {threshold: 0.15});
      els.forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
    }
    // Parallax
    var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (pEls.length) {
      var lastY = window.scrollY;
      function loop(){
        var y = window.scrollY;
        if (y !== lastY) {
          pEls.forEach(function(el){
            var sp = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            var rect = el.getBoundingClientRect();
            var offset = (rect.top + window.scrollY) * sp * -0.2;
            el.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
          });
          lastY = y;
        }
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }
  } catch(e){ console.warn('forge runtime error', e); }
})();`;
      body.appendChild(script);
    }

    // 3) Placeholders: imágenes sin src → Picsum; vídeos sin <source> → mp4 de muestra
    const imgs = Array.from(doc.querySelectorAll("img")).filter(el => !el.getAttribute("src"));
    imgs.forEach((img, i) => {
      const q = (img.getAttribute("alt") || "ui").split(/\s+/).slice(0,2).join(",");
      img.setAttribute("src", `https://picsum.photos/seed/${encodeURIComponent(q+String(i))}/1200/800`);
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });
    const videos = Array.from(doc.querySelectorAll("video")).filter(el => !el.querySelector("source"));
    videos.forEach((v) => {
      const src = doc.createElement("source");
      src.src = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      src.type = "video/mp4";
      v.setAttribute("controls","");
      v.setAttribute("preload","metadata");
      v.appendChild(src);
    });

    return "<!doctype html>" + doc.documentElement.outerHTML;
  } catch { return html; }
}

  
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
      setCodeHistory([data.html_content || '']);
      setCanRevert(false);
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

  const saveCodeToDatabase = async (codeToSave: string, showToast = true) => {
    if (!project || !user) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ html_content: codeToSave })
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (showToast) {
        toast({
          title: "Auto-saved!",
          description: "AI changes have been saved automatically.",
        });
      }
      return true;
    } catch (error: any) {
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to auto-save AI changes",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const addToHistory = (newCode: string) => {
    setCodeHistory(prev => {
      const newHistory = [...prev, newCode];
      // Keep only last 10 versions to avoid memory issues  
      return newHistory.slice(-10);
    });
    setCanRevert(true);
  };

  const revertLastChange = async () => {
    if (codeHistory.length < 2) return;
    
    const previousCode = codeHistory[codeHistory.length - 2];
    setCode(previousCode);
    setCodeHistory(prev => prev.slice(0, -1));
    setCanRevert(codeHistory.length > 2);
    
    // Auto-save the reverted code
    await saveCodeToDatabase(previousCode, false);
    
    toast({
      title: "Reverted!",
      description: "Last AI change has been reverted successfully.",
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

    setIsAiProcessing(true);
    const isExistingCode = code.trim().length > 0;
    
    if (isExistingCode) {
      setGenerationPhase('Making targeted changes to existing code...');
    } else {
      setGenerationPhase('Iniciando generación dual...');
    }
    
    try {
      console.log('🎯 Starting AI with prompt:', aiPrompt);
      
      if (!isExistingCode) {
        toast({
          title: "Generación Dual Iniciada",
          description: "Fase 1: Generando estructura HTML + CSS (10K tokens)",
        });
      }

      // Build minimal, token-aware prompt
      let enhancedPrompt;
      let projectType;
      let intent;
      
      if (isExistingCode) {
        // For existing code: focus on surgical changes
        enhancedPrompt = `CRITICAL: Make ONLY the specific changes requested. DO NOT rewrite the entire page.

CHANGE REQUEST: ${aiPrompt}

CURRENT CODE: ${code}

STRICT RULES:
- Make MINIMAL surgical changes only
- Keep ALL existing structure, styles, and content unchanged except what's specifically requested
- If changing text: only change the specific text mentioned
- If changing styles: only modify the specific CSS/classes mentioned  
- If adding elements: insert them in the appropriate location without affecting other elements
- Return the COMPLETE modified HTML document with minimal changes
- NO markdown, NO explanations, NO external links`;
        
        projectType = 'targeted_modification';
        intent = 'surgical_edit';
      } else {
        // For new projects: use dual-phase with clear instructions
        enhancedPrompt = `STRICT CONTRACT: Generate landing page using dual-phase. Return ONLY html_content field.

PROJECT REQUEST: ${aiPrompt}

PHASE 1: HTML structure + CSS styling (10K tokens max)
PHASE 2: JavaScript interactivity (5K tokens max)

RULES:
- NO markdown, NO code fences, NO explanations
- Return complete valid HTML document
- Include all CSS in <style> tags, all JS in <script> tags`;
        
        projectType = 'landing page';
        intent = 'code';
      }

      // Simulate phase updates for UX
      const phaseUpdateInterval = !isExistingCode ? setInterval(() => {
        setGenerationPhase(prev => {
          if (prev.includes('estructura')) return 'Fase 2: Añadiendo interactividad JavaScript (5K tokens)...';
          if (prev.includes('interactividad')) return 'Finalizando y optimizando código...';
          return 'Generando estructura HTML + CSS...';
        });
      }, 8000) : null;

      // Call the AI generation function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-code', {
        body: {
          prompt: enhancedPrompt,
          projectType,
          intent,
          code: isExistingCode ? code.substring(0, 1000) : undefined,
          dualPhase: !isExistingCode // Only use dual-phase for new projects
        }
      });

      if (phaseUpdateInterval) clearInterval(phaseUpdateInterval);
      setGenerationPhase('');

      console.log('📥 AI Response received:', { aiResponse, aiError });

      if (aiError) {
        console.error('AI enhancement error:', aiError);
        throw new Error('Failed to generate code with AI');
      }

      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }

      // Handle both html_content and legacy content fields
      let generatedContent = aiResponse.html_content || aiResponse.content;
      
      if (!generatedContent) {
        throw new Error('No content received from AI');
      }

      // Handle partial HTML replacement for existing code
      if (isExistingCode && generatedContent.includes('<!--PARTIAL_HTML_START-->')) {
        const partialMatch = generatedContent.match(/<!--PARTIAL_HTML_START-->([\s\S]*?)<!--PARTIAL_HTML_END-->/);
        if (partialMatch) {
          const partialContent = partialMatch[1].trim();
          // Simple replacement strategy: replace <main> content or insert before </body>
          if (code.includes('<main>')) {
            generatedContent = code.replace(/<main[\s\S]*?<\/main>/i, `<main>${partialContent}</main>`);
          } else if (code.includes('</body>')) {
            generatedContent = code.replace('</body>', `${partialContent}\n</body>`);
          } else {
            generatedContent = partialContent; // Fallback to partial content
          }
        }
      }

      // Save current code to history before making changes
      addToHistory(code);

      setCode(generatedContent);
      setAiPrompt('');
      
      // Auto-save the AI-generated code
      await saveCodeToDatabase(generatedContent);
      
      // Show success message based on generation mode
      const successTitle = isExistingCode ? 
        'Code Updated' : 
        aiResponse.mode === 'dual_phase_complete' ? 
        'Generación Dual Completada' : 
        aiResponse.mode === 'dual_phase_fallback' ? 
        'Generación Parcial Completada' :
        'AI Generation Complete';
      
      const successDescription = aiResponse.messages ? 
        aiResponse.messages.join(' • ') :
        isExistingCode ? 
        'Your code has been updated with the requested changes!' :
        'Your landing page has been generated successfully!';
      
      toast({
        title: successTitle,
        description: successDescription,
      });
    } catch (error: any) {
      setGenerationPhase('');
      console.error('Error with AI generation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate code with AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAiProcessing(false);
    }
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
                  onClick={revertLastChange}
                  disabled={!canRevert}
                  title="Revert last AI change"
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Revert
                </Button>
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
                  <p className="text-sm text-muted-foreground">
                    Changes are automatically saved. Use "Revert" button to undo last AI change.
                  </p>
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
                  
                  {generationPhase && (
                    <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
                        <span className="text-primary font-medium">{generationPhase}</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="btn-cyber w-full"
                    onClick={handleAiEdit}
                    disabled={isAiProcessing}
                  >
                    {isAiProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full" />
                        {generationPhase || 'Processing...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {code.trim() ? 'Apply Changes (Single-Phase)' : 'Generate New (Dual-Phase AI)'}
                      </>
                    )}
                  </Button>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => setAiPrompt('Change the color scheme to use modern gradients')}
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Change Colors
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => setAiPrompt('Add a contact form section with validation')}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Add Components
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => setAiPrompt('Optimize for mobile devices and improve responsive design')}
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        Make Responsive
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => setAiPrompt('Add smooth scroll animations and hover effects')}
                      >
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
