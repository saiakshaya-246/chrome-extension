/**
 * Pure strings of the Chrome Extension files.
 * These are used for code display, copying, and packaging into the ZIP.
 */

export interface ExtensionFile {
  name: string;
  language: string;
  path: string;
  content: string;
  description: string;
}

export const EXTENSION_FILES: ExtensionFile[] = [
  {
    name: "manifest.json",
    language: "json",
    path: "manifest.json",
    description: "The extension manifest defining permissions, content scripts, and Manifest V3 metadata.",
    content: `{
  "manifest_version": 3,
  "name": "Cat-ify Image Replacer",
  "version": "1.0.0",
  "description": "Replaces all images on any webpage with cute random cat images fetched from an API.",
  "permissions": [
    "storage",
    "activeTab"
  ],
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon-48.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}`
  },
  {
    name: "content.js",
    language: "javascript",
    path: "content.js",
    description: "Content script that runs in the context of webpages. It finds all images and replaces their sources, using a MutationObserver to catch dynamically added content.",
    content: `// List of high-quality direct Unsplash cat images to use as instant, ultra-reliable fallbacks
// and to bypass strict Content Security Policies (CSP) on certain websites.
const FALLBACK_CATS = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513360309081-36f20c3803db?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535268647977-a403b69fc756?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501820488136-72669a482e29?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511275539165-cc46b1ee8960?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506891536236-3e0587a953a4?w=500&auto=format&fit=crop&q=80"
];

let isEnabled = true;
let catStyle = "any";
let totalCatifiedCount = 0;

// Initialize settings from chrome storage
function initSettings() {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["enabled", "catStyle", "catifiedCount"], (result) => {
      isEnabled = result.enabled !== false; // Default true
      catStyle = result.catStyle || "any";
      totalCatifiedCount = result.catifiedCount || 0;
      
      if (isEnabled) {
        catifyPage();
        setupObserver();
      }
    });

    // Listen for storage changes from the popup
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local") {
        let shouldReRun = false;
        if (changes.enabled) {
          isEnabled = changes.enabled.newValueValue !== false;
          shouldReRun = true;
        }
        if (changes.catStyle) {
          catStyle = changes.catStyle.newValue || "any";
          shouldReRun = true;
        }
        
        if (isEnabled && shouldReRun) {
          catifyPage();
        } else if (!isEnabled) {
          // Optional: Reload to restore original images, or just stop replacing
          console.log("Cat-ify disabled. Reload page to restore original images.");
        }
      }
    });
  } else {
    // Non-extension test environment
    catifyPage();
  }
}

// Select a cat URL based on index or random, and potentially match cat style
function getCatImageUrl(index) {
  // We can filter by style keywords or use Unsplash parameters for specific styles
  // To keep it light, reliable, and CORS-independent, we append search terms to Unsplash URLs,
  // or pick from our curated set
  const baseUrl = FALLBACK_CATS[index % FALLBACK_CATS.length];
  
  if (catStyle === "kittens") {
    return baseUrl + "&q=kitten";
  } else if (catStyle === "funny") {
    return baseUrl + "&q=funny-cat";
  } else if (catStyle === "sleepy") {
    return baseUrl + "&q=sleepy-cat";
  }
  return baseUrl;
}

// Primary replacement function
function catifyPage() {
  if (!isEnabled) return;

  // 1. Standard img elements
  const images = document.getElementsByTagName("img");
  let newlyCatified = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    // Skip if already catified
    if (img.dataset.catified === "true") continue;
    
    // Store original src just in case
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src || "";
    }
    
    // Set a placeholder so we don't end up in an infinite replacement loop
    img.dataset.catified = "true";
    
    // Change src and srcset
    const targetCatUrl = getCatImageUrl(i + Math.floor(Math.random() * 10));
    img.src = targetCatUrl;
    if (img.srcset) {
      img.srcset = targetCatUrl;
    }
    
    newlyCatified++;
  }

  // 2. CSS Background images
  const allElements = document.getElementsByTagName("*");
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    if (el.dataset.catifiedBg === "true") continue;

    const bgImage = window.getComputedStyle(el).backgroundImage;
    if (bgImage && bgImage !== "none" && bgImage.includes("url")) {
      el.dataset.originalBg = bgImage;
      el.dataset.catifiedBg = "true";
      
      const targetCatUrl = getCatImageUrl(i);
      el.style.backgroundImage = \`url('\${targetCatUrl}')\`;
      newlyCatified++;
    }
  }

  if (newlyCatified > 0) {
    totalCatifiedCount += newlyCatified;
    saveCatifiedCount(totalCatifiedCount);
  }
}

// Save the count of replaced images
function saveCatifiedCount(count) {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ catifiedCount: count });
  }
}

// Watch for dynamically loaded images (infinite scroll, AJAX)
let observer = null;
function setupObserver() {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;
    
    let shouldCatify = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldCatify = true;
        break;
      }
    }
    
    if (shouldCatify) {
      // Debounce slightly to handle batch updates
      clearTimeout(window.catifyTimeout);
      window.catifyTimeout = setTimeout(catifyPage, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start everything when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSettings);
} else {
  initSettings();
}
`
  },
  {
    name: "popup.html",
    language: "html",
    path: "popup.html",
    description: "The HTML for the extension's toolbar popup. Features a toggle switch, style selectors, and custom-styled stat counters.",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 280px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
      color: #111827;
    }
    .header {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 16px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .subtitle {
      font-size: 12px;
      opacity: 0.9;
      margin-top: 4px;
    }
    .container {
      padding: 16px;
    }
    .setting-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #e5e7eb;
    }
    .setting-label {
      font-weight: 600;
      font-size: 14px;
    }
    .setting-desc {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
    }
    /* Toggle Switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #cbd5e1;
      transition: .3s;
      border-radius: 24px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    input:checked + .slider {
      background-color: #f59e0b;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
    /* Dropdown */
    select {
      width: 100%;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background-color: white;
      font-size: 13px;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    select:focus {
      border-color: #f59e0b;
    }
    .stats {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      margin-top: 12px;
    }
    .stats-title {
      font-size: 11px;
      color: #db2777;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
    }
    .stats-number {
      font-size: 24px;
      font-weight: 800;
      color: #be185d;
      margin: 4px 0;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🐱 Cat-ify Page</h1>
    <div class="subtitle">Image Replacement Extension</div>
  </div>
  <div class="container">
    <div class="setting-group">
      <div>
        <div class="setting-label">Enable Cat-ify</div>
        <div class="setting-desc">Swap webpage images with cats</div>
      </div>
      <label class="switch">
        <input type="checkbox" id="enableToggle" checked>
        <span class="slider"></span>
      </label>
    </div>

    <div style="margin-bottom: 12px;">
      <div style="font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #374151;">Cat Category:</div>
      <select id="catStyleSelect">
        <option value="any">🐾 Random Cats</option>
        <option value="kittens">🍼 Cute Kittens</option>
        <option value="funny">🤪 Silly & Funny</option>
        <option value="sleepy">😴 Sleepy Cats</option>
      </select>
    </div>

    <div class="stats">
      <div class="stats-title">Total Swapped Images</div>
      <div class="stats-number" id="statsCount">0</div>
      <div style="font-size: 11px; color: #86198f;">Making the internet cuter!</div>
    </div>

    <div class="footer">
      Developer Mode Packed • v1.0.0
    </div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`
  },
  {
    name: "popup.js",
    language: "javascript",
    path: "popup.js",
    description: "The JavaScript companion to popup.html. It queries storage on load, listens for changes, and writes user preferences and stats to chrome.storage.",
    content: `document.addEventListener("DOMContentLoaded", () => {
  const enableToggle = document.getElementById("enableToggle");
  const catStyleSelect = document.getElementById("catStyleSelect");
  const statsCount = document.getElementById("statsCount");

  // Load saved configurations from chrome local storage
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["enabled", "catStyle", "catifiedCount"], (result) => {
      enableToggle.checked = result.enabled !== false; // default true
      catStyleSelect.value = result.catStyle || "any";
      statsCount.textContent = result.catifiedCount || 0;
    });
  }

  // Save enable/disable switch toggle
  enableToggle.addEventListener("change", () => {
    const isEnabled = enableToggle.checked;
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ enabled: isEnabled }, () => {
        // Trigger active tab reload or message to run content script
        notifySettingsChanged();
      });
    }
  });

  // Save category selector value
  catStyleSelect.addEventListener("change", () => {
    const selectedStyle = catStyleSelect.value;
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ catStyle: selectedStyle }, () => {
        notifySettingsChanged();
      });
    }
  });

  // Helper to notify the tab about configuration update
  function notifySettingsChanged() {
    // Send a message or reload active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  // Listen for storage updates (to update the live cat-ified counter)
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.catifiedCount) {
        statsCount.textContent = changes.catifiedCount.newValue || 0;
      }
    });
  }
});`
  },
  {
    name: "background.js",
    language: "javascript",
    path: "background.js",
    description: "Service worker script that runs in the background. It initializes storage variables on extension install and handles runtime messaging.",
    content: `// background.js - service worker for Manifest V3

chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.local.set({
    enabled: true,
    catStyle: "any",
    catifiedCount: 0
  });
  console.log("Cat-ify Web Page Extension installed and defaults set!");
});`
  }
];
