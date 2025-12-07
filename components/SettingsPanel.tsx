import React from 'react';
import { TargetAI, OptimizationMode, AppSettings } from '../types';
import { Settings2, Cpu, Zap, Radio } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, className = '' }) => {
  
  const handleAiChange = (ai: TargetAI) => {
    onSettingsChange({ ...settings, targetAI: ai });
  };

  const handleModeChange = (mode: OptimizationMode) => {
    onSettingsChange({ ...settings, mode });
  };

  return (
    <div className={`flex flex-col gap-6 p-6 h-full bg-slate-900 border-r border-slate-800 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Lyra
        </h1>
      </div>
      
      <p className="text-xs text-slate-400 mb-4">
        AI Prompt Optimization Specialist. Transform vague ideas into precision prompts.
      </p>

      {/* Target AI Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Cpu size={16} className="text-indigo-400" />
          <span>Target Platform</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(TargetAI).map((ai) => (
            <button
              key={ai}
              onClick={() => handleAiChange(ai)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                settings.targetAI === ai
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
              }`}
            >
              {ai}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Settings2 size={16} className="text-purple-400" />
          <span>Optimization Mode</span>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleModeChange(OptimizationMode.BASIC)}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
              settings.mode === OptimizationMode.BASIC
                ? 'bg-purple-600/20 border-purple-500/50 ring-1 ring-purple-500'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded-full ${settings.mode === OptimizationMode.BASIC ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Zap size={12} fill="currentColor" />
            </div>
            <div>
              <div className={`text-sm font-medium ${settings.mode === OptimizationMode.BASIC ? 'text-purple-300' : 'text-slate-300'}`}>Basic Mode</div>
              <div className="text-xs text-slate-500 mt-0.5">Quick fix, core techniques, ready-to-use.</div>
            </div>
          </button>

          <button
            onClick={() => handleModeChange(OptimizationMode.DETAIL)}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
              settings.mode === OptimizationMode.DETAIL
                ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-500'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
             <div className={`mt-0.5 p-1 rounded-full ${settings.mode === OptimizationMode.DETAIL ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Radio size={12} />
            </div>
            <div>
              <div className={`text-sm font-medium ${settings.mode === OptimizationMode.DETAIL ? 'text-indigo-300' : 'text-slate-300'}`}>Detail Mode</div>
              <div className="text-xs text-slate-500 mt-0.5">Interactive, clarifying questions, comprehensive.</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800">
         <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
           <p className="text-[10px] text-slate-400 leading-relaxed text-center">
             Powered by Gemini 2.5 Flash.
             <br/>
             Sessions are not stored.
           </p>
         </div>
      </div>
    </div>
  );
};