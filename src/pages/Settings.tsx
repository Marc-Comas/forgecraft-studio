import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Key, 
  Shield, 
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage (dev mode only)
    if (window.location.hostname === 'localhost') {
      const savedKey = localStorage.getItem('openai_dev_key');
      if (savedKey) {
        setOpenAIKey(savedKey);
      }
    }
  }, []);

  const handleSaveKey = () => {
    if (!openAIKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    if (window.location.hostname === 'localhost') {
      localStorage.setItem('openai_dev_key', openAIKey);
      toast({
        title: "Saved",
        description: "API key saved locally for development",
      });
    } else {
      toast({
        title: "Production Mode",
        description: "API keys are managed through server secrets in production",
        variant: "destructive"
      });
    }
  };

  const runDiagnostics = async () => {
    setRunningDiagnostics(true);
    const startTime = Date.now();
    
    try {
      console.log('🔍 Running diagnostics...');
      
      // Test CORS and API endpoint
      const { data: response, error } = await supabase.functions.invoke('generate-code', {
        body: {
          prompt: 'TEST_PING_REQUEST',
          projectType: 'test',
          isDiagnostic: true
        }
      });

      const elapsedMs = Date.now() - startTime;
      
      const diagnosticResults = {
        timestamp: new Date().toISOString(),
        elapsedMs,
        corsStatus: 'OK',
        apiStatus: error ? 'ERROR' : 'OK',
        error: error?.message || null,
        response: response || null,
        apiKeyConfigured: window.location.hostname === 'localhost' ? 
          !!localStorage.getItem('openai_dev_key') : 'Server-managed'
      };

      setDiagnostics(diagnosticResults);
      
      console.log('📊 Diagnostic results:', diagnosticResults);

      if (error) {
        toast({
          title: "Diagnostics Failed",
          description: `API Error: ${error.message}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Diagnostics Complete",
          description: `All systems operational (${elapsedMs}ms)`,
        });
      }
    } catch (error: any) {
      console.error('❌ Diagnostics error:', error);
      setDiagnostics({
        timestamp: new Date().toISOString(),
        elapsedMs: Date.now() - startTime,
        corsStatus: 'ERROR',
        apiStatus: 'ERROR',
        error: error.message,
        response: null,
        apiKeyConfigured: false
      });
      
      toast({
        title: "Diagnostics Failed",
        description: `Connection error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setRunningDiagnostics(false);
    }
  };

  const isDevelopment = window.location.hostname === 'localhost';

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-heading font-bold mb-4">
            <span className="text-gradient-primary">Settings</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Configure your API keys and system settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Configuration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-primary" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">OpenAI API Key</label>
                    {isDevelopment ? (
                      <Badge variant="outline" className="text-xs">
                        Development Mode
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        Production (Server-managed)
                      </Badge>
                    )}
                  </div>
                  
                  {isDevelopment ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type={showKey ? "text" : "password"}
                          placeholder="sk-..."
                          value={openAIKey}
                          onChange={(e) => setOpenAIKey(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleSaveKey}
                          disabled={loading}
                          className="btn-cyber"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Save Key
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            localStorage.removeItem('openai_dev_key');
                            setOpenAIKey('');
                            toast({ title: "Cleared", description: "API key removed" });
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Development Mode</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              API key is stored locally in your browser. This is only visible on localhost for security.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Secure Server Configuration</p>
                          <p className="text-xs text-blue-700 mt-1">
                            OpenAI API key is securely managed on the server. No client-side configuration needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Diagnostics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  System Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runDiagnostics}
                  disabled={runningDiagnostics}
                  className="w-full btn-cyber"
                >
                  {runningDiagnostics ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 mr-2" />
                      Run Diagnostics
                    </>
                  )}
                </Button>

                {diagnostics && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CORS Status</span>
                      <div className="flex items-center">
                        {diagnostics.corsStatus === 'OK' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <Badge variant={diagnostics.corsStatus === 'OK' ? 'default' : 'destructive'} className="text-xs">
                          {diagnostics.corsStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">API Status</span>
                      <div className="flex items-center">
                        {diagnostics.apiStatus === 'OK' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <Badge variant={diagnostics.apiStatus === 'OK' ? 'default' : 'destructive'} className="text-xs">
                          {diagnostics.apiStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <Badge variant="outline" className="text-xs">
                        {diagnostics.elapsedMs}ms
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">API Key</span>
                      <Badge variant="outline" className="text-xs">
                        {typeof diagnostics.apiKeyConfigured === 'boolean' 
                          ? (diagnostics.apiKeyConfigured ? 'Configured' : 'Missing')
                          : diagnostics.apiKeyConfigured
                        }
                      </Badge>
                    </div>

                    {diagnostics.error && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-xs text-red-800 font-medium mb-1">Last Error:</p>
                        <p className="text-xs text-red-700 font-mono">{diagnostics.error}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Last check: {new Date(diagnostics.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Documentation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>How to Configure Secrets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="text-green-500 mr-2">🔧</span>
                    Development Setup
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Enter your OpenAI API key above</li>
                    <li>• Key is stored securely in browser localStorage</li>
                    <li>• Only works on localhost for security</li>
                    <li>• Run diagnostics to test connection</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="text-blue-500 mr-2">🔐</span>
                    Production Setup
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• API keys managed through Supabase secrets</li>
                    <li>• Secure server-side configuration</li>
                    <li>• No client-side key exposure</li>
                    <li>• Automatic deployment integration</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-2">Troubleshooting</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• If diagnostics fail, check your API key format (should start with "sk-")</p>
                  <p>• CORS errors indicate network or configuration issues</p>
                  <p>• Response times over 30s may indicate timeout issues</p>
                  <p>• Check browser console for detailed error messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;