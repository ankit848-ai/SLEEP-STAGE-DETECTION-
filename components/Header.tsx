import React from 'react';
import { Moon } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-8 text-center animate-fade-in-down">
      <div className="inline-flex items-center justify-center p-3 bg-night-800 rounded-full mb-4 ring-1 ring-night-700 shadow-lg shadow-indigo-900/20">
        <Moon className="w-8 h-8 text-indigo-400 fill-indigo-400/20 mr-3" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white tracking-tight">
          SleepLens
        </h1>
      </div>
      <p className="text-slate-400 max-w-lg mx-auto text-sm">
        Advanced multimodal sleep analysis powered by Gemini 3 Pro. 
        Upload recordings and visual context to decode your rest.
      </p>
    </header>
  );
};

export default Header;