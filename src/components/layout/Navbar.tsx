import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Plus, 
  Settings, 
  Shield,
  Wrench,
  BookOpen,
  X 
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { user, profile, role, isAdmin, isWorker, isStudent, isFaculty, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => location.pathname === path;

  const getRoleBadge = () => {
    if (isAdmin) return <Badge variant="destructive" className="text-xs">Admin</Badge>;
    if (isWorker) return <Badge variant="secondary" className="text-xs">Worker</Badge>;
    if (isFaculty) return <Badge className="text-xs bg-primary/80">Faculty</Badge>;
    if (isStudent) return <Badge variant="outline" className="text-xs">Student</Badge>;
    return null;
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="gradient-primary p-2.5 rounded-xl shadow-glow transition-transform group-hover:scale-110">
              <Building2 className="h-6 w-6 text-primary-foreground drop-shadow-md" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-gradient">
              Fixversity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                {/* Student Navigation */}
                {(isStudent || isFaculty) && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                        isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {isFaculty ? <BookOpen className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                      Dashboard
                    </Link>
                    <Link
                      to="/issues/new"
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                        isActive('/issues/new') ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      Report Issue
                    </Link>
                  </>
                )}

                {/* Worker Navigation */}
                {isWorker && (
                  <Link
                    to="/worker"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/worker') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Wrench className="h-4 w-4" />
                    My Tasks
                  </Link>
                )}

                {/* Admin Navigation */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground font-heading">
                        {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{profile?.full_name}</span>
                        {getRoleBadge()}
                      </div>
                      <span className="text-xs text-muted-foreground">{profile?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {(isStudent || isFaculty) && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          {isFaculty ? <BookOpen className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/issues/new" className="cursor-pointer">
                          <Plus className="mr-2 h-4 w-4" />
                          Report Issue
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isWorker && (
                    <DropdownMenuItem asChild>
                      <Link to="/worker" className="cursor-pointer">
                        <Wrench className="mr-2 h-4 w-4" />
                        My Tasks
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild className="gradient-primary shadow-glow">
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-up">
            {user ? (
              <div className="flex flex-col gap-2">
                {(isStudent || isFaculty) && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isFaculty ? <BookOpen className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                      Dashboard
                    </Link>
                    <Link
                      to="/issues/new"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      Report Issue
                    </Link>
                  </>
                )}
                
                {isWorker && (
                  <Link
                    to="/worker"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Wrench className="h-4 w-4" />
                    My Tasks
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-center rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-4 py-2 text-center rounded-lg gradient-primary text-primary-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
