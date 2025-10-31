(function(window){
  'use strict';
  window.App = window.App || {};

  // Storage helpers with JSON support and safe guards
  window.App.Storage = {
    get: function(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v !== null ? v : fallback;
      } catch (e) {
        console.warn('Storage get failed', e);
        return fallback;
      }
    },
    set: function(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { console.warn('Storage set failed', e); }
    },
    remove: function(key) {
      try { localStorage.removeItem(key); } catch (e) { console.warn('Storage remove failed', e); }
    },
    getJSON: function(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        if (v === null) return fallback;
        return JSON.parse(v);
      } catch (e) {
        console.warn('Storage parse failed', e);
        return fallback;
      }
    },
    setJSON: function(key, obj) {
      try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { console.warn('Storage JSON set failed', e); }
    }
  };

  // Utilities and validators
  window.App.Utils = {
    uid: function(prefix){ return (prefix || 'id_') + Math.random().toString(36).slice(2,9); },
    debounce: function(fn, wait){
      var t; return function(){
        var ctx = this, args = arguments;
        clearTimeout(t);
        t = setTimeout(function(){ fn.apply(ctx, args); }, wait);
      };
    },
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
    validateEmail: function(email){ return window.App.Utils.emailRegex.test(String(email || '').trim()); },
    currency: function(n){ try { return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits: 0 }).format(n); } catch(e){ return '$' + Math.round(n); } },
    clamp: function(n, min, max){ return Math.max(min, Math.min(max, n)); }
  };

  // Motion settings
  window.App.Prefs = {
    reducedMotion: (function(){
      try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; }
    })()
  };

})(window);
