import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Play, ExternalLink, Download } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[80vh] overflow-hidden"
        >
          <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <CardTitle className="text-2xl font-heading">
                UX/I Studio Demo
              </CardTitle>
              <p className="text-muted-foreground">
                See how easy it is to create stunning websites with AI
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Video Placeholder */}
              <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="w-10 h-10 text-primary ml-1" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Interactive Demo</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Watch how UX/I Studio generates professional websites in seconds
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button className="btn-cyber">
                        <Play className="w-4 h-4 mr-2" />
                        Play Demo Video
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Try Live Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">AI Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    Transform text prompts into complete websites
                  </p>
                </div>
                
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Download className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-semibold mb-2">Export & Deploy</h4>
                  <p className="text-sm text-muted-foreground">
                    Download code or deploy to popular platforms
                  </p>
                </div>
                
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <ExternalLink className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Custom Editing</h4>
                  <p className="text-sm text-muted-foreground">
                    Fine-tune with our built-in code editor
                  </p>
                </div>
              </div>

              {/* Demo Stats */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary mb-1">&lt; 30s</div>
                    <div className="text-sm text-muted-foreground">Generation Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">User Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary mb-1">50k+</div>
                    <div className="text-sm text-muted-foreground">Websites Created</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoModal;