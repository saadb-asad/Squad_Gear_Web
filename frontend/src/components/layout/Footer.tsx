import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full mt-24 py-12 px-4 lg:px-margin-desktop bg-surface shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#d1d9e6]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-max-width mx-auto gap-8 lg:gap-gutter">
        <div className="space-y-4">
          <div className="font-headline-md text-headline-md font-bold text-on-surface">Squad Wear</div>
          <p className="text-on-surface-variant max-w-xs font-body-md text-body-md">Refining the intersection of utility and urban expression through meticulous craftsmanship.</p>
          <div className="flex gap-4">
            <button className="neo-extruded-sm neo-interactive p-3 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">share</span>
            </button>
            <button className="neo-extruded-sm neo-interactive p-3 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">forum</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface font-label-md">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">About</Link></li>
              <li><Link to="/careers" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">Careers</Link></li>
              <li><Link to="/contact" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">Contact</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface font-label-md">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">Shipping</Link></li>
              <li><Link to="/returns" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">Returns</Link></li>
              <li><Link to="/faqs" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface font-label-md">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">Terms</Link></li>
              <li><Link to="/privacy" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md">Privacy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-max-width mx-auto mt-12 pt-8 border-t border-on-surface-variant/10 text-center md:text-left">
        <p className="text-on-surface-variant font-body-md text-body-md">© {new Date().getFullYear()} Squad Wear Streetwear. All rights reserved.</p>
      </div>
    </footer>
  );
};
