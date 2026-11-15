/**
 * TAQEEMK (تقييمك) - CONFIGURATION & CLIENT INITIALIZATION
 * Connects directly to Supabase Backend & Provides Central Theme System
 */

const CONFIG = {
  // Supabase Project Credentials (Frontend-Safe Publishable Key)
  SUPABASE_URL: "https://fdthxmvyythghpqurfpn.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_eHpgs-dlJkjDgHDA4XuNwg_NIVioBKK",

  // App Constants
  APP_NAME: "Taqeemk | تقييمك",
  
  // Monetization Details
  ACTIVATION_FEE_EGP: 0,
  SUBSCRIPTION_DURATION_MONTHS: null,
  WHATSAPP_SUPPORT_URL: "https://wa.me/201503773224",
  TARGET_WALLET_NUMBER: "01503773224", // InstaPay / Vodafone Cash / Smart Wallets
  WALLET_PROVIDERS: ["InstaPay (إنستاباي)", "Vodafone Cash (فودافون كاش)", "Orange Cash", "Etisalat Cash", "WE Pay"],

  // QR Code Defaults
  DEFAULT_QR_COLOR: "#0f172a",
  DEFAULT_QR_BG: "#ffffff",
  REDIRECT_BASE_URL: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/r.html'
};

// ==============================================================================
// CENTRAL THEME DEFINITIONS (10 THEMES)
// Shared across dashboard.html, p.html, and live phone preview
// ==============================================================================
const THEMES = {
  aurora: {
    id: "aurora",
    name: "أورورا",
    background: "linear-gradient(135deg, #07161b 0%, #0b252c 50%, #081118 100%)",
    cardBg: "rgba(13, 38, 44, 0.75)",
    cardBorder: "rgba(45, 212, 191, 0.2)",
    textColor: "#f0fdfa",
    mutedText: "#5eead4",
    buttonBg: "rgba(15, 45, 53, 0.85)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(45, 212, 191, 0.3)",
    accent: "#2dd4bf"
  },
  shafaq: {
    id: "shafaq",
    name: "شفق",
    background: "linear-gradient(135deg, #1f0b24 0%, #351330 50%, #150824 100%)",
    cardBg: "rgba(48, 18, 54, 0.75)",
    cardBorder: "rgba(244, 114, 182, 0.25)",
    textColor: "#fdf2f8",
    mutedText: "#f472b6",
    buttonBg: "rgba(59, 23, 66, 0.85)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(244, 114, 182, 0.35)",
    accent: "#fb7185"
  },
  paper: {
    id: "paper",
    name: "ورق",
    background: "linear-gradient(135deg, #f8f6f0 0%, #f1eee4 100%)",
    cardBg: "#ffffff",
    cardBorder: "#e2d9cc",
    textColor: "#0f172a",
    mutedText: "#475569",
    buttonBg: "#ffffff",
    buttonText: "#0f172a",
    buttonBorder: "#cbd5e1",
    accent: "#b45309"
  },
  night: {
    id: "night",
    name: "ليل",
    background: "linear-gradient(180deg, #07090e 0%, #0c1017 100%)",
    cardBg: "rgba(18, 24, 38, 0.85)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    textColor: "#f8fafc",
    mutedText: "#94a3b8",
    buttonBg: "rgba(24, 32, 47, 0.9)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(255, 255, 255, 0.15)",
    accent: "#6366f1"
  },
  sand: {
    id: "sand",
    name: "رمل",
    background: "linear-gradient(135deg, #f7f1e5 0%, #eddcc8 100%)",
    cardBg: "rgba(255, 252, 247, 0.95)",
    cardBorder: "#dfcfb7",
    textColor: "#1c1917",
    mutedText: "#57534e",
    buttonBg: "#fffbf5",
    buttonText: "#1c1917",
    buttonBorder: "#d5be9f",
    accent: "#d97706"
  },
  cover: {
    id: "cover",
    name: "غلاف",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    cardBg: "rgba(30, 41, 59, 0.75)",
    cardBorder: "rgba(148, 163, 184, 0.2)",
    textColor: "#f1f5f9",
    mutedText: "#94a3b8",
    buttonBg: "rgba(51, 65, 85, 0.8)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(148, 163, 184, 0.25)",
    accent: "#38bdf8"
  },
  calm: {
    id: "calm",
    name: "هدوء",
    background: "linear-gradient(135deg, #0c1a24 0%, #112a38 50%, #09131a 100%)",
    cardBg: "rgba(17, 42, 56, 0.8)",
    cardBorder: "rgba(56, 189, 248, 0.25)",
    textColor: "#f0f9ff",
    mutedText: "#7dd3fc",
    buttonBg: "rgba(21, 53, 71, 0.85)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(56, 189, 248, 0.3)",
    accent: "#0ea5e9"
  },
  ember: {
    id: "ember",
    name: "جمر",
    background: "linear-gradient(135deg, #1c0a08 0%, #2b110b 50%, #140504 100%)",
    cardBg: "rgba(43, 17, 11, 0.85)",
    cardBorder: "rgba(249, 115, 22, 0.3)",
    textColor: "#fff7ed",
    mutedText: "#fdba74",
    buttonBg: "rgba(56, 22, 14, 0.9)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(249, 115, 22, 0.35)",
    accent: "#ea580c"
  },
  ink: {
    id: "ink",
    name: "حبر",
    background: "#050505",
    cardBg: "#141414",
    cardBorder: "#262626",
    textColor: "#ffffff",
    mutedText: "#a1a1aa",
    buttonBg: "#1c1c1c",
    buttonText: "#ffffff",
    buttonBorder: "#3f3f46",
    accent: "#f4f4f5"
  },
  pine: {
    id: "pine",
    name: "صنوبر",
    background: "linear-gradient(135deg, #061811 0%, #0d281e 50%, #05130d 100%)",
    cardBg: "rgba(13, 40, 30, 0.85)",
    cardBorder: "rgba(52, 211, 153, 0.25)",
    textColor: "#ecfdf5",
    mutedText: "#6ee7b7",
    buttonBg: "rgba(18, 52, 39, 0.9)",
    buttonText: "#ffffff",
    buttonBorder: "rgba(52, 211, 153, 0.35)",
    accent: "#10b981"
  },
  stone: {
    id: "stone",
    name: "حجر",
    background: "linear-gradient(180deg, #18191c 0%, #121316 100%)",
    cardBg: "rgba(28, 30, 36, 0.85)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    textColor: "#ffffff",
    mutedText: "#9ca3af",
    buttonBg: "#881337",
    buttonText: "#ffffff",
    buttonBorder: "rgba(244, 63, 94, 0.25)",
    accent: "#f43f5e"
  }
};

