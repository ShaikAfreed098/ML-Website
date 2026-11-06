import React, { useState } from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  Cpu, 
  Database, 
  GitBranch, 
  Layers, 
  LayoutDashboard, 
  Menu, 
  Sliders, 
  Sparkles, 
  Terminal, 
  X, 
  Zap 
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'dataset', label: 'Dataset' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'features', label: 'Features' },
    { id: 'models', label: 'Models' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'ablation', label: 'Ablation' },
    { id: 'explainability', label: 'Explainability' },
    { id: 'predict', label: 'Predict' },
    { id: 'resources', label: 'Resources' },
    { id: 'architecture', label: 'Architecture' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="p-1.5 rounded-lg bg-slate-900 text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-sm text-slate-900 tracking-tight block leading-none">
                Resource-Aware ML
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mt-0.5">
                Analytics Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {item.id === 'predict' && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
