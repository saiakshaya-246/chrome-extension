import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Pause, RotateCcw, Volume2, Maximize, CheckSquare, 
  FolderOpen, Settings, ToggleRight, Puzzle, Eye, Sparkles, Download, ArrowRight, Video
} from "lucide-react";

interface Step {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  description: string;
}

const DEMO_STEPS: Step[] = [
  {
    id: 1,
    timeStart: 0,
    timeEnd: 8,
    title: "1. Download & Extract",
    description: "Click 'Download Extension ZIP' inside this app to save the Manifest V3 files, then extract the ZIP archive to a folder on your computer."
  },
  {
    id: 2,
    timeStart: 8,
    timeEnd: 18,
    title: "2. Open Extensions & Enable Developer Mode",
    description: "In Google Chrome, navigate to 'chrome://extensions/' or click the Puzzle menu and select 'Manage extensions'. Toggle 'Developer mode' on in the top-right."
  },
  {
    id: 3,
    timeStart: 18,
    timeEnd: 28,
    title: "3. Load Unpacked Extension",
    description: "Click the 'Load unpacked' button in the top-left, select the extracted folder containing the extension files, and confirm the selection."
  },
  {
    id: 4,
    timeStart: 28,
    timeEnd: 36,
    title: "4. Pin the Extension",
    description: "Click the Puzzle icon in your Chrome toolbar, find 'Cat-ify Image Replacer', and click the Pin icon to keep the extension visible next to your URL bar."
  },
  {
    id: 5,
    timeStart: 36,
    timeEnd: 45,
    title: "5. Active Cat-ification",
    description: "Open any website, click the Cat icon to configure, and see all images seamlessly transform into cats!"
  }
];

