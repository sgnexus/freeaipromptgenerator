import React from 'react';
import { CustomizerState, ThemeMode, LayoutStyle } from '../types';
import { COLOR_PRESETS, GOOGLE_FONTS } from '../data';
import { Palette, Layout, Type, Sparkles, Check, RefreshCw } from 'lucide-react';

interface ThemeCustomizerProps {
  customizer: CustomizerState;
  setCustomizer: React.Dispatch<React.SetStateAction<CustomizerState>>;
}

export default function ThemeCustomizer({ customizer, setCustomizer }: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateSetting = <K extends keyof CustomizerState>(key: K, value: CustomizerState[K]) => {
    setCustomizer(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('prompt_customizer', JSON.stringify(updated));
      return updated;
    });
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setCustomizer(prev => {
      const updated = {
        ...prev,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        accentColor: preset.accent
      };
      localStorage.setItem('prompt_customizer', JSON.stringify(updated));
      return updated;
    });
  };

  const resetToDefault = () => {
    const defaultState: CustomizerState = {
      primaryColor: '#8b5cf6',
      secondaryColor: '#3b82f6',
      accentColor: '#f43f5e',
      themeMode: 'light',
      fontHeading: 'Outfit',
      fontBody: 'Inter',
      layout: 'wide'
    };
    setCustomizer(defaultState);
    localStorage.setItem('prompt_customizer', JSON.stringify(defaultState));
  };

  return (
    <div id="theme-customizer-panel" className="relative z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-white"
        style={{
          background: `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`,
          boxShadow: `0 10px 25px -5px ${customizer.primaryColor}80`
        }}
        title="Customize Design & Layout"
      >
        <Palette className="w-6 h-6 animate-pulse" />
      </button>

      {/* Slide-out Customizer Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 p-6 overflow-y-auto border-l border-slate-200 dark:border-slate-800 transition-all duration-300 animate-fade-in flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: customizer.primaryColor }} />
                  <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white">Design Studio</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <span className="sr-only">Close customizer</span>
                  ✕
                </button>
              </div>

              {/* Theme Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Color Mode & Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['light', 'dark', 'glass-retro', 'midnight-neon', 'warm-amber'] as ThemeMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateSetting('themeMode', mode)}
                      className={`py-2 px-3 text-xs rounded-lg border text-left font-medium capitalize transition-all ${
                        customizer.themeMode === mode
                          ? 'border-transparent text-white ring-2 ring-offset-2'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      style={{
                        backgroundColor: customizer.themeMode === mode ? customizer.primaryColor : undefined,
                        borderColor: customizer.themeMode === mode ? customizer.primaryColor : undefined,
                      }}
                    >
                      {mode.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Mode */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Layout Structure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['wide', 'boxed', 'sidebar-left', 'sidebar-right'] as LayoutStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting('layout', style)}
                      className={`py-2 px-3 text-xs rounded-lg border text-left font-medium capitalize transition-all ${
                        customizer.layout === style
                          ? 'border-transparent text-white ring-2 ring-offset-2'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      style={{
                        backgroundColor: customizer.layout === style ? customizer.primaryColor : undefined,
                        borderColor: customizer.layout === style ? customizer.primaryColor : undefined,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5" />
                        {style.replace('-', ' ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Curated Palettes
                </label>
                <div className="space-y-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
                    >
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{preset.name}</span>
                      <div className="flex gap-1.5">
                        <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: preset.primary }} />
                        <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: preset.secondary }} />
                        <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: preset.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom CSS Color Pickers */}
              <div className="mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Fine-Tune Colors
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Primary Theme</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customizer.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400 uppercase">{customizer.primaryColor}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Secondary Accent</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customizer.secondaryColor}
                        onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400 uppercase">{customizer.secondaryColor}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Danger / Accent</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customizer.accentColor}
                        onChange={(e) => updateSetting('accentColor', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400 uppercase">{customizer.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography selection */}
              <div className="mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Headings Typography
                </label>
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {GOOGLE_FONTS.headings.map((font) => (
                    <button
                      key={font}
                      onClick={() => updateSetting('fontHeading', font)}
                      className={`p-2 text-xs rounded-md border text-center transition-all ${
                        customizer.fontHeading === font
                          ? 'border-transparent text-white ring-1 ring-offset-1'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      style={{
                        backgroundColor: customizer.fontHeading === font ? customizer.primaryColor : undefined,
                        fontFamily: font,
                      }}
                    >
                      {font}
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Body Typography
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {GOOGLE_FONTS.bodies.map((font) => (
                    <button
                      key={font}
                      onClick={() => updateSetting('fontBody', font)}
                      className={`p-2 text-xs rounded-md border text-center transition-all ${
                        customizer.fontBody === font
                          ? 'border-transparent text-white ring-1 ring-offset-1'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      style={{
                        backgroundColor: customizer.fontBody === font ? customizer.primaryColor : undefined,
                        fontFamily: font,
                      }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset Defaults button */}
            <button
              onClick={resetToDefault}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Styles
            </button>
          </div>
        </>
      )}
    </div>
  );
}
