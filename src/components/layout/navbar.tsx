import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { blink } from '@/lib/blink';
import { Database, LogIn, LogOut, User, Menu } from 'lucide-react';

export const Navbar = () => {
  const { user, role } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Database size={18} />
          </div>
          <span>GhanaData<span className="text-primary">Hub</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Buy Data</Link>
          {role === 'agent' && <Link to="/agent" className="hover:text-primary transition-colors">Agent Portal</Link>}
          {role === 'admin' && <Link to="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link>}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden lg:inline-block">
                {user.displayName || user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={() => blink.auth.logout()}>
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <Button onClick={() => blink.auth.login()}>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