export function DemoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds, 0 to 45
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 44.5) {
            setIsPlaying(false);
            return 0; // Restart or loop
          }
          return prev + 0.5;
        });
      }, 500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const newTime = Math.min(Math.max(0, Math.floor(clickPercent * 45)), 44);
    setCurrentTime(newTime);
  };

  const getActiveStep = (): Step => {
    return DEMO_STEPS.find(s => currentTime >= s.timeStart && currentTime < s.timeEnd) || DEMO_STEPS[0];
  };

  const activeStep = getActiveStep();

  // Custom visual components for each demo step
  const renderDemoVisual = () => {
    const stepId = activeStep.id;

    // We can show custom styled vectors/components inside the video player container
    switch (stepId) {
      case 1: // Download & Extract
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50/40 p-6 text-center text-amber-950 relative overflow-hidden">
            <motion.div 
              className="absolute -top-12 -left-12 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10 space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg shadow-pink-100 mx-auto"
              >
                <Download className="w-8 h-8 text-white" />
              </motion.div>

              <h4 className="text-lg font-black text-amber-950">Step 1: Downloading Extension ZIP</h4>
              <p className="text-xs text-amber-900/80 max-w-sm mx-auto font-medium">
                All package source files (manifest.json, content.js, popup.html) are compiled into a standalone ZIP download.
              </p>

              {/* Simulated OS folder extraction box */}
              <div className="bg-white rounded-3xl p-3.5 max-w-xs mx-auto border-4 border-amber-200/80 flex items-center gap-3 text-left shadow-md shadow-amber-100/40">
                <FolderOpen className="w-10 h-10 text-pink-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-black truncate text-amber-950">cat-ify-extension.zip</p>
                  <p className="text-[10px] text-amber-700/80 font-bold font-mono">12.4 KB • Extracting...</p>
                  
                  {/* Mock progress bar */}
                  <div className="w-32 bg-amber-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <motion.div 
                      className="bg-pink-500 h-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 6 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Open Extensions & Enable Developer Mode
        return (
          <div className="w-full h-full bg-amber-100/30 p-4 flex flex-col">
            {/* Simulated Chrome Extensions Dashboard */}
            <div className="bg-white rounded-2xl border-2 border-amber-200/80 flex-1 flex flex-col overflow-hidden text-amber-950">
              <div className="bg-amber-50 px-4 py-2 border-b-2 border-amber-100 flex items-center justify-between text-xs font-bold">
                <span className="font-mono text-amber-800/80 flex items-center gap-2">
                  <span className="text-amber-900/60">Chrome:</span> chrome://extensions
                </span>
                
                {/* Developer Mode Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-bold text-amber-900/80">Developer mode</span>
                  <div className="relative">
                    {/* Simulated cursor clicking the developer mode switch */}
                    <motion.div
                      className="absolute z-20 w-5 h-5 bg-pink-500/80 border-2 border-white rounded-full cursor-none shadow-lg"
                      initial={{ top: 20, left: 100, opacity: 0 }}
                      animate={{ top: 3, left: -14, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 4, times: [0, 0.2, 0.8, 1], repeat: Infinity }}
                    />
                    <motion.div 
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        currentTime > 12 ? "bg-pink-500" : "bg-amber-200"
                      }`}
                    >
                      <motion.span 
                        className="block w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 shadow-sm"
                        animate={{ left: currentTime > 12 ? "18px" : "3px" }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main inner panel */}
              <div className="p-4 flex-1 flex flex-col justify-center items-center relative">
                <h5 className="text-sm font-black text-amber-950">Extensions</h5>
                <p className="text-[11px] text-amber-900/80 text-center mt-1 max-w-xs font-medium leading-relaxed">
                  {currentTime > 12 
                    ? "✓ Developer Mode is Enabled! Options like 'Load unpacked' are now visible."
                    : "Enabling developer mode allows loading unpacked directories from your disk."
                  }
                </p>

                {/* Animated options panel */}
                <AnimatePresence>
                  {currentTime > 12 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex gap-2"
                    >
                      <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-[10px] font-extrabold shadow-sm border border-pink-600">
                        Load unpacked
                      </span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 border-2 border-amber-200/80 rounded-full text-[10px] font-bold">
                        Pack extension
                      </span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 border-2 border-amber-200/80 rounded-full text-[10px] font-bold">
                        Update
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );

      case 3: // Load Unpacked Extension
        return (
          <div className="w-full h-full bg-amber-100/30 p-4 flex flex-col">
            <div className="bg-white rounded-2xl border-2 border-amber-200/80 flex-1 flex flex-col overflow-hidden text-amber-950">
              <div className="bg-amber-50 px-4 py-2 border-b-2 border-amber-100 flex items-center justify-between text-xs font-bold">
                <span className="font-mono text-amber-850">chrome://extensions</span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 bg-pink-500 text-white font-extrabold rounded-full text-[9px] relative">
                    Load unpacked
                    
                    {/* Simulated cursor clicking load unpacked */}
                    <motion.div
                      className="absolute z-20 w-4 h-4 bg-pink-500/80 border border-white rounded-full cursor-none shadow-lg"
                      initial={{ top: 20, left: 30, opacity: 0 }}
                      animate={{ top: 1, left: -10, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 3, times: [0, 0.2, 0.8, 1], repeat: Infinity }}
                    />
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900/60 rounded text-[9px]">Pack extension</span>
                </div>
              </div>

              {/* Loader visual */}
              <div className="p-4 flex-1 flex flex-col justify-center items-center relative">
                {/* Simulated Explorer selection */}
                {currentTime < 23 ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border-2 border-amber-200 p-3.5 rounded-2xl text-left max-w-xs space-y-2 shadow-2xl z-20"
                  >
                    <p className="text-[10px] text-amber-900/60 font-black uppercase tracking-wider">Select Extension Directory</p>
                    <div className="bg-pink-50 border border-pink-100 p-2.5 rounded-xl flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-pink-500" />
                      <div className="truncate">
                        <p className="text-[11px] font-black text-amber-950">cat-ify-extension</p>
                        <p className="text-[9px] text-amber-700/80 font-bold font-mono">Contains: manifest.json, content.js</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <span className="text-[9px] bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 font-bold">Cancel</span>
                      <span className="text-[9px] bg-pink-500 text-white font-black px-2.5 py-1 rounded-lg shadow-sm">Select Folder</span>
                    </div>
                  </motion.div>
                ) : (
                  /* Extension successfully loaded card */
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-xs bg-white border-2 border-amber-200 rounded-2xl p-3.5 text-left relative overflow-hidden shadow-xl shadow-amber-100/40"
                  >
                    <div className="absolute top-0 right-0 bg-pink-100 text-pink-600 border-l border-b border-pink-200 text-[8px] font-black px-2 py-0.5 rounded-bl uppercase">
                      DEVELOPER LOADED
                    </div>
                    
                    <div className="flex gap-2.5 items-start">
                      <span className="text-2xl bg-amber-50 p-2 rounded-xl">🐱</span>
                      <div>
                        <h6 className="text-xs font-black text-amber-950">Cat-ify Image Replacer</h6>
                        <p className="text-[9px] text-amber-800 font-mono font-bold">ID: mfkaolbeigbceof...</p>
                        <p className="text-[10px] text-amber-900/80 mt-1 font-medium">Replaces webpage images with random cat images from API.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-amber-50 text-[10px] text-amber-800/80 font-medium">
                      <span>Source: ~/Downloads/cat-ify</span>
                      <span className="text-pink-600 font-black">V1.0.0</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );

      case 4: // Pin the Extension
        return (
          <div className="w-full h-full bg-amber-100/30 p-4 flex flex-col justify-between">
            {/* Simulated Chrome Toolbar Header */}
            <div className="bg-white rounded-2xl border-2 border-amber-200/80 p-2 flex items-center justify-between text-xs text-amber-950 font-bold shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-900/60 font-mono">🔒 secure-site.com</span>
              </div>

              {/* Action Toolbar with extension trigger and puzzle dropdown */}
              <div className="flex items-center gap-2 relative">
                <motion.div 
                  className={`p-1.5 rounded-xl font-bold ${currentTime > 32 ? "text-pink-500 text-sm bg-pink-50" : "text-amber-800/40"}`}
                  animate={currentTime > 32 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  🐱
                </motion.div>
                
                <div className="p-1.5 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 cursor-pointer text-amber-900 relative">
                  <Puzzle className="w-4 h-4 text-amber-800" />
                  
                  {/* Simulated cursor clicking the puzzle piece */}
                  {currentTime < 32 && (
                    <motion.div
                      className="absolute z-20 w-4 h-4 bg-pink-500/80 border border-white rounded-full cursor-none shadow-lg"
                      initial={{ top: 20, left: 30, opacity: 0 }}
                      animate={{ top: 2, left: -8, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 3, times: [0, 0.2, 0.8, 1], repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Simulated Puzzle Dropdown Panel */}
                {currentTime < 33 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-8 z-30 w-[220px] bg-white border-2 border-amber-250 rounded-2xl p-2.5 shadow-2xl text-left"
                  >
                    <p className="text-[9px] font-black text-amber-900/40 uppercase tracking-wider px-1">Extensions</p>
                    <div className="mt-1.5 flex items-center justify-between p-2 bg-amber-50 rounded-xl border border-amber-150">
                      <span className="text-[11px] text-amber-950 font-bold flex items-center gap-1.5">
                        <span>🐱</span> Cat-ify Image
                      </span>
                      <motion.div 
                        className={`text-amber-500 cursor-pointer text-xs ${currentTime > 31 ? "text-pink-500" : ""}`}
                        animate={currentTime > 31 ? { scale: [1, 1.3, 1] } : {}}
                      >
                        📌
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center p-3 text-center">
              <h5 className="text-xs font-black text-amber-950">
                {currentTime > 32 ? "Extension Is Pinned!" : "Pin to Toolbar"}
              </h5>
              <p className="text-[11px] text-amber-900/80 mt-1 max-w-xs font-medium">
                {currentTime > 32 
                  ? "The Cat-ify extension icon is now permanently pinned to your browser bar for instant pop-up access."
                  : "Click the puzzle piece icon in the top-right toolbar, then click the Pin icon next to the Cat-ify extension."
                }
              </p>
            </div>
          </div>
        );

      case 5: // Enjoy Cat-ified Internet!
        return (
          <div className="w-full h-full bg-amber-100/30 p-4 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white rounded-t-2xl border-t border-l border-r border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-950 font-bold shadow-sm">
              <span className="text-[10px] text-amber-900/60 truncate font-mono">https://news-blog.com</span>
              <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] font-bold">
                <span>🐱</span>
                <span className="text-[9px] text-pink-500 font-black uppercase tracking-wider font-mono">ON</span>
              </div>
            </div>

            {/* Simulated webpage content flipping to cats */}
            <div className="flex-1 bg-amber-50/20 border-b border-l border-r border-amber-200 rounded-b-2xl p-3 flex gap-3 relative overflow-hidden items-center justify-center">
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl border-2 border-amber-100/80 p-1.5 flex flex-col overflow-hidden">
                  <div className="h-16 relative overflow-hidden bg-amber-50 rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80" 
                      alt="Cat" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                    </div>
                  </div>
                  <div className="p-1 space-y-0.5">
                    <div className="w-12 h-1 bg-pink-500 rounded" />
                    <div className="w-full h-2 bg-amber-100 rounded" />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl border-2 border-amber-100/80 p-1.5 flex flex-col overflow-hidden">
                  <div className="h-16 relative overflow-hidden bg-amber-50 rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=200&auto=format&fit=crop&q=80" 
                      alt="Cat" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                    </div>
                  </div>
                  <div className="p-1 space-y-0.5">
                    <div className="w-8 h-1 bg-pink-500 rounded" />
                    <div className="w-full h-2 bg-amber-100 rounded" />
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2 bg-pink-100 text-pink-600 border-2 border-pink-200 text-[8px] font-black px-2 py-0.5 rounded-full uppercase font-mono tracking-wider shadow-sm">
                Cat-ified Site
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleStepClick = (step: Step) => {
    setCurrentTime(step.timeStart);
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-200/80 overflow-hidden shadow-xl shadow-amber-200/30 flex flex-col lg:flex-row h-[420px]">
      
      {/* Video Viewport Column */}
      <div className="flex-1 flex flex-col bg-amber-50/30 relative">
        
        {/* Aspect Ratio Video Box */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-amber-50/10">
          {renderDemoVisual()}

          {/* Autoplay play banner when not playing */}
          {!isPlaying && currentTime === 0 && (
            <div className="absolute inset-0 bg-amber-950/50 z-30 flex flex-col items-center justify-center text-center p-4 backdrop-blur-[2px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(true)}
                className="w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <Play className="w-6 h-6 fill-white ml-1 text-white" />
              </motion.button>
              <h4 className="text-sm font-black text-white mt-4 flex items-center gap-1.5 uppercase tracking-wider">
                <Video className="w-4 h-4" /> Watch Simulated Walkthrough
              </h4>
              <p className="text-[11px] text-amber-50 mt-1 max-w-xs font-medium">
                See the 45-second guide showing download, developer mode, and activation in Chrome.
              </p>
            </div>
          )}

          {/* Sparkles / overlay during walkthrough */}
          <div className="absolute top-3 left-3 bg-white/95 border-2 border-amber-100 text-[10px] font-black text-pink-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
            SIMULATED DEMO RECORDER
          </div>
        </div>

        {/* Video Player Controls Overlay */}
        <div className="bg-amber-100/50 px-4 py-2.5 border-t-2 border-amber-200/70 flex flex-col gap-2 shrink-0 select-none">
          {/* Progress timeline bar */}
          <div 
            onClick={handleProgressClick}
            className="w-full bg-amber-200/60 h-1.5 rounded-full relative cursor-pointer group"
          >
            <div 
              style={{ width: `${(currentTime / 45) * 100}%` }}
              className="bg-pink-500 h-full rounded-full relative"
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full scale-0 group-hover:scale-100 transition-all shadow-md" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-pink-500 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => setCurrentTime(0)}
                className="hover:text-pink-500 transition-colors cursor-pointer"
                title="Restart demo video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="font-mono text-[11px] text-amber-800">
                0:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 0:45
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-white border-2 border-amber-100/80 px-2.5 py-0.5 rounded-full font-mono font-bold truncate text-pink-500 max-w-[140px] md:max-w-none">
                {activeStep.title}
              </span>
              <Volume2 className="w-4 h-4 text-amber-700/60" />
              <Maximize className="w-4 h-4 text-amber-700/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Chapters / Description Sidebar */}
      <div className="w-full lg:w-[280px] border-t lg:border-t-0 lg:border-l-2 border-amber-200/70 bg-amber-50/20 flex flex-col h-1/2 lg:h-full overflow-hidden shrink-0">
        <div className="p-4 border-b-2 border-amber-100 shrink-0">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-800">Video Walkthrough Chapters</h4>
          <p className="text-[11px] text-amber-700/70 font-medium mt-0.5">Click any chapter to jump directly to that step.</p>
        </div>

        {/* Chapters list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-amber-200">
          {DEMO_STEPS.map((step) => {
            const isActive = activeStep.id === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                className={`w-full text-left p-2.5 rounded-2xl transition-all border-2 ${
                  isActive 
                    ? "bg-pink-50 border-pink-200 text-amber-950" 
                    : "bg-transparent border-transparent hover:bg-amber-100/30 text-amber-800 cursor-pointer"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-bold ${isActive ? "text-pink-600" : "text-amber-900"}`}>
                    {step.title}
                  </span>
                  <span className="text-[9px] text-amber-700/60 font-mono font-bold">
                    0:{step.timeStart < 10 ? `0${step.timeStart}` : step.timeStart}
                  </span>
                </div>
                {isActive && (
                  <p className="text-[10.5px] text-amber-900/80 mt-1 leading-relaxed animate-fade-in font-medium">
                    {step.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
