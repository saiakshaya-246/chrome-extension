import React, { useState } from "react";
import JSZip from "jszip";
import { motion } from "motion/react";
import { 
  Download, Chrome, FileText, Check, Copy, FolderKanban, 
  Settings, Terminal, Layers, Play, RefreshCw, Star, 
  HelpCircle, AlertCircle, Cpu, ShieldCheck
} from "lucide-react";
import { EXTENSION_FILES, ExtensionFile } from "./components/ExtensionFiles";
import { SandboxSimulator } from "./components/SandboxSimulator";
import { DemoPlayer } from "./components/DemoPlayer";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<ExtensionFile>(EXTENSION_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Copy selected file's code content
  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compile and export extension folder as a dynamic ZIP file
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Create base64 icons using canvas to supply real image files inside the ZIP
      const drawIconBase64 = (size: number): string => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Circular warm background
          ctx.fillStyle = "#f59e0b"; // Amber color matching theme
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * Math.PI);
          ctx.fill();

          // Draw cat emoji in center
          const fontSize = Math.floor(size * 0.6);
          ctx.font = `${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🐱", size / 2, size / 2 + (size * 0.02));
        }
        return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
      };

      // 1. Pack standard textual code files
      EXTENSION_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // 2. Pack PNG icons for Manifest V3 action items
      zip.file("icons/icon-16.png", drawIconBase64(16), { base64: true });
      zip.file("icons/icon-48.png", drawIconBase64(48), { base64: true });
      zip.file("icons/icon-128.png", drawIconBase64(128), { base64: true });

      // Generate the finished binary zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Trigger standard client-side download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "cat-ify-chrome-extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error("Zipping failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/60 text-amber-950 font-sans antialiased selection:bg-pink-500 selection:text-white">
      
      {/* Decorative Top Accent Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-orange-400 to-amber-500 shrink-0"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* APP HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-4 border-amber-200/80">
          <div className="flex items-center gap-4">
            <span className="text-4xl bg-white border-4 border-amber-200 p-4 rounded-3xl shadow-xl shadow-amber-100/40 flex items-center justify-center">
              🐱
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-pink-100 text-pink-600 border-2 border-pink-200 px-3 py-1 rounded-full font-mono font-black uppercase tracking-wider">
                  Chrome Extension Builder
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 border-2 border-amber-200 px-3 py-1 rounded-full font-mono font-bold">
                  Manifest V3
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight mt-1 flex items-center gap-2">
                Cat Image Replacer
              </h1>
              <p className="text-amber-900/85 text-sm font-medium mt-1 max-w-xl">
                Replace all images across the internet with adorable cat photography in developer mode.
              </p>
            </div>
          </div>

          {/* Quick Stats Header Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white border-2 border-amber-200 p-3.5 rounded-2xl flex items-center gap-3 shadow shadow-amber-100/30">
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center">
                <Chrome className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-[10px] text-amber-800 font-extrabold uppercase">Target Platform</p>
                <p className="text-xs font-black text-amber-950">Chrome Developer Mode</p>
              </div>
            </div>
          </div>
        </header>

        {/* HERO AREA: CODESET EXPORTER & INTERACTIVE SIMULATOR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Downloads, Specs, and Install Walkthrough Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                📦 Extension Package Creator
              </h2>
              <p className="text-xs text-amber-900/85 font-medium leading-relaxed">
                Download the fully-formed, compiled directory for the extension. It is preconfigured using <strong>Manifest V3</strong> specifications, fully tested, and ready to upload to Chrome without publishing to the Web Store.
              </p>

              {/* Specification bullet list */}
              <div className="bg-white rounded-3xl p-5 border-4 border-amber-200/80 space-y-3 shadow-md shadow-amber-100/30">
                <h4 className="text-xs font-black text-pink-500 uppercase tracking-wider">Extension Features:</h4>
                <ul className="space-y-2.5 text-xs text-amber-900 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-500 font-black">✓</span>
                    <span><strong>DOM Image Replacer:</strong> Scans webpage elements and swaps `img` and backgrounds with direct URLs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-500 font-black">✓</span>
                    <span><strong>Infinite Scroll Observer:</strong> Employs `MutationObserver` to watch for newly loaded image assets in real-time.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-500 font-black">✓</span>
                    <span><strong>Toolbar Extension Popup:</strong> Adjust settings and categories (Kittens, Sleepy, Funny) with immediate updates.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ACTION CENTER - DOWNLOAD ZIP */}
            <div className="space-y-3.5 bg-white p-5 rounded-3xl border-4 border-amber-200 shadow-xl shadow-amber-200/20">
              <div>
                <h3 className="text-base font-black text-amber-950">Ready to Load?</h3>
                <p className="text-[11px] text-amber-850 font-medium mt-0.5">Generates a ZIP with all scripts, icons, popup assets, and manifest.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-black transition-all ${
                    downloadSuccess 
                      ? "bg-emerald-500 text-white font-extrabold border-2 border-emerald-600" 
                      : "bg-pink-500 hover:bg-pink-600 text-white cursor-pointer shadow-lg hover:shadow-pink-400/20 rounded-2xl border-b-4 border-pink-700/80 active:translate-y-0.5 transition-all"
                  }`}
                >
                  <Download className="w-5 h-5 shrink-0" />
                  {isZipping ? "Packing..." : downloadSuccess ? "Extension Downloaded! ✓" : "Download Extension ZIP"}
                </button>
              </div>

              {downloadSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-emerald-800 font-medium shadow-sm"
                >
                  <span className="text-base leading-none">🎉</span>
                  <p><strong>Download Complete!</strong> Locate <code>cat-ify-chrome-extension.zip</code>, extract its contents, and proceed to the chrome://extensions step below.</p>
                </motion.div>
              )}

              <div className="text-[10px] text-amber-700/80 font-bold flex items-center justify-center gap-1.5 pt-2 border-t border-amber-100">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Client-side packed. No external trackers.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE PREVIEW PLAYGROUND */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-3.5 mb-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-amber-950 flex items-center gap-2">
                  ⚡ Interactive Playground Sandbox
                </h3>
                <span className="text-xs text-pink-500 font-black font-mono">Simulated Web App</span>
              </div>
              <p className="text-xs text-amber-900/80 font-medium">
                Test the exact extension behaviors directly in this sandbox! Open the simulated browser popup by clicking the <strong>🐱 extension trigger button</strong> in the toolbar.
              </p>
            </div>
            <div className="flex-1 min-h-[360px]">
              <SandboxSimulator />
            </div>
          </div>
        </section>

        {/* SECTION: SIMULATED VIDEO DEMO */}
        <section className="bg-amber-100/25 border-4 border-amber-200/80 rounded-[2rem] p-6 space-y-6 shadow-md shadow-amber-100/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b-2 border-amber-200/60">
            <div>
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                🎬 High-Fidelity Video Walkthrough
              </h2>
              <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                Don't want to install it yet? Watch our simulated player show exactly how to load and use the extension.
              </p>
            </div>
            <span className="text-xs bg-white border-2 border-amber-200 px-3 py-1 rounded-full font-mono font-bold text-amber-800">
              Demo Length: 0:45
            </span>
          </div>

          <DemoPlayer />
        </section>

        {/* SECTION: COMPREHENSIVE DEVELOPER GUIDE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border-4 border-amber-200 rounded-[2rem] p-6 shadow-xl shadow-amber-100/30">
          
          {/* Step-by-Step load instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
              🛠️ Developer Mode Installation Guide
            </h3>
            <p className="text-xs text-amber-900/80 font-medium">
              Follow these simple steps to load the downloaded unpacked extension inside Google Chrome or Chromium-based browsers:
            </p>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 border border-pink-200 flex items-center justify-center font-bold font-mono shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-extrabold text-amber-950">Extract ZIP File</h4>
                  <p className="text-amber-900/70 mt-0.5 font-medium">Locate the downloaded <code>cat-ify-chrome-extension.zip</code> and extract/unzip it to a dedicated directory on your local desktop or documents folder.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 border border-pink-200 flex items-center justify-center font-bold font-mono shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-extrabold text-amber-950">Open Chrome Extensions Manager</h4>
                  <p className="text-amber-900/70 mt-0.5 font-medium">In a new Chrome tab, copy/paste <code>chrome://extensions/</code> in the address bar. You can also click the Puzzle icon and select <strong>Manage Extensions</strong>.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 border border-pink-200 flex items-center justify-center font-bold font-mono shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-extrabold text-amber-950">Enable Developer Mode Toggle</h4>
                  <p className="text-amber-900/70 mt-0.5 font-medium">Look at the top-right corner of the Extensions panel and activate the <strong>Developer Mode</strong> toggle button. This enables loading local directories.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 border border-pink-200 flex items-center justify-center font-bold font-mono shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-extrabold text-amber-950">Click &apos;Load Unpacked&apos;</h4>
                  <p className="text-amber-900/70 mt-0.5 font-medium">Click the newly visible <strong>Load unpacked</strong> button in the top-left menu. Select the extracted folder containing the <code>manifest.json</code> file.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ / Troubleshooting details */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
              💡 Extension FAQ & Developer Notes
            </h3>

            <div className="space-y-4 text-xs">
              <div className="bg-amber-50/50 p-4 rounded-2xl border-2 border-amber-150">
                <h4 className="font-black text-pink-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> What makes Manifest V3 different?
                </h4>
                <p className="text-amber-900/80 mt-1 leading-relaxed text-[11px] font-medium">
                  Manifest V3 increases security, performance, and user privacy. Background scripts now run as ephemeral **Service Workers** instead of persistent background pages, which drastically saves system RAM. Furthermore, V3 blocks loading external scripts or remote execution, keeping all logic safely local.
                </p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border-2 border-amber-150">
                <h4 className="font-black text-pink-600 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Overcoming strict Content Security Policies (CSP)
                </h4>
                <p className="text-amber-900/80 mt-1 leading-relaxed text-[11px] font-medium">
                  Some high-security websites (like GitHub) enforce a strict CSP that blocks fetching dynamic content or loading random image domains. To ensure maximum reliability, our content script utilizes a pool of highly-trusted CDNs and direct fallback arrays that bypass CORS blocks seamlessly.
                </p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border-2 border-amber-150">
                <h4 className="font-black text-amber-950">Pin for easier access</h4>
                <p className="text-amber-900/80 mt-1 leading-relaxed text-[11px] font-medium">
                  Chrome hides newly installed extension icons by default. To access configuration popup with ease, click the Puzzle piece in your top right toolbar and pin the **🐱 Cat-ify Image Replacer** icon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FILE EXPLORER & CODE VIEW */}
        <section className="bg-white border-4 border-amber-200 rounded-[2rem] p-6 space-y-6 shadow-xl shadow-amber-100/30">
          <div className="pb-4 border-b-2 border-amber-100">
            <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
              📂 Extension Code Repository Explorer
            </h2>
            <p className="text-xs text-amber-900/85 font-medium mt-0.5">
              Review and inspect the complete, hand-crafted files for the extension directly in the browser. Feel free to copy individual script snippets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left selector col */}
            <div className="lg:col-span-4 space-y-2">
              <p className="text-[10px] font-black text-amber-850 uppercase tracking-wider px-1">Source Files</p>
              {EXTENSION_FILES.map((file) => {
                const isSelected = selectedFile.name === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => {
                      setSelectedFile(file);
                      setCopied(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-start gap-3 ${
                      isSelected 
                        ? "bg-pink-50 border-2 border-pink-200 text-pink-700 font-extrabold" 
                        : "bg-amber-50/40 border-2 border-amber-100 hover:bg-amber-50 text-amber-900 font-medium cursor-pointer"
                    }`}
                  >
                    <div className="p-1.5 rounded-xl bg-white border border-amber-150 text-amber-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate text-amber-950">{file.name}</p>
                      <p className="text-[10.5px] text-amber-750 truncate mt-0.5 font-bold">{file.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right code viewer col */}
            <div className="lg:col-span-8 bg-amber-50/50 border-2 border-amber-200/80 rounded-2xl overflow-hidden flex flex-col h-[400px]">
              
              {/* Toolbar */}
              <div className="bg-amber-100/55 px-4 py-2.5 border-b-2 border-amber-100 flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-amber-900/80 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-600" />
                  {selectedFile.path}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 rounded-xl font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              {/* Code pane */}
              <div className="flex-1 overflow-auto p-4 text-[11px] sm:text-xs font-mono text-amber-950 bg-white scrollbar-thin scrollbar-thumb-amber-200">
                <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="border-t-2 border-amber-200/60 bg-amber-100/20 text-amber-800/80 text-xs py-8 mt-16 text-center select-none font-sans font-medium">
        <p>Chrome Extension Cat Image Replacer • Built with React, Vite & Tailwind</p>
        <p className="mt-1">All image assets are fetched from public APIs or direct photo CDNs.</p>
      </footer>
    </div>
  );
}
