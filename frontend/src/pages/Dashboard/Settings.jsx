import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, Button } from '../../components/SharedUI';
import { Moon, Sun, Monitor, Palette, CheckCircle2, Droplets, Sparkles, Zap } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { 
      id: 'light', 
      name: 'Pure Canvas', 
      desc: 'Professional & Clinical', 
      icon: Sun, 
      color: 'bg-indigo-500',
      preview: ['bg-white', 'bg-slate-50', 'bg-indigo-500'] 
    },
    { 
      id: 'dark', 
      name: 'Deep Slate', 
      desc: 'Comfortable focus mode', 
      icon: Moon, 
      color: 'bg-slate-700',
      preview: ['bg-slate-900', 'bg-slate-800', 'bg-slate-700'] 
    },
    { 
      id: 'midnight', 
      name: 'Midnight OLED', 
      desc: 'Perfect Dark. Eternal.', 
      icon: Zap, 
      color: 'bg-black',
      preview: ['bg-black', 'bg-neutral-900', 'bg-indigo-500'] 
    },
    { 
      id: 'forest', 
      name: 'Emerald Grove', 
      desc: 'Scientific & Grounded', 
      icon: Droplets, 
      color: 'bg-emerald-600',
      preview: ['bg-[#022c22]', 'bg-[#064e3b]', 'bg-emerald-500'] 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">System Core</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Interface geometry & visual protocols</p>
        </div>
        <Badge type="primary" className="h-fit">Version 2.4.0-Pro</Badge>
      </div>

      <section>
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
            <Palette className="h-5 w-5" />
          </div>
          <h3 className="font-black text-lg tracking-tight uppercase">Appearance Gallery</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((t, i) => (
             <Card 
                key={t.id} 
                delay={i + 1}
                onClick={() => setTheme(t.id)}
                className={`relative group cursor-pointer overflow-hidden border-2 transition-all hover:-translate-y-2 ${
                  theme === t.id ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                }`}
             >
                {theme === t.id && (
                  <div className="absolute top-4 right-4 z-20 text-indigo-500 bg-white dark:bg-slate-900 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                
                <div className="mb-6 h-32 rounded-xl overflow-hidden grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/50">
                   <div className={`${t.preview[0]} rounded-lg h-full`}></div>
                   <div className="grid gap-1">
                      <div className={`${t.preview[1]} rounded-lg h-full`}></div>
                      <div className={`${t.preview[2]} rounded-lg h-full`}></div>
                   </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-sm uppercase tracking-tight text-[var(--text-primary)]">{t.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{t.desc}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                   <t.icon className={`w-4 h-4 ${theme === t.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                   <div className={`w-2 h-2 rounded-full ${t.color}`}></div>
                </div>
             </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col p-8 bg-slate-50 dark:bg-slate-900/40 border-dashed border-2">
           <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-400">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-tight">System Sync</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Follow OS preference</p>
              </div>
           </div>
           <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 flex-1">
             Synchronize the library interface with your operating system's light/dark schedule. Transitions will occur automatically.
           </p>
           <Button variant="secondary" className="w-full text-[10px] uppercase font-black tracking-widest h-11">
             Authorize Sync
           </Button>
        </Card>

        <Card className="flex flex-col p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-2xl">
           <div className="flex items-center space-x-4 mb-6 text-white">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-tight">VEMU Elite Pro</h4>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Premium Visuals Enabled</p>
              </div>
           </div>
           <p className="text-xs text-indigo-100 font-medium leading-relaxed mb-8 flex-1 opacity-80">
             You are using the Professional UI system. All visual protocols are calibrated for high-density information architecture.
           </p>
           <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
             <span>Clinical Geometry: Verified</span>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
