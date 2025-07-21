import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo e Slogan */}
          <div className="flex items-center space-x-4">
            <div>
              <Link to="/" className="text-xl lg:text-2xl font-bold text-foreground">
                I.S.T.I | TECNOLOGIA
              </Link>
              <p className="text-sm text-muted-foreground">Sistema para seu comércio</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link to="/produtos" className="text-foreground hover:text-primary transition-colors text-sm xl:text-base">
              Produtos
            </Link>
            <Link to="/solucoes" className="text-foreground hover:text-primary transition-colors text-sm xl:text-base">
              Soluções
            </Link>
            <Link to="/quem-somos" className="text-foreground hover:text-primary transition-colors text-sm xl:text-base">
              Quem Somos
            </Link>
            <div className="hidden xl:flex items-center space-x-2 text-foreground">
              <Phone className="w-4 h-4" />
              <span className="font-semibold text-sm">(61) 3551-6827</span>
            </div>
            <ThemeToggle />
            <Link to="/contato">
              <Button variant="cta" size="sm">
                Fale conosco
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-4">
            <Link 
              to="/produtos" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link 
              to="/solucoes" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Soluções
            </Link>
            <Link 
              to="/quem-somos" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Quem Somos
            </Link>
            <div className="flex items-center space-x-2 text-foreground">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">(61) 3551-6827</span>
            </div>
            <Link to="/contato" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="cta" size="sm" className="w-full">
                Fale conosco
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;