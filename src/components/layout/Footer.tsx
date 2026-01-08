import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8 text-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-lg shadow-glow">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-gradient">Fixversity</span>
          </div>

          <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
          
          <p className="text-xs md:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fixversity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
