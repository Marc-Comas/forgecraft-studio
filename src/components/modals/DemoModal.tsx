import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, Code2, Sparkles, Zap, Palette } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const demoFeatures = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Watch as SiteForge Studio generates a complete landing page from a simple text prompt",
      duration: "2:34"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Real-time Editing",
      description: "See how the DOM-Patcher system makes precise edits without breaking your website",
      duration: "1:47"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design Customization",
      description: "Explore the powerful theming system and responsive design tools",
      duration: "3:12"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "One-Click Deployment",
      description: "Learn how to export and deploy your website to production platforms",
      duration: "1:56"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-heading text-gradient-primary flex items-center justify-center gap-2">
              <Play className="w-6 h-6" />
              SiteForge Studio Demo
            </DialogTitle>
            <DialogDescription className="text-lg">
              See the future of website creation in action
            </DialogDescription>
          </DialogHeader>

          {/* Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative aspect-video bg-gradient-dark rounded-lg mb-6 overflow-hidden border border-border/50"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    Interactive Product Demo
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    7 minutes of SiteForge Studio in action
                  </p>
                </div>
                <Button className="btn-cyber">
                  <Play className="w-4 h-4 mr-2" />
                  Play Demo Video
                </Button>
              </div>
            </div>
            
            {/* Quality badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-primary text-primary-foreground">
                4K Quality
              </Badge>
            </div>
          </motion.div>

          {/* Demo Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 bg-card/30 border border-border/50 rounded-lg hover-lift cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {feature.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 btn-cyber"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Building Now
            </Button>
            <Button
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Schedule Personal Demo
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-muted/20 rounded-lg text-center"
          >
            <p className="text-sm text-muted-foreground">
              🎯 <strong>Pro Tip:</strong> The demo shows real functionality. 
              Connect Supabase to unlock the full power of SiteForge Studio 
              including data persistence, authentication, and deployment features.
            </p>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;