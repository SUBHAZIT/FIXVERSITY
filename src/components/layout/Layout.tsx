import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#1f2937,_#020617)] text-foreground">
      <Navbar />
      <main className="flex-1">
        <div className="relative">
          {/* Decorative background orbs for a unique look */}
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-float" />
            <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float" />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-success/10 blur-3xl animate-pulse-slow" />
          </div>

          {/* Content */}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
