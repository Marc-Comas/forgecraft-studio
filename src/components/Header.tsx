import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code, Menu, X, Zap } from "lucide-react";
import LoginModal from "@/components/auth/LoginModal";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Editor", href: "/editor" },
    { label: "Templates", href: "/templates" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-gradient-primary">
              SiteForge Studio
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
                whileHover={{ y: -2 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
              Sign In
            </Button>
            <Button className="btn-cyber" size="sm" onClick={() => navigate('/dashboard')}>
              <Zap className="w-4 h-4 mr-2" />
              Start Building
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-border"
          >
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
                  Sign In
                </Button>
                <Button className="btn-cyber" size="sm" onClick={() => navigate('/dashboard')}>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Building
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
      
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </motion.header>
  );
};

export default Header;