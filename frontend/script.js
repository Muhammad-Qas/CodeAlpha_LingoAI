'use strict';

/* ==========================================================================
   LingoAI — script.js
   Talks ONLY to the Flask backend at POST /api/translate.
   No translation logic and no API keys live in this file.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Configuration — the ONLY place the API base URL is set.

   - If index.html is served BY Flask itself (e.g. Flask serves the static
     files), leave this as an empty string so requests go to the same origin.
   - If you're running the frontend separately during development (e.g. a
     live-server on a different port) while Flask runs on 127.0.0.1:5000,
     set it to that origin instead.
   -------------------------------------------------------------------------- */
const API_BASE_URL = "";
const TRANSLATE_ENDPOINT = `${API_BASE_URL}/api/translate`;
const MAX_CHARACTERS = 5000;

/* Display names for languages, used only for UI text (e.g. the detected
   language note). This mirrors the <option> values in index.html and is
   never sent to the backend as anything other than the language code. */
const LANGUAGES = {
  auto: 'Auto Detect',
  en: 'English',
  ur: 'Urdu',
  hi: 'Hindi',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  pl: 'Polish',
  ru: 'Russian',
  ja: 'Japanese',
  zh: 'Chinese',
  ko: 'Korean',
  tr: 'Turkish',
};

/* --------------------------------------------------------------------------
   Element references
   -------------------------------------------------------------------------- */
let els = {};
let isTranslating = false;
let lastTranslation = null; // { text, source, target }

