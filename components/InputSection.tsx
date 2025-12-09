import React, { ChangeEvent, useRef } from 'react';
import { Upload, Mic, Image as ImageIcon, FileText, Activity } from 'lucide-react';
import { FileInput } from '../types';

interface InputSectionProps {
  audioFile: FileInput | null;
  setAudioFile: (f: FileInput | null) => void;
  imageFile: FileInput | null;
  setImageFile: (f: FileInput | null) => void;
  trackerText: string;
  setTrackerText: (s: string) => void;
  userNotes: string;
  setUserNotes: (s: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  audioFile,
  setAudioFile,
  imageFile,
  setImageFile,
  trackerText,
  setTrackerText,
  userNotes,
  setUserNotes,
  onAnalyze,
  isAnalyzing
}) => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile({ file: e.target.files[0] });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImageFile({ file, previewUrl });
    }
  };

  return (
    <div className="bg-night-800 rounded-2xl p-6 shadow-xl border border-night-700 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Uploads */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-night-accent" />
            Upload Data
          </h2>

          {/* Audio Input */}
          <div 
            onClick={() => audioInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
              audioFile ? 'border-night-accent bg-night-accent/10' : 'border-night-700 hover:border-night-600 hover:bg-night-700/50'
            }`}
          >
            <input 
              type="file" 
              ref={audioInputRef} 
              className="hidden" 
              accept="audio/*" 
              onChange={handleAudioUpload}
            />
            <div className="bg-night-700 p-3 rounded-full mb-3">
              <Mic className={`w-6 h-6 ${audioFile ? 'text-night-accent' : 'text-slate-400'}`} />
            </div>
            <span className="text-sm font-medium text-slate-300">
              {audioFile ? audioFile.file.name : "Upload Sleep Recording"}
            </span>
            <span className="text-xs text-slate-500 mt-1">MP3, WAV, M4A</span>
          </div>

          {/* Image Input */}
          <div 
            onClick={() => imageInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
              imageFile ? 'border-night-accent bg-night-accent/10' : 'border-night-700 hover:border-night-600 hover:bg-night-700/50'
            }`}
          >
            <input 
              type="file" 
              ref={imageInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            {imageFile?.previewUrl ? (
               <div className="relative w-full h-32 mb-2">
                 <img src={imageFile.previewUrl} alt="Room" className="w-full h-full object-cover rounded-lg" />
               </div>
            ) : (
              <div className="bg-night-700 p-3 rounded-full mb-3">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <span className="text-sm font-medium text-slate-300">
              {imageFile ? "Change Bedroom Photo" : "Upload Bedroom Photo"}
            </span>
             <span className="text-xs text-slate-500 mt-1">Optional: For environment analysis</span>
          </div>
        </div>

        {/* Right Col: Text Inputs */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-night-accent" />
            Context
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <Activity className="w-4 h-4 inline mr-1" />
              Tracker Summary
            </label>
            <textarea 
              className="w-full bg-night-900/50 border border-night-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-night-accent focus:border-transparent outline-none transition-all placeholder-slate-600 text-sm"
              rows={4}
              placeholder="Paste summary from Fitbit, Apple Watch, Oura... (e.g., 'Total sleep 6h 30m, Awake 45m...')"
              value={trackerText}
              onChange={(e) => setTrackerText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Personal Notes
            </label>
            <textarea 
              className="w-full bg-night-900/50 border border-night-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-night-accent focus:border-transparent outline-none transition-all placeholder-slate-600 text-sm"
              rows={3}
              placeholder="How did you feel? Stressed? Late coffee?"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || (!audioFile && !trackerText && !imageFile)}
          className={`
            px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105
            ${isAnalyzing || (!audioFile && !trackerText && !imageFile)
              ? 'bg-slate-700 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/30'
            }
          `}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
              Dreaming...
            </span>
          ) : "Analyze Sleep"}
        </button>
      </div>
    </div>
  );
};

export default InputSection;