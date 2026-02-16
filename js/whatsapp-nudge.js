/**
 * ============================================
 * OMZATO ACCOUNTING — WhatsApp Conversion Nudge System
 * Multi-layered WhatsApp popup triggers for lead generation
 * ============================================
 *
 * Triggers:
 *   1. Floating WhatsApp Button (always visible)
 *   2. Entry Popup (5 seconds after page load)
 *   3. Exit Intent Popup (cursor leaves viewport top)
 *   4. Scroll-based Trigger (50% page scroll)
 *   5. Time-based Trigger (45 seconds on page)
 *   6. Calculator Completion Trigger (exposed function)
 *   7. Service Page Trigger (exposed function)
 *   8. Idle User Trigger (30 seconds of no interaction)
 *
 * Rules:
 *   - Max 2 popups per session (floating button excluded)
 *   - No duplicate popups within session
 *   - 30-second cooldown after dismissal
 *   - 24-hour dismissal memory via localStorage
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     CONSTANTS
  ------------------------------------------------------- */
  var WA_NUMBER = '917986772124';
  var WA_BASE   = 'https://wa.me/' + WA_NUMBER + '?text=';

  var STORAGE_KEY_POPUPS   = 'omzato-wa-popups';   // localStorage — shown popup IDs + dismissal timestamps
  var SESSION_KEY_COUNT    = 'omzato-wa-count';     // sessionStorage — popup count this session
  var MAX_POPUPS_SESSION   = 2;
  var COOLDOWN_MS          = 30000;  // 30 seconds after dismiss
  var DISMISSAL_MEMORY_MS  = 86400000; // 24 hours

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */
  var lastDismissTime = 0;
  var activePopupId   = null;  // currently visible popup (only one at a time)
  var overlayEl       = null;
  var idleTimer       = null;
  var idleTriggered   = false;
  var scrollTriggered = false;
  var exitTriggered   = false;

  /* -------------------------------------------------------
     STORAGE HELPERS
  ------------------------------------------------------- */

  /** Return parsed localStorage data or default */
  function getStorageData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_POPUPS);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { shown: {}, dismissed: {} };
  }

  function saveStorageData(data) {
    try {
      localStorage.setItem(STORAGE_KEY_POPUPS, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function getSessionCount() {
    try {
      var val = sessionStorage.getItem(SESSION_KEY_COUNT);
      return val ? parseInt(val, 10) : 0;
    } catch (e) { return 0; }
  }

  function incrementSessionCount() {
    try {
      var count = getSessionCount() + 1;
      sessionStorage.setItem(SESSION_KEY_COUNT, String(count));
      return count;
    } catch (e) { return 999; }
  }

  /** Mark a popup as shown in both localStorage and sessionStorage */
  function markShown(popupId) {
    var data = getStorageData();
    data.shown[popupId] = Date.now();
    saveStorageData(data);
    incrementSessionCount();
  }

  /** Mark a popup as dismissed (24-hour memory) */
  function markDismissed(popupId) {
    var data = getStorageData();
    data.dismissed[popupId] = Date.now();
    saveStorageData(data);
    lastDismissTime = Date.now();
  }

  /** Check if we are allowed to show this popup */
  function canShow(popupId) {
    // Session limit
    if (getSessionCount() >= MAX_POPUPS_SESSION) return false;

    // Cooldown after last dismiss
    if (Date.now() - lastDismissTime < COOLDOWN_MS) return false;

    // Another popup currently active
    if (activePopupId) return false;

    var data = getStorageData();

    // Already shown this popup in this pageview / localStorage
    if (data.shown[popupId]) return false;

    // Dismissed within 24 hours
    if (data.dismissed[popupId]) {
      if (Date.now() - data.dismissed[popupId] < DISMISSAL_MEMORY_MS) return false;
      // Expired — remove stale entry
      delete data.dismissed[popupId];
      saveStorageData(data);
    }

    return true;
  }

  /* -------------------------------------------------------
     WHATSAPP LINK HELPER
  ------------------------------------------------------- */

  function waLink(message) {
    return WA_BASE + encodeURIComponent(message);
  }

  /* -------------------------------------------------------
     PAGE CONTEXT DETECTION
  ------------------------------------------------------- */

  function getPageType() {
    var path = window.location.pathname.toLowerCase();
    var title = (document.title || '').toLowerCase();

    if (path === '/' || path === '/index.html' || path === '/index' || path === '') return 'home';
    if (path.indexOf('service') !== -1 || path.indexOf('pricing') !== -1) return 'services';
    if (path.indexOf('calculator') !== -1 || path.indexOf('calc') !== -1 || title.indexOf('calculator') !== -1) return 'calculators';
    if (path.indexOf('contact') !== -1) return 'contact';
    if (path.indexOf('blog') !== -1 || path.indexOf('article') !== -1) return 'blog';
    if (path.indexOf('about') !== -1) return 'about';

    return 'default';
  }

  function getScrollContextMessage() {
    var type = getPageType();
    switch (type) {
      case 'home':        return 'Need expert tax help? Our team is online now!';
      case 'services':    return 'Want exact pricing for your case? Let\'s discuss!';
      case 'calculators': return 'Need help understanding your results?';
      default:            return 'Have questions? Chat with our team!';
    }
  }

  function getScrollContextWaMessage() {
    var type = getPageType();
    switch (type) {
      case 'home':        return 'Hi! I need expert tax help. Can your team assist me?';
      case 'services':    return 'Hi! I\'d like to discuss pricing for my specific case.';
      case 'calculators': return 'Hi! I need help understanding my calculator results.';
      default:            return 'Hi! I have some questions. Can you help?';
    }
  }

  /* -------------------------------------------------------
     SVG ICONS (inline, no external dependencies)
  ------------------------------------------------------- */

  var ICON_WHATSAPP = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>';

  var ICON_WHATSAPP_LG = '<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>';

  var ICON_CLOSE = '&times;';

  var ICON_GIFT = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>' +
    '</svg>';

  var ICON_CHAT = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
    '</svg>';

  var ICON_PERCENT = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' +
    '</svg>';

  var ICON_CALCULATOR = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="16" y2="18"/>' +
    '</svg>';

  var ICON_TAG = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>' +
    '</svg>';

  var ICON_CLOCK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' +
    '</svg>';

  /* -------------------------------------------------------
     DOM INJECTION HELPERS
  ------------------------------------------------------- */

  /** Create and return a DOM element from an HTML string */
  function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  /** Ensure overlay exists */
  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = htmlToElement('<div class="wa-popup-overlay" id="wa-overlay"></div>');
    document.body.appendChild(overlayEl);
    overlayEl.addEventListener('click', function () {
      if (activePopupId) {
        closePopup(activePopupId, true);
      }
    });
    return overlayEl;
  }

  /* -------------------------------------------------------
     POPUP OPEN / CLOSE ENGINE
  ------------------------------------------------------- */

  function showPopup(popupId, useOverlay) {
    if (!canShow(popupId)) return false;

    var el = document.getElementById(popupId);
    if (!el) return false;

    markShown(popupId);
    activePopupId = popupId;

    if (useOverlay) {
      ensureOverlay();
      overlayEl.classList.add('active');
    }

    // Small delay for CSS transition to kick in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('active');
      });
    });

    return true;
  }

  function closePopup(popupId, wasDismissed) {
    var el = document.getElementById(popupId);
    if (el) {
      el.classList.remove('active');
    }

    if (overlayEl) {
      overlayEl.classList.remove('active');
    }

    activePopupId = null;

    if (wasDismissed) {
      markDismissed(popupId);
    }
  }

  /** Attach close handlers to a popup's close/dismiss buttons */
  function attachCloseHandlers(popupId) {
    var el = document.getElementById(popupId);
    if (!el) return;

    var closeBtns = el.querySelectorAll('.wa-popup-close, .wa-popup-dismiss');
    for (var i = 0; i < closeBtns.length; i++) {
      closeBtns[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closePopup(popupId, true);
      });
    }

    // Close on WhatsApp button click (after opening link)
    var waBtns = el.querySelectorAll('.btn-whatsapp');
    for (var j = 0; j < waBtns.length; j++) {
      waBtns[j].addEventListener('click', function () {
        // Let the link open, then close popup
        setTimeout(function () {
          closePopup(popupId, false);
        }, 300);
      });
    }
  }

  /* -------------------------------------------------------
     1. FLOATING WHATSAPP BUTTON
  ------------------------------------------------------- */

  function injectFloatingButton() {
    var html =
      '<a class="wa-float" id="wa-float-btn" ' +
        'href="' + waLink('Hi! I\'m visiting the Omzato website and would like to know more about your services.') + '" ' +
        'target="_blank" rel="noopener noreferrer" ' +
        'aria-label="Chat on WhatsApp">' +
        ICON_WHATSAPP_LG +
        '<span class="badge-count">1</span>' +
      '</a>';

    document.body.appendChild(htmlToElement(html));
  }

  /* -------------------------------------------------------
     2. ENTRY POPUP (5 seconds)
  ------------------------------------------------------- */

  function injectEntryPopup() {
    var id = 'wa-popup-entry';
    var html =
      '<div class="wa-popup wa-popup-center" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div class="wa-popup-header">' +
            '<button class="wa-popup-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
            '<div style="margin-bottom:12px;">' + ICON_GIFT + '</div>' +
            '<h3>Welcome! Get a FREE Tax Consultation</h3>' +
            '<p>Our ACCA-qualified team is ready to help you save money on taxes.</p>' +
          '</div>' +
          '<div class="wa-popup-body">' +
            '<a class="btn btn-whatsapp btn-lg" ' +
              'href="' + waLink('Hi! I\'d like a free tax consultation.') + '" ' +
              'target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Chat on WhatsApp' +
            '</a>' +
            '<button class="wa-popup-dismiss">No thanks, I\'ll browse</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);

    setTimeout(function () {
      showPopup(id, true);
    }, 5000);
  }

  /* -------------------------------------------------------
     3. EXIT INTENT POPUP
  ------------------------------------------------------- */

  function injectExitIntentPopup() {
    var id = 'wa-popup-exit';
    var html =
      '<div class="wa-popup wa-popup-center" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div class="wa-popup-header" style="background:linear-gradient(135deg,#B45309 0%,#F59E0B 100%);">' +
            '<button class="wa-popup-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
            '<div style="margin-bottom:12px;">' + ICON_PERCENT + '</div>' +
            '<h3>Wait! Don\'t Miss Out</h3>' +
            '<p>Get 20% off your first filing when you connect with us today!</p>' +
          '</div>' +
          '<div class="wa-popup-body">' +
            '<a class="btn btn-whatsapp btn-lg" ' +
              'href="' + waLink('Hi! I saw the 20% off first filing offer.') + '" ' +
              'target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Claim 20% Off Now' +
            '</a>' +
            '<button class="wa-popup-dismiss">No thanks, maybe later</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);

    document.addEventListener('mouseout', function (e) {
      if (exitTriggered) return;
      if (e.clientY < 0 && e.relatedTarget === null) {
        exitTriggered = true;
        showPopup(id, true);
      }
    });
  }

  /* -------------------------------------------------------
     4. SCROLL-BASED TRIGGER (50% scroll)
  ------------------------------------------------------- */

  function injectScrollPopup() {
    var id = 'wa-popup-scroll';
    var contextMsg = getScrollContextMessage();
    var contextWa  = getScrollContextWaMessage();

    var html =
      '<div class="wa-popup wa-popup-slide" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div class="wa-popup-header" style="padding:20px 20px 16px;">' +
            '<button class="wa-popup-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              '<span style="display:flex;align-items:center;color:#25D366;">' + ICON_CHAT + '</span>' +
              '<div>' +
                '<h3 style="font-size:1.05rem;margin:0;">' + contextMsg + '</h3>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="wa-popup-body" style="padding:16px 20px 20px;">' +
            '<p style="font-size:0.88rem;color:#6B7280;margin-bottom:14px;">Get personalized help from our ACCA-qualified tax professionals. Response within minutes.</p>' +
            '<a class="btn btn-whatsapp" style="width:100%;" ' +
              'href="' + waLink(contextWa) + '" ' +
              'target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Chat Now' +
            '</a>' +
            '<button class="wa-popup-dismiss" style="width:100%;text-align:center;">No thanks</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);

    function checkScroll() {
      if (scrollTriggered) return;
      var scrollTop    = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;
      var scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 50) {
        scrollTriggered = true;
        showPopup(id, false);
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  /* -------------------------------------------------------
     5. TIME-BASED TRIGGER (45 seconds)
  ------------------------------------------------------- */

  function injectTimePopup() {
    var id = 'wa-popup-time';
    var html =
      '<div class="wa-popup wa-popup-bar" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">' +
            '<span style="display:flex;align-items:center;color:#F59E0B;flex-shrink:0;">' + ICON_TAG + '</span>' +
            '<p style="margin:0;"><strong style="color:#1B2A4A;">Limited Offer:</strong> Free GST Registration with Annual Filing Package</p>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">' +
            '<a class="btn btn-whatsapp btn-sm" ' +
              'href="' + waLink('Hi! I\'m interested in the GST annual filing package with free registration.') + '" ' +
              'target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Claim Offer' +
            '</a>' +
            '<button class="wa-popup-close" aria-label="Close" ' +
              'style="position:static;background:none;color:#9CA3AF;width:28px;height:28px;font-size:1.4rem;">' +
              ICON_CLOSE +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);

    setTimeout(function () {
      showPopup(id, false);
    }, 45000);
  }

  /* -------------------------------------------------------
     6. CALCULATOR COMPLETION TRIGGER (exposed function)
  ------------------------------------------------------- */

  function injectCalculatorPopup() {
    var id = 'wa-popup-calculator';
    // Inject with placeholder content — will be updated when triggered
    var html =
      '<div class="wa-popup wa-popup-center" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div class="wa-popup-header">' +
            '<button class="wa-popup-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
            '<div style="margin-bottom:12px;">' + ICON_CALCULATOR + '</div>' +
            '<h3 id="wa-calc-title">Want Expert Advice on Your Results?</h3>' +
            '<p>Our team can help you optimize your tax strategy. Chat now — it\'s FREE!</p>' +
          '</div>' +
          '<div class="wa-popup-body">' +
            '<a class="btn btn-whatsapp btn-lg" id="wa-calc-cta" ' +
              'href="#" target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Get Expert Advice' +
            '</a>' +
            '<button class="wa-popup-dismiss">No thanks, I\'m good</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);
  }

  function triggerCalculatorPopup(calculatorName) {
    var id = 'wa-popup-calculator';
    var displayName = calculatorName || 'Calculator';

    // Update content dynamically
    var titleEl = document.getElementById('wa-calc-title');
    var ctaEl   = document.getElementById('wa-calc-cta');

    if (titleEl) {
      titleEl.textContent = 'Want Expert Advice on Your ' + displayName + ' Results?';
    }
    if (ctaEl) {
      ctaEl.href = waLink('Hi! I just used the ' + displayName + ' and would like expert advice on my results.');
    }

    // Reset shown state for calculator popup so it can trigger again with different calculator names
    var data = getStorageData();
    delete data.shown[id];
    saveStorageData(data);

    showPopup(id, true);
  }

  /* -------------------------------------------------------
     7. SERVICE PAGE TRIGGER (exposed function)
  ------------------------------------------------------- */

  function injectServicePopup() {
    var id = 'wa-popup-service';
    var html =
      '<div class="wa-popup wa-popup-slide" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div class="wa-popup-header" style="padding:20px 20px 16px;">' +
            '<button class="wa-popup-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              '<span style="display:flex;align-items:center;color:#25D366;">' + ICON_TAG + '</span>' +
              '<div>' +
                '<h3 id="wa-service-title" style="font-size:1.05rem;margin:0;">Interested? Get a Personalized Quote!</h3>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="wa-popup-body" style="padding:16px 20px 20px;">' +
            '<p style="font-size:0.88rem;color:#6B7280;margin-bottom:14px;">Tell us about your requirements and get a custom quote within minutes.</p>' +
            '<a class="btn btn-whatsapp" id="wa-service-cta" style="width:100%;" ' +
              'href="#" target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Get a Quote' +
            '</a>' +
            '<button class="wa-popup-dismiss" style="width:100%;text-align:center;">No thanks</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);
  }

  function triggerServicePopup(serviceName) {
    var id = 'wa-popup-service';
    var displayName = serviceName || 'Our Services';

    var titleEl = document.getElementById('wa-service-title');
    var ctaEl   = document.getElementById('wa-service-cta');

    if (titleEl) {
      titleEl.textContent = 'Interested in ' + displayName + '? Get a Personalized Quote!';
    }
    if (ctaEl) {
      ctaEl.href = waLink('Hi! I\'m interested in ' + displayName + '. Can you share more details?');
    }

    // Reset shown state so this can be triggered for different services
    var data = getStorageData();
    delete data.shown[id];
    saveStorageData(data);

    showPopup(id, false);
  }

  /* -------------------------------------------------------
     8. IDLE USER TRIGGER (30 seconds no interaction)
  ------------------------------------------------------- */

  function injectIdlePopup() {
    var id = 'wa-popup-idle';
    var html =
      '<div class="wa-popup wa-popup-bar" id="' + id + '">' +
        '<div class="wa-popup-card">' +
          '<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">' +
            '<span style="display:flex;align-items:center;color:#25D366;flex-shrink:0;">' + ICON_CLOCK + '</span>' +
            '<p style="margin:0;"><strong style="color:#1B2A4A;">Our team is available right now.</strong> Ask anything!</p>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">' +
            '<a class="btn btn-whatsapp btn-sm" ' +
              'href="' + waLink('Hi! I have a question. Is someone available to chat?') + '" ' +
              'target="_blank" rel="noopener noreferrer">' +
              ICON_WHATSAPP + ' Chat Now' +
            '</a>' +
            '<button class="wa-popup-close" aria-label="Close" ' +
              'style="position:static;background:none;color:#9CA3AF;width:28px;height:28px;font-size:1.4rem;">' +
              ICON_CLOSE +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(htmlToElement(html));
    attachCloseHandlers(id);

    function resetIdleTimer() {
      if (idleTriggered) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        if (!idleTriggered) {
          idleTriggered = true;
          showPopup(id, false);
        }
      }, 30000);
    }

    // Track user interaction
    var events = ['mousemove', 'scroll', 'click', 'keydown', 'touchstart'];
    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], resetIdleTimer, { passive: true });
    }

    // Start the initial idle timer
    resetIdleTimer();
  }

  /* -------------------------------------------------------
     CLEAN UP STALE LOCALSTORAGE ENTRIES
  ------------------------------------------------------- */

  function cleanStaleData() {
    var data = getStorageData();
    var now  = Date.now();
    var changed = false;

    // Remove dismissed entries older than 24 hours
    for (var key in data.dismissed) {
      if (data.dismissed.hasOwnProperty(key)) {
        if (now - data.dismissed[key] > DISMISSAL_MEMORY_MS) {
          delete data.dismissed[key];
          changed = true;
        }
      }
    }

    // Remove shown entries older than 24 hours (allow re-showing after a day)
    for (var skey in data.shown) {
      if (data.shown.hasOwnProperty(skey)) {
        if (now - data.shown[skey] > DISMISSAL_MEMORY_MS) {
          delete data.shown[skey];
          changed = true;
        }
      }
    }

    if (changed) saveStorageData(data);
  }

  /* -------------------------------------------------------
     INITIALIZATION
  ------------------------------------------------------- */

  function init() {
    // Clean stale localStorage data
    cleanStaleData();

    // 1. Floating button (always visible, not counted)
    injectFloatingButton();

    // 2. Entry popup
    injectEntryPopup();

    // 3. Exit intent popup
    injectExitIntentPopup();

    // 4. Scroll-based trigger
    injectScrollPopup();

    // 5. Time-based trigger
    injectTimePopup();

    // 6. Calculator completion (DOM injected, triggered via exposed function)
    injectCalculatorPopup();

    // 7. Service page (DOM injected, triggered via exposed function)
    injectServicePopup();

    // 8. Idle user trigger
    injectIdlePopup();

    // Keyboard accessibility: close popup on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activePopupId) {
        closePopup(activePopupId, true);
      }
    });
  }

  /* -------------------------------------------------------
     EXPORT PUBLIC API
  ------------------------------------------------------- */

  window.triggerCalculatorPopup = triggerCalculatorPopup;
  window.triggerServicePopup    = triggerServicePopup;

  /* -------------------------------------------------------
     BOOT
  ------------------------------------------------------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
