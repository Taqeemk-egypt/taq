/**
 * TAQEEMK (تقييمك) - CORE APPLICATION LOGIC & SUPABASE DATA LAYER
 * Handles Authentication, Systems/ملفاتك, Supabase Client, QR Generator, Storage, and UI state
 */

(function () {
  'use strict';

  // ==============================================================================
  // 1. BRAND ICONS & SVG GLYPHS (Guaranteed Fallback - Zero Missing Icons)
  // ==============================================================================
  const SVGS = {
    instagram: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
    facebook: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    envelope: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    reviews: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    link: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    telegram: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.87 8.81c-.14.63-.51.78-1.03.49l-2.85-2.1-1.38 1.33c-.15.15-.28.28-.58.28l.2-2.92 5.32-4.81c.23-.21-.05-.32-.36-.12l-6.58 4.14-2.83-.89c-.62-.19-.63-.62.13-.92l11.08-4.27c.51-.19.96.12.77.98z"/></svg>`,
    snapchat: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12.04 0c-4.47 0-7.39 3.25-7.39 6.84 0 1.25.4 2.45.69 3.08.1.22.03.35-.15.42-.51.2-1.35.59-1.92 1.48-.48.75-.41 1.62-.05 2.12.5.69 1.43.91 2.39.77.29-.04.48.07.56.24.47 1.05 1.54 2.19 3.44 2.5.17.03.29.17.27.34-.14 1.15-1.07 1.84-2.09 2.05-.51.1-.59.39-.24.58.98.54 2.42.75 4.49.75 2.07 0 3.51-.21 4.49-.75.35-.19.27-.48-.24-.58-1.02-.21-1.95-.9-2.09-2.05-.02-.17.1-.31.27-.34 1.9-.31 2.97-1.45 3.44-2.5.08-.17.27-.28.56-.24.96.14 1.89-.08 2.39-.77.36-.5.43-1.37-.05-2.12-.57-.89-1.41-1.28-1.92-1.48-.18-.07-.25-.2-.15-.42.29-.63.69-1.83.69-3.08 0-3.59-2.92-6.84-7.39-6.84z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    'mug-hot': `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    phone: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    store: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    cart: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    tag: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`
  };

  const LINK_TYPES = [
    {
      id: 'instagram',
      label: 'إنستجرام',
      defaultTitle: 'إنستجرام',
      iconKey: 'instagram',
      bgStyle: 'background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);',
      placeholder: 'https://instagram.com/username'
    },
    {
      id: 'facebook',
      label: 'فيسبوك',
      defaultTitle: 'فيسبوك',
      iconKey: 'facebook',
      bgStyle: 'background: #1877f2;',
      placeholder: 'https://facebook.com/username'
    },
    {
      id: 'whatsapp',
      label: 'واتساب',
      defaultTitle: 'واتساب',
      iconKey: 'whatsapp',
      bgStyle: 'background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);',
      placeholder: 'https://wa.me/201503773224'
    },
    {
      id: 'tiktok',
      label: 'تيك توك',
      defaultTitle: 'تيك توك',
      iconKey: 'tiktok',
      bgStyle: 'background: #000000; border: 1px solid rgba(255,255,255,0.2);',
      placeholder: 'https://tiktok.com/@username'
    },
    {
      id: 'x',
      label: 'إكس',
      defaultTitle: 'إكس (تويتر)',
      iconKey: 'x',
      bgStyle: 'background: #000000; border: 1px solid rgba(255,255,255,0.2);',
      placeholder: 'https://x.com/username'
    },
    {
      id: 'youtube',
      label: 'يوتيوب',
      defaultTitle: 'يوتيوب',
      iconKey: 'youtube',
      bgStyle: 'background: #ff0000;',
      placeholder: 'https://youtube.com/@channel'
    },
    {
      id: 'email',
      label: 'إيميل',
      defaultTitle: 'راسلنا عبر الإيميل',
      iconKey: 'email',
      bgStyle: 'background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);',
      placeholder: 'mailto:contact@example.com'
    },
    {
      id: 'reviews',
      label: 'تقييمات',
      defaultTitle: 'تقييمات Google Reviews',
      iconKey: 'reviews',
      bgStyle: 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);',
      placeholder: 'https://g.page/r/...'
    },
    {
      id: 'link',
      label: 'لينك مخصص',
      defaultTitle: 'رابط موقعنا',
      iconKey: 'link',
      bgStyle: 'background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);',
      placeholder: 'https://example.com'
    }
  ];

  const Icons = {
    SVGS,
    TYPES: LINK_TYPES,
    
    renderBadge: function (typeKey, sizeClass = 'w-7 h-7 text-xs') {
      const type = LINK_TYPES.find(t => t.id === typeKey || t.iconKey === typeKey) || LINK_TYPES[8];
      const svg = SVGS[typeKey] || SVGS[type.iconKey] || SVGS['link'];

      return `
        <div class="${sizeClass} rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm p-1.5" style="${type.bgStyle}">
          ${svg}
        </div>
      `;
    },

    getSvg: function (key) {
      return SVGS[key] || SVGS['link'];
    }
  };

  // ==============================================================================
  // 2. SECURITY & SANITIZATION HELPERS
  // ==============================================================================
  const Security = {
    escapeHTML: function (str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    isValidUrl: function (url) {
      if (!url) return false;
      try {
        const parsed = new URL(url);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
      } catch (e) {
        return false;
      }
    },

    generateSlug: function (prefix = 'tq') {
      const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${prefix}-${result}`;
    },

    sanitizeSlug: function (str) {
      if (!str) return 'sys-' + Math.random().toString(36).substring(2, 8);
      const cleaned = str
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s_-]/gu, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return cleaned || ('sys-' + Math.random().toString(36).substring(2, 8));
    },

    isUUID: function (str) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    }
  };

  // ==============================================================================
  // 3. ERROR FORMATTER (Clear Arabic User Messages)
  // ==============================================================================
  function formatArabicError(err) {
    if (!err) return new Error('حدث خطأ غير متوقع، يرجى إعادة المحاولة.');
    const msg = err.message || (typeof err === 'string' ? err : JSON.stringify(err));

    if (msg.includes('Invalid login credentials') || msg.includes('invalid_grant')) {
      return new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
    if (msg.includes('User already registered') || msg.includes('already registered')) {
      return new Error('البريد الإلكتروني مسجل بالفعل مسبقاً، يمكنك تسجيل الدخول مباشرة.');
    }
    if (msg.includes('Password should be at least') || msg.includes('weak_password')) {
      return new Error('كلمة المرور ضعيفة! يجب أن تكون 6 أحرف أو أرقام على الأقل.');
    }
    if (msg.includes('duplicate key') || msg.includes('unique constraint') || msg.includes('profiles_username_key') || msg.includes('systems_slug_key')) {
      return new Error('اسم المستخدم أو الرابط المختصر مستخدم بالفعل، يرجى اختيار اسم آخر.');
    }
    if (msg.includes('Failed to fetch') || msg.includes('network') || msg.includes('NetworkError')) {
      return new Error('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت.');
    }
    if (msg.includes('row-level security') || msg.includes('violates row-level security policy')) {
      return new Error('ليس لديك صلاحية لتنفيذ هذا الإجراء.');
    }
    if (msg.includes('JWT') || msg.includes('token') || msg.includes('session_not_found')) {
      return new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.');
    }
    if (msg.includes('Email not confirmed')) {
      return new Error('يرجى تفعيل بريدك الإلكتروني أولاً أو مراجعة إعدادات المصادقة.');
    }
    if (msg.includes('Bucket not found')) {
      return new Error('مساحة تخزين الملفات غير متوفرة، يرجى تشغيل سكربت قاعدة البيانات.');
    }

    return new Error(msg);
  }

  // ==============================================================================
  // 4. SUPABASE DATA API LAYER
  // ==============================================================================
  const getClient = () => {
    const client = window.getSupabase ? window.getSupabase() : window.supabaseClient;
    if (!client) {
      throw new Error('تعذر الاتصال بمزود الخدمة (Supabase). تأكد من تحميل السكربتات بنجاح.');
    }
    return client;
  };

  const API = {
    // ---------------- AUTHENTICATION ----------------
    

    signIn: async function (email, password) {
      const client = getClient();
      email = email.trim().toLowerCase();

      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw formatArabicError(error);

        // Fetch user profile immediately
        const profile = await this.getCurrentProfile();
        return { ...data.user, profile };
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    signOut: async function () {
      const client = getClient();
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('SignOut warning:', err);
      }
      localStorage.removeItem('taqeemk_active_system_id');
      window.location.href = 'index.html';
    },

    getSession: async function () {
      const client = getClient();
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error) return null;
        return session;
      } catch (e) {
        return null;
      }
    },

    getCurrentUser: async function () {
      const client = getClient();
      try {
        const { data: { user }, error } = await client.auth.getUser();
        if (error) return null;
        return user;
      } catch (e) {
        return null;
      }
    },

    getCurrentSession: function () {
      // Synchronous helper for instant checks using Supabase's local storage session
      try {
        const raw = localStorage.getItem('taqeemk_supabase_auth') || localStorage.getItem('sb-fdthxmvyythghpqurfpn-auth-token');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.user || (parsed.currentSession && parsed.currentSession.user))) {
            return { user: parsed.user || parsed.currentSession.user };
          }
        }
      } catch (e) {}
      return null;
    },

    // ---------------- PROFILES ----------------
    getCurrentProfile: async function () {
      const client = getClient();
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError || !user) return null;

      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw formatArabicError(error);

        // If profile was not generated by trigger yet, create a fallback record
        if (!data) {
          const rawName = user.user_metadata?.display_name || user.email.split('@')[0];
          const rawUser = user.user_metadata?.username || (user.email.split('@')[0] + '_' + user.id.substring(0, 4));
          const cleanUser = Security.sanitizeSlug(rawUser);

          const fallbackProfile = {
            id: user.id,
            email: user.email,
            username: cleanUser,
            display_name: rawName,
            is_admin: false,
            is_active: false,
            theme_color: '#6366f1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data: created } = await client
            .from('profiles')
            .upsert(fallbackProfile)
            .select()
            .maybeSingle();

          return created || fallbackProfile;
        }

        return data;
      } catch (err) {
        console.error('Error fetching current profile:', err);
        return null;
      }
    },

    getProfileById: async function (userId) {
      if (!userId) return null;
      const client = getClient();
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw formatArabicError(error);
        return data || null;
      } catch (err) {
        console.warn('Error fetching profile by ID:', err);
        return null;
      }
    },

    updateProfile: async function (userId, data) {
      const client = getClient();
      data.updated_at = new Date().toISOString();
      delete data.id;
      delete data.created_at;

      try {
        const { data: updated, error } = await client
          .from('profiles')
          .update(data)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return updated;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    // ---------------- SYSTEMS / "ملفاتك" (Unlimited Multi-Systems) ----------------
    getSystems: async function (userId) {
      const client = getClient();
      console.log('Taqeemk.API.getSystems called for userId:', userId);
      try {
        const { data, error } = await client
          .from('systems')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Taqeemk.API.getSystems DB query error:', error);
          throw formatArabicError(error);
        }

        console.log('Taqeemk.API.getSystems query result from Supabase:', data);

        // If user has no systems yet, auto-create their default system
        if (!data || data.length === 0) {
          console.log('User has 0 systems in DB. Auto-creating default system...');
          const profile = await this.getCurrentProfile();
          const cleanSlug = profile?.username || ('system_' + userId.substring(0, 6));
          const defaultSys = {
            user_id: userId,
            slug: cleanSlug,
            title: profile?.display_name || 'ملفي الشخصي',
            bio: profile?.bio || 'مرحباً بكم في صفحتي على تقييمك',
            avatar_url: profile?.avatar_url || '',
            cover_url: profile?.cover_url || '',
            theme_color: profile?.theme_color || '#6366f1',
            theme_style: 'glass',
            theme: profile?.theme || 'aurora',
            header_layout: profile?.header_layout || 'cover',
            button_style: 'rounded-xl',
            social_links: profile?.social_links || {},
            is_default: true,
            is_active: true
          };

          try {
            const created = await this.createSystem(userId, defaultSys);
            if (created) {
              console.log('Default system auto-created in getSystems:', created);
              return [created];
            }
          } catch (createErr) {
            console.error('Could not auto-create default system in getSystems:', createErr);
          }
        }

        return data || [];
      } catch (err) {
        console.error('Taqeemk.API.getSystems caught exception:', err);
        throw formatArabicError(err);
      }
    },

    createSystem: async function (userId, data) {
      const client = getClient();
      const baseSlug = Security.sanitizeSlug(data.slug || data.title || ('user_' + userId.substring(0, 5)));

      const newSystem = {
        user_id: userId,
        title: data.title || 'ملف جديد',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        cover_url: data.cover_url || '',
        theme_color: data.theme_color || '#6366f1',
        theme_style: data.theme_style || 'glass',
        theme: data.theme || 'aurora',
        header_layout: data.header_layout || 'cover',
        button_style: data.button_style || 'rounded-xl',
        social_links: data.social_links || {},
        is_default: data.is_default !== undefined ? data.is_default : false,
        is_active: true
      };

      let candidateSlug = baseSlug;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data: created, error } = await client
            .from('systems')
            .insert({ ...newSystem, slug: candidateSlug })
            .select()
            .single();

          if (!error && created) {
            console.log('System created successfully in Supabase:', created);
            return created;
          }
          if (error) {
            console.warn(`createSystem attempt ${attempt + 1} error:`, error);
            if (error.code === '23505' || error.message?.includes('systems_slug_key') || error.message?.includes('duplicate key')) {
              candidateSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
              continue;
            }
            throw formatArabicError(error);
          }
        } catch (err) {
          if (attempt === 2) throw formatArabicError(err);
          candidateSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
      }
    },

    updateSystem: async function (systemId, data) {
      const client = getClient();
      data.updated_at = new Date().toISOString();
      delete data.id;
      delete data.user_id;
      delete data.created_at;

      try {
        const { data: updated, error } = await client
          .from('systems')
          .update(data)
          .eq('id', systemId)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return updated;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    deleteSystem: async function (systemId) {
      const client = getClient();
      try {
        const { error } = await client
          .from('systems')
          .delete()
          .eq('id', systemId);

        if (error) throw formatArabicError(error);
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    getSystemBySlug: async function (slug) {
      const client = getClient();
      slug = Security.sanitizeSlug(slug);

      try {
        let { data, error } = await client
          .from('systems')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        // Fallback: check if slug matches a profile username, and fetch that user's default system
        if (!data) {
          const { data: profile } = await client
            .from('profiles')
            .select('id')
            .eq('username', slug)
            .maybeSingle();

          if (profile) {
            const { data: sysData } = await client
              .from('systems')
              .select('*')
              .eq('user_id', profile.id)
              .order('is_default', { ascending: false })
              .limit(1)
              .maybeSingle();

            data = sysData;
          }
        }

        return data || null;
      } catch (err) {
        console.warn('Error fetching system by slug:', err);
        return null;
      }
    },

    incrementSystemView: async function (systemId) {
      const client = getClient();
      try {
        await client.rpc('increment_system_view', { system_row_id: systemId });
      } catch (err) {
        console.warn('incrementSystemView RPC call ignored:', err);
      }
    },

    getActiveSystemId: function () {
      return localStorage.getItem('taqeemk_active_system_id');
    },

    setActiveSystemId: function (systemId) {
      localStorage.setItem('taqeemk_active_system_id', systemId);
    },

    // ---------------- LISTS / CATEGORIES ----------------
    getLists: async function (userId, systemId = null) {
      const client = getClient();
      try {
        let query = client.from('lists').select('*').eq('user_id', userId);
        if (systemId) {
          query = query.eq('system_id', systemId);
        }
        const { data, error } = await query.order('sort_order', { ascending: true });
        if (error) throw formatArabicError(error);
        return data || [];
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    createList: async function (userId, listData, systemId = null) {
      const client = getClient();
      const newList = {
        user_id: userId,
        system_id: systemId || listData.system_id || null,
        title: listData.title,
        description: listData.description || '',
        icon: listData.icon || 'folder',
        color: listData.color || '#6366f1',
        is_visible: true,
        sort_order: listData.sort_order || 0
      };

      try {
        const { data, error } = await client
          .from('lists')
          .insert(newList)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    deleteList: async function (listId) {
      const client = getClient();
      try {
        const { error } = await client
          .from('lists')
          .delete()
          .eq('id', listId);

        if (error) throw formatArabicError(error);
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    // ---------------- LINKS ----------------
    getLinks: async function (userId, systemId = null) {
      const client = getClient();
      try {
        let query = client.from('links').select('*').eq('user_id', userId);
        if (systemId) {
          query = query.eq('system_id', systemId);
        }
        const { data, error } = await query.order('sort_order', { ascending: true });
        if (error) throw formatArabicError(error);
        return data || [];
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    createLink: async function (userId, linkData, systemId = null) {
      const client = getClient();
      const newLink = {
        user_id: userId,
        system_id: systemId || linkData.system_id || null,
        list_id: linkData.list_id || null,
        title: linkData.title,
        url: linkData.url,
        icon: linkData.icon || 'link',
        is_active: true,
        click_count: 0,
        sort_order: linkData.sort_order || 0
      };

      try {
        const { data, error } = await client
          .from('links')
          .insert(newLink)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    updateLink: async function (linkId, data) {
      const client = getClient();
      delete data.id;
      delete data.user_id;
      delete data.created_at;

      try {
        const { data: updated, error } = await client
          .from('links')
          .update(data)
          .eq('id', linkId)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return updated;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    deleteLink: async function (linkId) {
      const client = getClient();
      try {
        const { error } = await client
          .from('links')
          .delete()
          .eq('id', linkId);

        if (error) throw formatArabicError(error);
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    incrementLinkClick: async function (linkId) {
      const client = getClient();
      try {
        await client.rpc('increment_link_click', { link_row_id: linkId });
      } catch (err) {
        console.warn('incrementLinkClick RPC call ignored:', err);
      }
    },

    // ---------------- QR CODES ----------------
    getQRCodes: async function (userId, systemId = null) {
      const client = getClient();
      try {
        let query = client.from('qr_codes').select('*').eq('user_id', userId);
        if (systemId) {
          query = query.eq('system_id', systemId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw formatArabicError(error);
        return data || [];
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    createQRCode: async function (userId, qrData, systemId = null) {
      const client = getClient();
      const slug = qrData.type === 'dynamic' ? Security.generateSlug() : null;

      const newQR = {
        user_id: userId,
        system_id: systemId || qrData.system_id || null,
        list_id: qrData.list_id || null,
        title: qrData.title,
        type: qrData.type,
        content_type: qrData.content_type || 'url',
        target_url: qrData.target_url,
        short_slug: slug,
        fg_color: qrData.fg_color || '#0f172a',
        bg_color: qrData.bg_color || '#ffffff',
        corner_style: qrData.corner_style || 'extra-rounded',
        logo_url: qrData.logo_url || '',
        scan_count: 0,
        is_active: true
      };

      try {
        const { data, error } = await client
          .from('qr_codes')
          .insert(newQR)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    updateQRCode: async function (qrId, data) {
      const client = getClient();
      data.updated_at = new Date().toISOString();
      delete data.id;
      delete data.user_id;
      delete data.created_at;

      try {
        const { data: updated, error } = await client
          .from('qr_codes')
          .update(data)
          .eq('id', qrId)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return updated;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    deleteQRCode: async function (qrId) {
      const client = getClient();
      try {
        const { error } = await client
          .from('qr_codes')
          .delete()
          .eq('id', qrId);

        if (error) throw formatArabicError(error);
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    getQRCodeBySlugOrId: async function (identifier) {
      const client = getClient();
      try {
        let query = client.from('qr_codes').select('*');
        if (Security.isUUID(identifier)) {
          query = query.or(`id.eq.${identifier},short_slug.eq.${identifier}`);
        } else {
          query = query.eq('short_slug', identifier);
        }
        const { data, error } = await query.maybeSingle();
        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        console.warn('Error finding QR code:', err);
        return null;
      }
    },

    recordQRScan: async function (qrId) {
      const client = getClient();
      try {
        await client.from('qr_scans').insert({
          qr_id: qrId,
          device_type: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
          browser: navigator.userAgent.substring(0, 50),
          referrer: document.referrer || 'Direct'
        });
      } catch (err) {
        console.warn('Error recording QR scan:', err);
      }
    },

    // ---------------- UNIVERSAL IMAGE UPLOADER ----------------
    uploadImage: async function (file, bucketName = 'avatars') {
      if (!file) throw new Error('لم يتم تحديد ملف');
      const client = getClient();

      try {
        const fileExt = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
        const fileName = `${bucketName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await client.storage
          .from(bucketName)
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw formatArabicError(uploadError);

        const { data } = client.storage.from(bucketName).getPublicUrl(fileName);
        return data.publicUrl;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    uploadReceiptImage: async function (file) {
      return this.uploadImage(file, 'receipts');
    },

    // ---------------- PAYMENTS & MONETIZATION ----------------
    submitPaymentReceipt: async function (userId, userEmail, senderNumber, transactionRef, receiptUrl) {
      const client = getClient();
      const payment = {
        user_id: userId,
        user_email: userEmail,
        amount: window.TAQEEMK_CONFIG.ACTIVATION_FEE_EGP,
        currency: 'EGP',
        target_wallet: window.TAQEEMK_CONFIG.TARGET_WALLET_NUMBER,
        sender_number: senderNumber,
        transaction_ref: transactionRef || '',
        receipt_url: receiptUrl,
        status: 'pending'
      };

      try {
        const { data, error } = await client
          .from('payments')
          .insert(payment)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    getUserLatestPayment: async function (userId) {
      const client = getClient();
      try {
        const { data, error } = await client
          .from('payments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw formatArabicError(error);
        return data || null;
      } catch (err) {
        console.warn('Error fetching latest user payment:', err);
        return null;
      }
    },

    // ---------------- ADMIN OPERATIONS ----------------
    getAllUsers: async function () {
      const client = getClient();
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw formatArabicError(error);
        return data || [];
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    toggleUserStatus: async function (userId, isActive) {
      const client = getClient();
      try {
        const updatePayload = { is_active: isActive };
        if (isActive) {
          const d = new Date();
          d.setMonth(d.getMonth() + 5);
          updatePayload.subscription_ends_at = d.toISOString();
        }

        const { data, error } = await client
          .from('profiles')
          .update(updatePayload)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    toggleUserVerification: async function (userId, isVerified) {
      const client = getClient();
      try {
        const { data, error } = await client
          .from('profiles')
          .update({ is_verified: Boolean(isVerified) })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw formatArabicError(error);
        return data;
      } catch (err) {
        throw formatArabicError(err);
      }
    },

    isAccountDeactivated: function (profile) {
      if (!profile) return false;
      if (profile.is_admin === true) return false;

      const now = new Date();

      // Case 1: Account is active/paid
      if (profile.is_active) {
        if (profile.subscription_ends_at) {
          const subEnds = new Date(profile.subscription_ends_at);
          if (now > subEnds) {
            return true; // Subscription period (5 months) expired
          }
        }
        return false;
      }

      // Case 2: Account is unpaid
      let trialEnds = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
      if (!trialEnds && profile.created_at) {
        trialEnds = new Date(new Date(profile.created_at).getTime() + (2 * 24 * 60 * 60 * 1000));
      }

      if (trialEnds && now > trialEnds) {
        return true; // 2-day Grace period expired without payment
      }

      return false; // Still within grace period
    },

    getGraceTimeRemaining: function (profile) {
      if (!profile) return null;
      if (profile.is_admin === true || profile.is_active === true) return null;

      let trialEnds = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
      if (!trialEnds && profile.created_at) {
        trialEnds = new Date(new Date(profile.created_at).getTime() + (2 * 24 * 60 * 60 * 1000));
      }

      if (!trialEnds) return null;

      const diffMs = trialEnds.getTime() - Date.now();
      if (diffMs <= 0) {
        return { inGrace: false, expired: true, hours: 0, minutes: 0, totalMinutes: 0, formattedText: 'انتهت المهلة' };
      }

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      let formattedText = '';
      if (hours > 0) {
        formattedText = `${hours} ساعة و ${minutes} دقيقة`;
      } else {
        formattedText = `${minutes} دقيقة`;
      }

      return {
        inGrace: true,
        expired: false,
        hours,
        minutes,
        totalMinutes,
        formattedText
      };
    },

    cleanPhoneToWhatsApp: function (phoneStr) {
      if (!phoneStr) return '';
      let str = String(phoneStr).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
      str = str.replace(/[^\d+]/g, '');
      if (str.startsWith('+')) str = str.substring(1);
      if (str.startsWith('00')) str = str.substring(2);

      if (str.startsWith('01') && str.length === 11) {
        str = '2' + str;
      } else if (str.startsWith('1') && str.length === 10) {
        str = '20' + str;
      }

      return `https://wa.me/${str}`;
    },

    getTotalSystemsCount: async function () {
      const client = getClient();
      try {
        const { count, error } = await client
          .from('systems')
          .select('id', { count: 'exact', head: true });

        if (error) return 0;
        return count || 0;
      } catch (e) {
        return 0;
      }
    }
  };

  // ==============================================================================
  // 5. QR CODE RENDERING ENGINE (HIGH RESOLUTION & CLIENT-SIDE EXPORT)
  // ==============================================================================
  const QREngine = {
    render: function (elementId, data, options = {}) {
      const container = document.getElementById(elementId);
      if (!container) return null;
      container.innerHTML = '';

      const fgColor = options.fg_color || '#000000';
      const bgColor = options.bg_color || '#ffffff';
      const size = options.size || 256;
      const margin = options.margin !== undefined ? options.margin : 16;
      const qrData = String(data || '').trim();

      container._qrData = qrData;

      if (typeof QRCodeStyling !== 'undefined') {
        const dotType = options.high_compatibility
          ? 'square'
          : (options.corner_style === 'extra-rounded' ? 'rounded' : (options.corner_style === 'rounded' ? 'dots' : 'square'));

        const cornerSquareType = options.high_compatibility
          ? 'square'
          : (options.corner_style === 'extra-rounded' ? 'extra-rounded' : 'square');

        const qrCode = new QRCodeStyling({
          width: size,
          height: size,
          data: qrData,
          margin: margin,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
          },
          dotsOptions: {
            color: fgColor,
            type: dotType
          },
          backgroundOptions: {
            color: bgColor
          },
          cornersSquareOptions: {
            color: fgColor,
            type: cornerSquareType
          },
          cornersDotOptions: {
            color: fgColor,
            type: options.high_compatibility ? 'square' : 'dot'
          },
          image: options.logo_url || undefined,
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 4
          }
        });
        qrCode.append(container);
        container._qrInstance = qrCode;
        return qrCode;
      } else if (typeof QRCode !== 'undefined') {
        const qr = new QRCode(container, {
          text: qrData,
          width: size - (margin * 2),
          height: size - (margin * 2),
          colorDark: fgColor,
          colorLight: bgColor,
          correctLevel: QRCode.CorrectLevel.Q
        });
        container.style.backgroundColor = bgColor;
        container.style.padding = `${margin}px`;
        container._qrInstance = qr;
        return qr;
      } else {
        const img = document.createElement('img');
        const encodedData = encodeURIComponent(qrData);
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&margin=${Math.round(margin / 4)}`;
        img.alt = 'QR Code';
        img.className = 'w-full h-full object-contain rounded-lg';
        container.appendChild(img);
        return null;
      }
    },

    downloadPNG: async function (dataOrElementId, filename = 'taqeemk-qrcode.png', size = 1024) {
      let data = dataOrElementId;
      if (document.getElementById(dataOrElementId)) {
        const container = document.getElementById(dataOrElementId);
        data = container._qrData || '';
      }
      data = String(data || '').trim();
      if (!data) return;

      const safeFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
      const margin = Math.round(size * 0.05); // ~50px quiet zone for 1024x1024

      if (typeof QRCodeStyling !== 'undefined') {
        const exportQr = new QRCodeStyling({
          width: size,
          height: size,
          data: data,
          margin: margin,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
          },
          dotsOptions: {
            color: '#000000',
            type: 'square'
          },
          backgroundOptions: {
            color: '#ffffff'
          },
          cornersSquareOptions: {
            color: '#000000',
            type: 'square'
          },
          cornersDotOptions: {
            color: '#000000',
            type: 'square'
          }
        });

        try {
          const blob = await exportQr.getRawData('png');
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = safeFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            return;
          }
        } catch (e) {
          console.warn('getRawData failed, falling back to qr.download:', e);
        }

        exportQr.download({ name: safeFilename.replace(/\.png$/i, ''), extension: 'png' });
        return;
      }

      // Fallback via offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      if (typeof QRCode !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        new QRCode(tempDiv, {
          text: data,
          width: size - (margin * 2),
          height: size - (margin * 2),
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.Q
        });
        setTimeout(() => {
          const qrCanvas = tempDiv.querySelector('canvas');
          if (qrCanvas) {
            ctx.drawImage(qrCanvas, margin, margin);
          }
          const link = document.createElement('a');
          link.download = safeFilename;
          link.href = canvas.toDataURL('image/png');
          link.click();
          document.body.removeChild(tempDiv);
        }, 100);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, margin, margin, size - (margin * 2), size - (margin * 2));
          const link = document.createElement('a');
          link.download = safeFilename;
          link.href = canvas.toDataURL('image/png');
          link.click();
        };
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=000000&bgcolor=ffffff`;
      }
    },

    downloadSVG: async function (dataOrElementId, filename = 'taqeemk-qrcode.svg', size = 1024) {
      let data = dataOrElementId;
      if (document.getElementById(dataOrElementId)) {
        const container = document.getElementById(dataOrElementId);
        data = container._qrData || '';
      }
      data = String(data || '').trim();
      if (!data) return;

      const safeFilename = filename.endsWith('.svg') ? filename : `${filename}.svg`;
      const margin = Math.round(size * 0.05);

      if (typeof QRCodeStyling !== 'undefined') {
        const exportQr = new QRCodeStyling({
          width: size,
          height: size,
          type: 'svg',
          data: data,
          margin: margin,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
          },
          dotsOptions: {
            color: '#000000',
            type: 'square'
          },
          backgroundOptions: {
            color: '#ffffff'
          },
          cornersSquareOptions: {
            color: '#000000',
            type: 'square'
          },
          cornersDotOptions: {
            color: '#000000',
            type: 'square'
          }
        });

        try {
          const blob = await exportQr.getRawData('svg');
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = safeFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            return;
          }
        } catch (e) {
          console.warn('getRawData svg failed, falling back to qr.download:', e);
        }

        exportQr.download({ name: safeFilename.replace(/\.svg$/i, ''), extension: 'svg' });
      }
    },

    download: function (elementId, filename = 'taqeemk-qrcode.png') {
      const container = document.getElementById(elementId);
      if (!container) return;
      if (container._qrData) {
        this.downloadPNG(container._qrData, filename, 1024);
        return;
      }
      const canvas = container.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        return;
      }
      const img = container.querySelector('img');
      if (img) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = img.src;
        link.target = '_blank';
        link.click();
      }
    }
  };

  // ==============================================================================
  // 6. NOTIFICATION & CELEBRATION UTILS
  // ==============================================================================
  const UI = {
    showToast: function (message, icon = 'success') {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: icon,
          title: message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#1e293b',
          color: '#f8fafc'
        });
      } else {
        alert(message);
      }
    },

    celebrate: function () {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Expose Global Modules
  window.Taqeemk = {
    Icons,
    Security,
    API,
    QREngine,
    UI
  };

})();
