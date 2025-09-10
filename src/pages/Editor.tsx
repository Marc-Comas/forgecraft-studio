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

    setIsAiProcessing(true);
    setGenerationPhase('Iniciando generación dual...');

    try {
      console.log('🎯 Starting AI enhancement with prompt:', aiPrompt);

      toast({
        title: "Generación Dual Iniciada",
        description: "Fase 1: Generando estructura HTML + CSS (10K tokens)",
      });

      // Simulate phase updates for better UX
      const phaseUpdateInterval = setInterval(() => {
        setGenerationPhase(prev => {
          if (prev.includes('estructura')) return 'Fase 2: Añadiendo interactividad JavaScript (5K tokens)...';
          if (prev.includes('interactividad')) return 'Finalizando y optimizando código...';
          return 'Generando estructura HTML + CSS...';
        });
      }, 8000);

      // Call the AI generation function with dual-phase enabled
      const isEdit = !!code.trim();
const payload = isEdit
  ? { prompt: buildPatchPrompt(aiPrompt || "Refine header styles and layout only."), code: (code || "").slice(0, 6000), mode: "patch", dualPhase: false }
  : { prompt: aiPrompt, mode: "doc" };
const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-code', { body: payload });

      clearInterval(phaseUpdateInterval);
      setGenerationPhase('');

      console.log('📥 AI Response received:', { aiResponse, aiError });

      if (aiError) {
        console.error('AI enhancement error:', aiError);
        throw new Error('Failed to generate code with AI');
      }

      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }

      // Update the code with AI-generated content
      if (aiResponse?.patches && Array.isArray(aiResponse.patches)) {
        const merged = applyPatches(code, aiResponse.patches as PatchOp[]);
        setCode(merged);
      } else if (typeof aiResponse?.content === "string" && aiResponse.content.includes("<!--PARTIAL_HTML_START-->")) {
        const fragment = aiResponse.content.split("<!--PARTIAL_HTML_START-->")[1]?.split("<!--PARTIAL_HTML_END-->")[0] || "";
        const merged = replaceMainOrSection(code, fragment);
        setCode(merged);
      } else if (aiResponse?.html_content || aiResponse?.content) {
        const generatedContent = (aiResponse.html_content || aiResponse.content) as string;
        setCode(ensureDataUids(generatedContent));
      } else {
        console.warn("AI returned no applicable changes:", aiResponse);
      }
      setAiPrompt('');

      // Show success message based on generation mode
      const successTitle = aiResponse.mode === 'dual_phase_complete' ?
        'Generación Dual Completada' :
        aiResponse.mode === 'dual_phase_fallback' ?
        'Generación Parcial Completada' :
        'AI Enhancement Complete';

      const successDescription = aiResponse.messages ?
        aiResponse.messages.join(' • ') :
        'Your code has been updated with AI-generated improvements!';

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
                        {code.trim() ? 'Apply AI Changes' : 'Generate with Dual AI (15K tokens)'}
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
// --- PatchOps helpers (injected) ---
type PatchOp =
  | { type: "replace_inner_html"; selector: string; html: string }
  | { type: "replace_outer_html"; selector: string; html: string }
  | { type: "append_child"; selector: string; html: string }
  | { type: "prepend_child"; selector: string; html: string }
  | { type: "insert_before"; selector: string; html: string }
  | { type: "insert_after"; selector: string; html: string }
  | { type: "set_attribute"; selector: string; name: string; value: string }
  | { type: "remove"; selector: string }
  | { type: "replace_text"; selector: string; text: string };

function buildPatchPrompt(instruction: string) {
  return [
    "Apply minimal, targeted DOM edits to the existing HTML.",
    "Return ONLY JSON as {\"patches\":[...]}. No markdown, no code fences, no explanations.",
    "Use stable selectors. Prefer existing [data-uid] markers if present; otherwise #ids/roles.",
    "Allowed ops: replace_inner_html | replace_outer_html | append_child | prepend_child | insert_before | insert_after | set_attribute | remove | replace_text.",
    `REQUESTED CHANGE: ${instruction}`,
  ].join("\\n");
}

