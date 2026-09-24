import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from '../navigation/Breadcrumbs';
import { useUIStore } from '../../stores';
import { Search, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLoadDemo: () => void;
}

export const MainLayout: React.FC<LayoutProps> = ({ children, onLoadDemo }) => {
  const { globalSearchOpen, setGlobalSearchOpen } = useUIStore();

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onLoadDemo={onLoadDemo} />

        <main className="flex-1 overflow-y-auto p-5 bg-slate-100/60">
          <Breadcrumbs />
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Search Modal Placeholder */}
      {globalSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 pt-20 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Global Forensic Search (Phase 5)..."
                  className="w-full bg-transparent text-xs font-mono outline-hidden text-slate-900 placeholder-slate-400"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setGlobalSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="py-6 text-center text-xs text-slate-500">
              Global search across evidence hashes, keywords, and timeline correlation will be enabled in Phase 5.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