/**
 * Helper to safely retrieve a theme object with fallback to 'aurora'
 */
function getTaqeemkTheme(themeId) {
  if (!themeId) return THEMES.aurora;
  const cleanId = String(themeId).trim().toLowerCase();
  return THEMES[cleanId] || THEMES.aurora;
}

/**
 * Applies a theme's CSS variables to an HTML element (:root or preview container)
 */
function applyTaqeemkTheme(targetEl, themeId, overrideAccent = null) {
  const theme = getTaqeemkTheme(themeId);
  const accent = overrideAccent || theme.accent;
  if (targetEl && targetEl.style) {
    targetEl.style.setProperty('--theme-bg', theme.background);
    targetEl.style.setProperty('--theme-card-bg', theme.cardBg);
    targetEl.style.setProperty('--theme-card-border', theme.cardBorder);
    targetEl.style.setProperty('--theme-text', theme.textColor);
    targetEl.style.setProperty('--theme-text-muted', theme.mutedText);
    targetEl.style.setProperty('--theme-btn-bg', theme.buttonBg);
    targetEl.style.setProperty('--theme-btn-text', theme.buttonText);
    targetEl.style.setProperty('--theme-btn-border', theme.buttonBorder);
    targetEl.style.setProperty('--theme-accent', accent);
  }
  return { theme, accent };
}

// Check if credentials are valid and live
const isUsingRealSupabase = () => {
  return Boolean(
    window.supabaseClient || 
    (CONFIG.SUPABASE_URL && 
     !CONFIG.SUPABASE_URL.includes("your-project-id") && 
     CONFIG.SUPABASE_ANON_KEY && 
     !CONFIG.SUPABASE_ANON_KEY.includes("your-anon-public-key"))
  );
};

// Initialize Supabase Client once for reuse across all pages
let supabaseClient = null;
if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
  try {
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'taqeemk_supabase_auth'
      }
    });
    console.info("⚡ Taqeemk: Connected to live Supabase backend.");
  } catch (err) {
    console.error("⚠️ Supabase initialization failed:", err);
  }
} else {
  console.warn("⚠️ Supabase JS SDK not loaded yet. Make sure supabase-js v2 script is included before config.js.");
}

// Global Exports
window.TAQEEMK_CONFIG = CONFIG;
window.THEMES = THEMES;
window.TAQEEMK_THEMES = THEMES;
window.getTaqeemkTheme = getTaqeemkTheme;
window.applyTaqeemkTheme = applyTaqeemkTheme;
window.isUsingRealSupabase = isUsingRealSupabase;
window.getSupabase = () => supabaseClient;
window.supabaseClient = supabaseClient;
