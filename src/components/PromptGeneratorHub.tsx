import React from 'react';
import { PromptCategory, PromptOptions, CustomizerState } from '../types';
import { PRESET_TEMPLATES } from '../data';
import { Sparkles, Copy, Check, MessageSquare, Image, Code, FileText, Braces, Video, ArrowRight, HelpCircle } from 'lucide-react';
import { compilePromptLocally } from '../utils/promptCompiler';

interface PromptGeneratorHubProps {
  customizer: CustomizerState;
}

export default function PromptGeneratorHub({ customizer }: PromptGeneratorHubProps) {
  const [category, setCategory] = React.useState<PromptCategory>('chatgpt');
  const [rawPrompt, setRawPrompt] = React.useState('');
  const [options, setOptions] = React.useState<PromptOptions>({
    tone: 'Professional',
    length: 'Medium',
    role: '',
    context: '',
    constraints: ''
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState('');
  const [optimizedOutput, setOptimizedOutput] = React.useState<{
    optimizedPrompt: string;
    explanation: string;
    tips: string[];
  } | null>(null);

  const [copied, setCopied] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const loadingPhrases = [
    'Parsing raw prompt parameters...',
    'Analyzing category contextual semantics...',
    'Applying prompt-engineering structural formulas...',
    'Brewing high-quality constraints and persona conditioning...',
    'Injecting optimal performance triggers...',
    'Finalizing structural optimization...'
  ];

  const handlePresetSelect = (presetPrompt: string) => {
    setRawPrompt(presetPrompt);
    // Auto populate options depending on category to make it extremely interactive
    if (category === 'coding') {
      setOptions(prev => ({ ...prev, role: 'Senior Software Engineer', tone: 'Technical', constraints: 'Include error handling and clean modular syntax.' }));
    } else if (category === 'image') {
      setOptions(prev => ({ ...prev, role: 'Director of Photography', tone: 'Creative', constraints: 'Unreal Engine 5 render, volumetric light rays, golden hour.' }));
    } else if (category === 'json') {
      setOptions(prev => ({ ...prev, role: 'API Schema Architect', tone: 'Technical', constraints: 'No markdown wrapper blocks. Valid parseable JSON only.' }));
    } else if (category === 'chatgpt') {
      setOptions(prev => ({ ...prev, role: 'Expert Educator', tone: 'Casual', constraints: 'Use metaphors easily understood by non-technical crowds.' }));
    } else {
      setOptions(prev => ({ ...prev, role: 'Expert Copywriter', tone: 'Persuasive', constraints: 'Focus on high hook potential and visual formatting.' }));
    }
  };

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPrompt.trim()) {
      setErrorMsg('Please enter a raw prompt or select one of the presets first!');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setOptimizedOutput(null);

    // Dynamic loading text step updates
    let stepIndex = 0;
    setLoadingStep(loadingPhrases[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingPhrases.length;
      setLoadingStep(loadingPhrases[stepIndex]);
    }, 1200);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rawPrompt,
          category,
          variables: {
            tone: options.tone,
            length: options.length,
            role: options.role || undefined,
            context: options.context || undefined,
            constraints: options.constraints || undefined
          }
        })
      });

      if (!response.ok) {
        throw new Error('Server offline or missing API key');
      }

      const data = await response.json();
      setOptimizedOutput(data);
    } catch (err: any) {
      console.warn("Express backend optimization endpoint is unavailable or returned an error. Falling back to local prompt-engineering compilation...", err);
      
      // Fall back to offline high-fidelity prompt compilation!
      const localResult = compilePromptLocally(rawPrompt, category, {
        tone: options.tone,
        length: options.length,
        role: options.role,
        context: options.context,
        constraints: options.constraints
      });

      setOptimizedOutput({
        optimizedPrompt: localResult.optimizedPrompt,
        explanation: `${localResult.explanation} (Optimized instantly using your browser's offline linguistic compiler - no server required!)`,
        tips: localResult.tips
      });
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (optimizedOutput) {
      navigator.clipboard.writeText(optimizedOutput.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories = [
    { id: 'chatgpt', label: 'ChatGPT prompt generator', icon: MessageSquare, desc: 'Conversational roles & reasoning prompts' },
    { id: 'json', label: 'JSON prompt generator', icon: Braces, desc: 'Strict structure & database schema prompts' },
    { id: 'image', label: 'Image prompt generator', icon: Image, desc: 'Camera specs, volumetric lighting, photorealistic art' },
    { id: 'video', label: 'Video Prompt generator', icon: Video, desc: 'Temporal flow, lens panning, atmospheric conditions' },
    { id: 'coding', label: 'Coding Prompt generator', icon: Code, desc: 'Clean script generators, testing suites, code refactoring' },
    { id: 'general', label: 'General prompt generator', icon: FileText, desc: 'Aesthetic marketing copy & broad assignments' }
  ];

  return (
    <div id="prompt-generator-hub" className="space-y-8 animate-fade-in">
      {/* Visual Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40" style={{ color: customizer.primaryColor }}>
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          One-Stop Prompt Engineering Hub
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
          Free AI Prompt Generator & Optimizer
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Unlock the true potential of advanced neural architectures. Input a basic command below, apply rich visual constraint presets, and let our compiler craft the ultimate state-of-the-art prompt.
        </p>
      </div>

      {/* Category Grid Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id as PromptCategory);
                setOptimizedOutput(null);
                setErrorMsg('');
              }}
              className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-32 cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 ring-2 ring-offset-2'
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
              style={{
                borderColor: isSelected ? customizer.primaryColor : undefined,
                boxShadow: isSelected ? `0 8px 20px -6px ${customizer.primaryColor}30` : undefined,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`
                    : '#94a3b8'
                }}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <p className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-white">{cat.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{cat.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Working Dashboard split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Settings (7 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleOptimize} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  1. Tell us what you are looking for
                </label>
                <span className="text-xs font-mono text-slate-400">{rawPrompt.length} chars</span>
              </div>
              <textarea
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                placeholder="e.g., Write an email marketing template for organic coffee beans, or A cute cat sitting on a futuristic throne."
                className="w-full h-32 p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-offset-1 text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                style={{ '--tw-ring-color': customizer.primaryColor } as React.CSSProperties}
              />
            </div>

            {/* Parameter adjustments */}
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5">
              <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                2. Fine-Tune Parameters (Optional)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Tone of Voice</label>
                  <select
                    value={options.tone}
                    onChange={(e) => setOptions({ ...options, tone: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    {['Professional', 'Creative / Immersive', 'Technical / Dry', 'Persuasive', 'Academic', 'Casual & Friendly'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Prompt Length</label>
                  <select
                    value={options.length}
                    onChange={(e) => setOptions({ ...options, length: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    {['Short & Direct', 'Medium / Standard', 'Long & Hyper-Detailed'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>


            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-heading font-bold text-sm text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${customizer.primaryColor}, ${customizer.secondaryColor})`,
                boxShadow: `0 8px 24px -6px ${customizer.primaryColor}50`
              }}
            >
              <Sparkles className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '3s' }} />
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </form>

          {/* Quick Preset Library Selection */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              Need Inspiration? Click a Quick Preset:
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_TEMPLATES.filter(p => p.category === category).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.rawPrompt)}
                  className="p-2.5 text-left text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all truncate block cursor-pointer"
                >
                  ✨ {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Panel (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {isLoading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[400px] space-y-6">
              {/* Spinner animation */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 animate-spin border-t-purple-600" style={{ borderTopColor: customizer.primaryColor }} />
                <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: customizer.primaryColor }} />
              </div>
              <div className="space-y-2 max-w-xs">
                <h4 className="font-heading font-bold text-slate-800 dark:text-white">Prompt-Engineering Engine Active</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse font-mono">{loadingStep}</p>
              </div>
            </div>
          )}

          {!isLoading && !optimizedOutput && !errorMsg && (
            <div className="bg-slate-50/40 dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] text-slate-400 dark:text-slate-600">
              <Sparkles className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">Ready to Generate Your Prompt</p>
              <p className="text-xs max-w-xs mt-1">Configure parameters, tell us what you are looking for on the left, and hit generate to witness real-time prompt structuring.</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs sm:text-sm space-y-2">
              <p className="font-bold">Optimization Error</p>
              <p>{errorMsg}</p>
              <p className="text-[11px] text-rose-500/80">Make sure your server is running and configured correctly.</p>
            </div>
          )}

          {optimizedOutput && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-heading font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5" style={{ color: customizer.primaryColor }} />
                  Optimized Output
                </h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>

              {/* Copied output area */}
              <div className="relative">
                <textarea
                  readOnly
                  value={optimizedOutput.optimizedPrompt}
                  className="w-full h-64 p-4 text-xs font-mono text-slate-700 dark:text-slate-300 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 focus:outline-hidden"
                />
              </div>

              {/* Explanation of changes */}
              {optimizedOutput.explanation && (
                <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/30">
                  <h5 className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1.5 uppercase tracking-wider">
                    Optimization Logic
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {optimizedOutput.explanation}
                  </p>
                </div>
              )}

              {/* Tips & Recommendations checklist */}
              {optimizedOutput.tips && optimizedOutput.tips.length > 0 && (
                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Advanced Engineering Tips
                  </h5>
                  <ul className="space-y-2">
                    {optimizedOutput.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
