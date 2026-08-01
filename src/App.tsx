import React from 'react';
import { CustomizerState, ThemeMode, LayoutStyle } from './types';
import PromptGeneratorHub from './components/PromptGeneratorHub';
import ThemeCustomizer from './components/ThemeCustomizer';
import { Sparkles, Menu, X, ArrowRight, Mail, Compass, HelpCircle, Heart, FileCode, Check, Send, ExternalLink, Settings, Globe } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>('generator');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = React.useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState<boolean>(false);
  const [showSitemapModal, setShowSitemapModal] = React.useState<boolean>(false);
  const [sitemapXML, setSitemapXML] = React.useState<string>('');
  const [sitemapCopied, setSitemapCopied] = React.useState<boolean>(false);

  // Load customizer state from localStorage or default
  const [customizer, setCustomizer] = React.useState<CustomizerState>(() => {
    const saved = localStorage.getItem('prompt_customizer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      primaryColor: '#8b5cf6', // Indigo-Purple
      secondaryColor: '#3b82f6', // Bright Blue
      accentColor: '#f43f5e', // Coral Rose
      themeMode: 'light',
      fontHeading: 'Outfit',
      fontBody: 'Inter',
      layout: 'wide'
    };
  });

  // Prompt of the Day static template
  const promptOfTheDay = {
    title: 'Multi-Perspective Cognitive Reframer',
    category: 'ChatGPT',
    raw: 'Analyze [topic] from three distinct points of view: a hyper-skeptical forensic economist, an optimistic sci-fi novelist, and a zen master. Provide an integrated summary finding the golden middle ground.',
    tips: ['Perfect for strategic decision making.', 'Change [topic] to your core business bottleneck.']
  };

  // Sync customizer variables to CSS root variables dynamically
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', customizer.primaryColor);
    root.style.setProperty('--color-secondary', customizer.secondaryColor);
    root.style.setProperty('--color-accent', customizer.accentColor);
    root.style.setProperty('--font-heading-family', customizer.fontHeading);
    root.style.setProperty('--font-body-family', customizer.fontBody);

    // Apply global color mode background variables depending on selection
    if (customizer.themeMode === 'dark' || customizer.themeMode === 'midnight-neon') {
      root.style.setProperty('--color-bg-base', '#0f172a'); // deep slate dark
      root.style.setProperty('--color-text-base', '#f1f5f9');
      document.body.classList.add('dark');
    } else if (customizer.themeMode === 'glass-retro') {
      root.style.setProperty('--color-bg-base', '#fefce8'); // nostalgic parchment
      root.style.setProperty('--color-text-base', '#1e293b');
      document.body.classList.remove('dark');
    } else if (customizer.themeMode === 'warm-amber') {
      root.style.setProperty('--color-bg-base', '#fffbeb'); // warm cream
      root.style.setProperty('--color-text-base', '#27272a');
      document.body.classList.remove('dark');
    } else {
      root.style.setProperty('--color-bg-base', '#fafafa'); // clean off-white
      root.style.setProperty('--color-text-base', '#1f2937');
      document.body.classList.remove('dark');
    }
  }, [customizer]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  // Sitemap generator engine
  const handleGenerateSitemap = () => {
    const baseUrl = window.location.origin;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/#generator</loc>
    <lastmod>2026-07-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    setSitemapXML(xml.trim());
    setShowSitemapModal(true);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(sitemapXML);
    setSitemapCopied(true);
    setTimeout(() => setSitemapCopied(false), 2000);
  };

  // Layout wrapper classes
  const getLayoutClasses = () => {
    if (customizer.layout === 'boxed') return 'max-w-6xl mx-auto px-4 sm:px-6 py-8 border-x border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/10 min-h-screen shadow-xs';
    return 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
  };

  // Nav Links
  const navLinks = [
    { id: 'generator', label: 'Prompt Hub' }
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${customizer.themeMode === 'dark' || customizer.themeMode === 'midnight-neon' ? 'dark text-slate-100 bg-slate-950' : 'text-slate-800 bg-slate-50/50'}`}>
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo with vibrant styled text gradient */}
          <button onClick={() => { setActiveTab('generator'); window.scrollTo(0, 0); }} className="flex items-center gap-2 cursor-pointer group text-left">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-all"
              style={{
                background: `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`
              }}
            >
              🚀
            </div>
            <div>
              <h1 className="font-heading font-black text-sm sm:text-base leading-tight tracking-tight text-slate-900 dark:text-white">
                Free AI Prompt <span style={{ color: customizer.primaryColor }}>Generator</span>
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider font-semibold uppercase">The Compiler of Language</p>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); window.scrollTo(0, 0); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === link.id
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
                }`}
                style={{
                  backgroundColor: activeTab === link.id ? customizer.primaryColor : undefined,
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action trigger & Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('generator')}
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              Open Workspace
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsing Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 p-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`w-full text-left py-2.5 px-4 text-xs font-bold rounded-lg transition-all block cursor-pointer ${
                  activeTab === link.id
                    ? 'text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                }`}
                style={{
                  backgroundColor: activeTab === link.id ? customizer.primaryColor : undefined,
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveTab('generator');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 px-4 text-xs font-bold text-white rounded-lg block cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`
              }}
            >
              ✨ Generate Prompts Now
            </button>
          </div>
        )}
      </header>

      {/* Main Structural Layout Wrapper */}
      <main className="flex-grow">
        <div className={getLayoutClasses()}>
          {/* Dynamic Render Section Router */}
          {activeTab === 'generator' && (
            <PromptGeneratorHub customizer={customizer} />
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Logo brand (4 columns) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base shadow-sm font-black"
                style={{
                  background: `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`
                }}
              >
                🚀
              </div>
              <span className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Free AI Prompt Generator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The premier cognitive compiling ecosystem. We empower creators and enterprises to translate concepts into optimal, structured instructions for multi-model architectures.
            </p>

            {/* Sitemap XML trigger */}
            <div className="pt-2">
              <button
                onClick={handleGenerateSitemap}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 transition-all font-semibold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" style={{ color: customizer.primaryColor }} />
                Generate sitemap.xml
              </button>
            </div>
          </div>

          {/* Quick links (3 columns) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Hub</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {navLinks.map(link => (
                <li key={link.id}>
                  <button onClick={() => { setActiveTab(link.id); window.scrollTo(0, 0); }} className="hover:text-purple-600 hover:underline cursor-pointer">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links (2 columns) */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal & Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <li>
                <button onClick={() => alert('Our detailed cookie policy preserves user settings locally.')} className="hover:text-purple-600 hover:underline cursor-pointer">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 columns) */}
          <div className="md:col-span-3 space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">India</h4>
            <p className="leading-relaxed">
              Based in India, empowering creators globally with optimized prompt structures.
            </p>

            {/* Social media footer icons */}
            <div className="flex gap-2.5 pt-2">
              {['Facebook', 'Twitter', 'LinkedIn', 'Github'].map(plat => (
                <button
                  key={plat}
                  onClick={() => alert(`Redirecting to our secure verified ${plat} handle...`)}
                  className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                >
                  {plat[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copywrite bottom banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 Free AI Prompt Generator. All rights reserved globally.</p>
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="font-heading font-extrabold text-slate-800 dark:text-white flex items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: customizer.primaryColor }} />
              Gemini 3.5
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Theme Customizer Panel */}
      <ThemeCustomizer customizer={customizer} setCustomizer={setCustomizer} />

      {/* Dedicated Sitemap Modal */}
      {showSitemapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4.5 h-4.5 text-purple-600" />
                Visual Sitemap & sitemap.xml Generator
              </h4>
              <button onClick={() => setShowSitemapModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lighthouse crawlers require a valid, XML-formatted sitemap mapping all dynamic endpoints. Copy our verified, automatically compiled sitemap script below:
              </p>

              <div className="relative">
                <textarea
                  readOnly
                  value={sitemapXML}
                  className="w-full h-64 p-4 font-mono text-[10px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSitemapModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleCopySitemap}
                  className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-md hover:scale-[1.01] transition-all flex items-center gap-1 cursor-pointer"
                  style={{ backgroundColor: customizer.primaryColor }}
                >
                  {sitemapCopied ? <Check className="w-3.5 h-3.5" /> : null}
                  {sitemapCopied ? 'Copied XML!' : 'Copy sitemap.xml'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