function cacheElements() {
  els = {
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navLinks: document.getElementById('navLinks'),

    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    swapBtn: document.getElementById('swapBtn'),
    detectedLangNote: document.getElementById('detectedLangNote'),

    sourceText: document.getElementById('sourceText'),
    charCount: document.getElementById('charCount'),
    clearBtn: document.getElementById('clearBtn'),

    outputText: document.getElementById('outputText'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    copyFeedback: document.getElementById('copyFeedback'),

    translateBtn: document.getElementById('translateBtn'),
    errorMessage: document.getElementById('errorMessage'),
  };
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */
function initializeApp() {
  cacheElements();
  bindNavbar();
  bindMobileMenu();
  bindRevealAnimations();
  bindTranslatorEvents();
  updateCharacterCount();
  updateSwapAvailability();
}

document.addEventListener('DOMContentLoaded', initializeApp);

/* --------------------------------------------------------------------------
   Navbar: compact-on-scroll
   -------------------------------------------------------------------------- */
function bindNavbar() {
  if (!els.navbar) return;
  const onScroll = () => {
    els.navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   Mobile menu
   -------------------------------------------------------------------------- */
function bindMobileMenu() {
  if (!els.hamburger || !els.navLinks) return;

  const closeMenu = () => {
    els.hamburger.setAttribute('aria-expanded', 'false');
    els.navLinks.classList.remove('is-open');
  };

  const toggleMenu = () => {
    const isOpen = els.navLinks.classList.toggle('is-open');
    els.hamburger.setAttribute('aria-expanded', String(isOpen));
  };

  els.hamburger.addEventListener('click', toggleMenu);
  els.navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* --------------------------------------------------------------------------
   Scroll reveal for sections
   -------------------------------------------------------------------------- */
function bindRevealAnimations() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Translator: event wiring
   -------------------------------------------------------------------------- */
function bindTranslatorEvents() {
  els.sourceText.addEventListener('input', updateCharacterCount);
  els.clearBtn.addEventListener('click', clearSourceText);
  els.sourceLang.addEventListener('change', updateSwapAvailability);
  els.swapBtn.addEventListener('click', swapLanguages);
  els.translateBtn.addEventListener('click', handleTranslation);
  els.copyBtn.addEventListener('click', copyTranslation);
  els.downloadBtn.addEventListener('click', downloadTranslation);

  els.sourceText.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTranslation();
    }
  });
}

/* --------------------------------------------------------------------------
   Character counter
   -------------------------------------------------------------------------- */
function updateCharacterCount() {
  const length = els.sourceText.value.length;
  els.charCount.textContent = `${length} / ${MAX_CHARACTERS}`;
  els.charCount.classList.toggle('is-over', length > MAX_CHARACTERS);
}

function clearSourceText() {
  els.sourceText.value = '';
  updateCharacterCount();
  els.sourceText.focus();
}

/* --------------------------------------------------------------------------
   Swap languages (and, when a translation exists, swap the text too)
   -------------------------------------------------------------------------- */
function updateSwapAvailability() {
  const isAuto = els.sourceLang.value === 'auto';
  els.swapBtn.disabled = isAuto;
  els.swapBtn.title = isAuto ? "Can't swap while Source is Auto Detect" : 'Swap languages';
}

function swapLanguages() {
  if (els.sourceLang.value === 'auto') return;

  const prevSource = els.sourceLang.value;
  const prevTarget = els.targetLang.value;
  els.sourceLang.value = prevTarget;
  els.targetLang.value = prevSource;
  updateSwapAvailability();

  if (lastTranslation && lastTranslation.text) {
    const outputPlain = getOutputPlainText();
    els.sourceText.value = outputPlain;
    updateCharacterCount();
    resetOutput();
  }

  hideError();
}

/* --------------------------------------------------------------------------
   Translate
   -------------------------------------------------------------------------- */
async function handleTranslation() {
  if (isTranslating) return;

  hideError();
  hideDetectedLang();

  const text = els.sourceText.value.trim();
  const source = els.sourceLang.value;
  const target = els.targetLang.value;

  if (!text) {
    showError('Enter some text to translate.');
    els.sourceText.focus();
    return;
  }
  if (text.length > MAX_CHARACTERS) {
    showError(`Your text is over the ${MAX_CHARACTERS.toLocaleString()} character limit.`);
    return;
  }
  if (!target) {
    showError('Choose a target language.');
    return;
  }
  if (source !== 'auto' && source === target) {
    showError('Source and target languages are the same — choose a different target.');
    return;
  }

  showLoading();

  try {
    const response = await fetch(TRANSLATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source, target }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch (parseErr) {
      data = null;
    }

    if (!response.ok) {
      const message = (data && data.error) || `The translation service returned an error (${response.status}).`;
      throw new Error(message);
    }
    if (!data || typeof data.translation !== 'string') {
      throw new Error('The translation service returned an unexpected response.');
    }

    showSuccess(data);
  } catch (err) {
    const message = err && err.message ? err.message : 'Something went wrong. Please try again.';
    showError(isNetworkError(err) ? "We couldn't reach the translation service. Check your connection and try again." : message);
    resetOutput();
  } finally {
    stopLoading();
  }
}

function isNetworkError(err) {
  return err instanceof TypeError;
}

/* --------------------------------------------------------------------------
   Output states
   -------------------------------------------------------------------------- */
function showLoading() {
  isTranslating = true;
  els.translateBtn.disabled = true;
  els.translateBtn.classList.add('is-loading');
  els.copyBtn.disabled = true;
  els.downloadBtn.disabled = true;

  els.outputText.classList.add('is-loading');
  els.outputText.innerHTML = 'Translating<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
}

function stopLoading() {
  isTranslating = false;
  els.translateBtn.disabled = false;
  els.translateBtn.classList.remove('is-loading');
}

function showSuccess(data) {
  lastTranslation = { text: data.translation, source: data.source, target: data.target };

  els.outputText.classList.remove('is-loading');
  els.outputText.textContent = data.translation;
  els.copyBtn.disabled = false;
  els.downloadBtn.disabled = false;

  if (els.sourceLang.value === 'auto' && data.source) {
    const name = LANGUAGES[data.source] || data.source.toUpperCase();
    els.detectedLangNote.textContent = `Detected: ${name}`;
    els.detectedLangNote.hidden = false;
  }
}

function resetOutput() {
  lastTranslation = null;
  els.outputText.classList.remove('is-loading');
  els.outputText.innerHTML = '<span class="output-text__placeholder">Your translation will appear here.</span>';
  els.copyBtn.disabled = true;
  els.downloadBtn.disabled = true;
}

function getOutputPlainText() {
  return lastTranslation ? lastTranslation.text : '';
}

function showError(message) {
  els.errorMessage.textContent = message;
  els.errorMessage.hidden = false;
}

function hideError() {
  els.errorMessage.hidden = true;
  els.errorMessage.textContent = '';
}

function hideDetectedLang() {
  els.detectedLangNote.hidden = true;
  els.detectedLangNote.textContent = '';
}

/* --------------------------------------------------------------------------
   Copy / Download
   -------------------------------------------------------------------------- */
async function copyTranslation() {
  const text = getOutputPlainText();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    flashCopyFeedback('Copied!');
  } catch (err) {
    flashCopyFeedback("Couldn't copy — select the text manually.");
  }
}

function flashCopyFeedback(message) {
  els.copyFeedback.textContent = message;
  els.copyFeedback.classList.add('is-visible');
  window.clearTimeout(flashCopyFeedback._t);
  flashCopyFeedback._t = window.setTimeout(() => {
    els.copyFeedback.classList.remove('is-visible');
  }, 2000);
}

function downloadTranslation() {
  const text = getOutputPlainText();
  if (!text) return;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'lingoai-translation.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
