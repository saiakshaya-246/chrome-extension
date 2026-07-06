import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Laptop, Sparkles, Sliders, RefreshCw, Layers, CheckCircle2, 
  HelpCircle, Image as ImageIcon, Heart, Eye, ArrowRight, Check
} from "lucide-react";

// Curated high-quality Unsplash image arrays representing cats of different styles
export const SIMULATOR_CATS = {
  any: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"
  ],
  kittens: [
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513360309081-36f20c3803db?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574158622643-69d34d72650a?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=600&auto=format&fit=crop&q=80"
  ],
  funny: [
    "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535268647977-a403b69fc756?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501820488136-72669a482e29?w=600&auto=format&fit=crop&q=80"
  ],
  sleepy: [
    "https://images.unsplash.com/photo-1511275539165-cc46b1ee8960?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506891536236-3e0587a953a4?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&auto=format&fit=crop&q=80"
  ]
};

// Default static images for the mock webpage
const STATIC_IMAGES = [
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&auto=format&fit=crop&q=80", // Nature landscape
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80", // Puppy dog
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", // Tech headphones
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80", // Salad food
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80", // Architecture
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80"  // Art/Abstract
];

const MOCK_ARTICLES = [
  {
    category: "Adventure",
    title: "10 Beautiful Mountain Paths to Hike This Summer",
    desc: "Discover remote high-altitude routes that offer sweeping glacial views, wildflower meadows, and alpine lakes.",
    hearts: 142,
    views: "1.2k"
  },
  {
    category: "Pets",
    title: "How to Keep Your Active Golden Retriever Entertained",
    desc: "Interactive puzzles, scent training games, and fetch adaptations designed to exercise your dog's keen intelligence.",
    hearts: 512,
    views: "3.4k"
  },
  {
    category: "Technology",
    title: "The Ultimate Audiophile Review of Studio Headphones",
    desc: "An in-depth acoustic response analysis of five studio monitor reference headphones designed for mixing accuracy.",
    hearts: 89,
    views: "931"
  },
  {
    category: "Culinary",
    title: "Vibrant Summer Mediterranean Bowls in Under 15 Minutes",
    desc: "Crisp cucumbers, marinated kalamata olives, toasted chickpeas, and robust herbed tahini dressing.",
    hearts: 301,
    views: "2.1k"
  },
  {
    category: "Design",
    title: "A Comprehensive Guide to Modern Minimalist Spaces",
    desc: "Unlocking clean layouts, organic textures, balanced negative space, and neutral natural colors in home projects.",
    hearts: 122,
    views: "800"
  },
  {
    category: "Art",
    title: "Exploring Creative Dynamic Graphics and Light Lines",
    desc: "A retrospective exhibition displaying neon curves, retro-futuristic canvases, and responsive neon typography.",
    hearts: 254,
    views: "1.8k"
  }
];

