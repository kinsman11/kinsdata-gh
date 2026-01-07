import React from 'react';
import { Database, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <Database size={18} />
              </div>
              <span>GhanaData<span className="text-primary">Hub</span></span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering Ghanaians with affordable and accessible data bundles. Join our network of satisfied customers today.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Buy Data</a></li>
              <li><a href="/agent" className="hover:text-primary transition-colors">Become an Agent</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" /> support@ghanadatahub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" /> +233 (0) 54 000 0000
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ghana Data Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
