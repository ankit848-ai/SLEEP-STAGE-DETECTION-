import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AnalysisResultView from './components/AnalysisResult';
import { AppState, FileInput } from './types';
import { analyzeSleepData } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    audioFile: null,
    imageFile: null,
    trackerText: '',
    userNotes: '',
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleAnalyze = async () => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const result = await analyzeSleepData(
        state.audioFile,
        state.imageFile,
        state.trackerText,
        state.userNotes
      );
      setState(prev => ({ ...prev, isAnalyzing: false, result }));
    } catch (error: any) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: error.message || "Failed to analyze sleep data. Please ensure API key is set and inputs are valid." 
      }));
    }
  };

  const handleRegenerate = () => {
    // Keep inputs, clear result
    setState(prev => ({ ...prev, result: null }));
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Header />

        <main className="mt-8 space-y-8 pb-12">
          
          {state.error && (
             <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center text-red-200 text-sm animate-shake">
                {state.error}
             </div>
          )}

          {!state.result ? (
            <InputSection 
              audioFile={state.audioFile}
              setAudioFile={(f) => setState(prev => ({ ...prev, audioFile: f }))}
              imageFile={state.imageFile}
              setImageFile={(f) => setState(prev => ({ ...prev, imageFile: f }))}
              trackerText={state.trackerText}
              setTrackerText={(s) => setState(prev => ({ ...prev, trackerText: s }))}
              userNotes={state.userNotes}
              setUserNotes={(s) => setState(prev => ({ ...prev, userNotes: s }))}
              onAnalyze={handleAnalyze}
              isAnalyzing={state.isAnalyzing}
            />
          ) : (
            <AnalysisResultView 
              result={state.result}
              onRegenerate={handleRegenerate}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;