export function SandboxSimulator() {
  const [extensionEnabled, setExtensionEnabled] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<"any" | "kittens" | "funny" | "sleepy">("any");
  const [popupOpen, setPopupOpen] = useState(false);
  const [swappedCount, setSwappedCount] = useState(0);

  // Recalculate swapped count when toggle/style changes
  useEffect(() => {
    if (extensionEnabled) {
      setSwappedCount(6);
    } else {
      setSwappedCount(0);
    }
  }, [extensionEnabled, selectedStyle]);

  return (
    <div className="flex flex-col h-full bg-amber-100/30 rounded-3xl border-4 border-amber-200/80 overflow-hidden shadow-xl shadow-amber-200/30">
      {/* Simulated Browser Header */}
      <div className="bg-amber-100/70 px-4 py-3.5 flex items-center justify-between border-b-2 border-amber-250 shrink-0">
        <div className="flex items-center gap-2">
          {/* Windows / Mac style control dots */}
          <div className="w-3 h-3 rounded-full bg-rose-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <span className="text-[11px] font-bold text-amber-800/60 ml-2 select-none font-mono hidden sm:inline">Chrome Sandbox</span>
        </div>

        {/* Browser URL bar */}
        <div className="bg-white px-3 py-1.5 rounded-full text-xs font-mono text-amber-900 w-1/2 max-w-sm flex items-center justify-between border-2 border-amber-200/70 shadow-sm">
          <span className="truncate">https://cute-cats-blog.com</span>
          <span className="text-emerald-600 text-[10px] font-bold">🔒 Secure</span>
        </div>

        {/* Extension action icons */}
        <div className="flex items-center gap-2 relative">
          <button
            id="simulated-extension-trigger"
            onClick={() => setPopupOpen(!popupOpen)}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 border-2 shadow-sm ${
              popupOpen 
                ? "bg-pink-500 text-white border-pink-600" 
                : "bg-white hover:bg-amber-50 text-amber-900 border-amber-200"
            }`}
            title="Click to open extension popup"
          >
            <span className="text-sm">🐱</span>
            {extensionEnabled && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            )}
          </button>
          
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-full hidden lg:inline">
            Click Extension Icon
          </span>

          {/* SIMULATED CHROME EXTENSION POPUP PANEL */}
          <AnimatePresence>
            {popupOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-50 w-[270px] bg-white rounded-3xl shadow-2xl border-4 border-amber-200 text-slate-900 overflow-hidden"
              >
                {/* Popup Header */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm flex items-center gap-1.5">
                      🐱 Cat-ify Page
                    </h3>
                    <span className="text-[9px] bg-pink-700/40 px-2 py-0.5 rounded-full text-pink-100 font-mono font-bold">
                      V3 ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-pink-100/90 mt-1">Image Replacement Extension</p>
                </div>

                {/* Popup Body */}
                <div className="p-4 space-y-4">
                  {/* Enabled Toggle */}
                  <div className="flex items-center justify-between bg-amber-50/50 p-2.5 rounded-2xl border-2 border-amber-100">
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-900">Enable Cat-ify</h4>
                      <p className="text-[10px] text-amber-700 font-medium">Swap web images to cats</p>
                    </div>
                    
                    {/* CSS Toggle Switch Slider */}
                    <button
                      onClick={() => setExtensionEnabled(!extensionEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 outline-none ${
                        extensionEnabled ? "bg-pink-500" : "bg-slate-300"
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                        extensionEnabled ? "translate-x-5" : ""
                      }`} />
                    </button>
                  </div>

                  {/* Dropdown Style */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-800 flex items-center justify-between">
                      <span>Cat Category</span>
                      <span className="text-[9px] text-pink-500 font-bold font-mono">LIVE UPDATE</span>
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value as any)}
                      className="w-full text-xs bg-amber-50 border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-pink-300 cursor-pointer text-amber-900 font-extrabold"
                    >
                      <option value="any">🐾 Random Cats</option>
                      <option value="kittens">🍼 Cute Kittens</option>
                      <option value="funny">🤪 Silly & Funny</option>
                      <option value="sleepy">😴 Sleepy Cats</option>
                    </select>
                  </div>

                  {/* Dynamic Stats badge */}
                  <div className="bg-pink-50 border-2 border-pink-150 rounded-2xl p-3.5 text-center">
                    <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Total Swapped Images</p>
                    <p className="text-3xl font-black text-pink-600 my-0.5">{swappedCount}</p>
                    <p className="text-[10px] text-pink-600/80 italic font-medium">Making this website adorable!</p>
                  </div>
                </div>

                {/* Popup Footer */}
                <div className="bg-amber-50/50 border-t border-amber-100 py-2.5 text-center text-[10px] text-amber-700 font-mono font-bold">
                  Developer Mode packed • v1.0.0
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simulated Webpage Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-amber-50/30 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
        
        {/* Mock Page Branding Banner */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b-2 border-amber-100">
          <div>
            <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
              🧭 Scenic Discoverer Blog
            </h2>
            <p className="text-amber-800/80 text-xs font-medium mt-1">A curated collection of interesting photography, travels, and guides.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-amber-800 font-bold">Extension Status:</span>
            {extensionEnabled ? (
              <span className="text-[11px] bg-pink-100 text-pink-600 border-2 border-pink-200 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
                CAT-IFIED
              </span>
            ) : (
              <span className="text-[11px] bg-amber-100 text-amber-800 border-2 border-amber-200 px-3 py-1 rounded-full font-mono font-bold">
                NORMAL PAGE
              </span>
            )}
          </div>
        </div>

        {/* Simulated Webpage Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ARTICLES.map((art, idx) => {
            const originalSrc = STATIC_IMAGES[idx];
            const catSrc = SIMULATOR_CATS[selectedStyle][idx % SIMULATOR_CATS[selectedStyle].length];

            return (
              <div 
                key={idx}
                className="bg-white border-2 border-amber-100/80 rounded-3xl overflow-hidden hover:border-pink-200 transition-all shadow-md shadow-amber-100/40 group flex flex-col"
              >
                {/* Image frame */}
                <div className="h-44 overflow-hidden relative bg-amber-50 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {extensionEnabled ? (
                      <motion.div
                        key={`cat-${idx}-${selectedStyle}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="w-full h-full relative"
                      >
                        <img 
                          src={catSrc} 
                          alt="Cat"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Shimmer/Sparkle badge indicating replacement */}
                        <div className="absolute top-3 left-3 bg-pink-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black font-mono tracking-wider flex items-center gap-1 shadow-md">
                          <Sparkles className="w-2.5 h-2.5" />
                          CATIFIED
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="original"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative"
                      >
                        <img 
                          src={originalSrc} 
                          alt="Original"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Article Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-pink-500 uppercase font-mono">
                      {art.category}
                    </span>
                    <h4 className="text-base font-bold text-amber-950 mt-1 line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs text-amber-900/70 font-medium mt-2 line-clamp-3 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-amber-700/80 font-mono font-bold mt-4 pt-3 border-t border-amber-50">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500" /> {art.hearts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-amber-600" /> {art.views}
                    </span>
                    <span className="text-pink-500 font-extrabold hover:underline cursor-pointer flex items-center gap-0.5">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic bottom message */}
        <div className="mt-8 bg-white rounded-2xl p-4 border-2 border-amber-100 flex items-center justify-between flex-wrap gap-4 text-xs text-amber-900 font-medium shadow-sm">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-500" />
            <span>This is a live simulator of the extension. Toggle the <strong>🐱 Extension Icon</strong> above to test!</span>
          </span>
          <button 
            onClick={() => setExtensionEnabled(!extensionEnabled)}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all shadow-md shadow-pink-100 cursor-pointer"
          >
            {extensionEnabled ? "Disable Extension Simulation" : "Enable Extension Simulation"}
          </button>
        </div>
      </div>
    </div>
  );
}