function ensureDataUids(html: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || "<!doctype html><html><body><main></main></body></html>", "text/html");
    const sections = Array.from(doc.querySelectorAll("header, main, section, footer"));
    let changed = false;
    for (const el of sections) {
      if (!el.getAttribute("data-uid")) {
        el.setAttribute("data-uid", `sec-${Math.random().toString(36).slice(2, 8)}`);
        changed = true;
      }
    }
    return changed ? "<!doctype html>" + doc.documentElement.outerHTML : html;
  } catch {
    return html;
  }
}

function applyPatches(html: string, ops: PatchOp[]) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const apply = (op: PatchOp) => {
      const nodes = Array.from(doc.querySelectorAll((op as any).selector || ""));
      if (!nodes.length) return;
      switch (op.type) {
        case "replace_inner_html":
          nodes.forEach(n => (n.innerHTML = (op as any).html || ""));
          break;
        case "replace_outer_html":
          nodes.forEach(n => {
            const tmp = doc.createElement("div");
            tmp.innerHTML = (op as any).html || "";
            const newNode = tmp.firstElementChild;
            if (newNode && n.parentNode) n.parentNode.replaceChild(newNode, n);
          });
          break;
        case "append_child":
          nodes.forEach(n => n.insertAdjacentHTML("beforeend", (op as any).html || ""));
          break;
        case "prepend_child":
          nodes.forEach(n => n.insertAdjacentHTML("afterbegin", (op as any).html || ""));
          break;
        case "insert_before":
          nodes.forEach(n => n.insertAdjacentHTML("beforebegin", (op as any).html || ""));
          break;
        case "insert_after":
          nodes.forEach(n => n.insertAdjacentHTML("afterend", (op as any).html || ""));
          break;
        case "set_attribute":
          nodes.forEach(n => n.setAttribute((op as any).name, (op as any).value));
          break;
        case "remove":
          nodes.forEach(n => n.remove());
          break;
        case "replace_text":
          nodes.forEach(n => (n.textContent = (op as any).text || ""));
          break;
      }
    };
    ops.forEach(apply);
    normalizeStyles(doc);
    return "<!doctype html>" + doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}

function replaceMainOrSection(fullHtml: string, fragment: string) {
  try {
    const uidMatch = fragment.match(/data-uid="([^"]+)"/);
    if (uidMatch) {
      const uid = uidMatch[1];
      return fullHtml.replace(new RegExp(`(<[^>]+data-uid="${uid}"[^>]*>)([\\s\\S]*?)(</[^>]+>)`, "i"), `$1${fragment}$3`);
    }
    // fallback: replace main content
    return fullHtml.replace(/(<main[\\s\\S]*?>)([\\s\\S]*?)(<\\/main>)/i, `$1${fragment}$3`);
  } catch {
    return fullHtml;
  }
}

// Ensure key sections have baseline classes if missing (prevents "unstyled header" issue)
function normalizeStyles(doc: Document) {
  // Header baseline
  const headers = Array.from(doc.querySelectorAll("header"));
  headers.forEach(h => {
    const cls = h.getAttribute("class") || "";
    if (!cls || cls.trim().length < 4) {
      h.setAttribute("class", "sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10");
    }
  });
  // Nav links baseline
  const navs = Array.from(doc.querySelectorAll("nav"));
  navs.forEach(n => {
    const links = Array.from(n.querySelectorAll("a"));
    links.forEach(a => {
      const c = a.getAttribute("class") || "";
      if (!/px-/.test(c)) {
        a.setAttribute("class", (c ? c + " " : "") + "px-3 py-2 rounded hover:bg-white/10 transition");
      }
    });
  });
}

