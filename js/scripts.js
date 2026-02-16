/* ============================================
   OMZATO ACCOUNTING — CORE JAVASCRIPT
   Shared functionality across all pages
   ============================================ */

(function () {
  'use strict';

  /* ==========================================================================
     0. CONSTANTS & CONFIGURATION
     ========================================================================== */

  var OMZATO = {
    name: 'Omzato Accounting',
    owner: 'Aryan Madaan',
    qualification: 'ACCA',
    phone: '+917986772124',
    phoneDisplay: '+91 79867 72124',
    whatsapp: '917986772124',
    email: 'hello.omzato@gmail.com',
    domain: 'omzato.com',
    address: 'SCO 37, Cabin No 16, 1st Floor, Sector 11, Panchkula, Haryana 134112',
    hours: 'Mon-Sat: 8:30 AM - 5:00 PM',
    tagline: 'Hisaab Seedha, Service Pakka!',
    instagram: 'https://www.instagram.com/omzato',
    facebook: 'https://www.facebook.com/profile.php?id=61585237785795',
    cookieKey: 'omzato-cookies',
    headerShrinkThreshold: 50,
    backToTopThreshold: 200,
    stickyHeaderHeight: 70
  };

  /* ==========================================================================
     1. GOOGLE ANALYTICS GA4 PLACEHOLDER
     ========================================================================== */

  (function initGoogleAnalytics() {
    var GA_ID = 'G-XXXXXXXXXX';

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  })();

  /* ==========================================================================
     2. UTILITY FUNCTIONS
     ========================================================================== */

  /**
   * Format a number in the Indian numbering system (e.g. 12,34,567)
   * @param {number} num - The number to format
   * @returns {string} Formatted string with rupee symbol
   */
  function formatIndianCurrency(num) {
    if (num === null || num === undefined || isNaN(num)) return '₹0';

    var isNegative = num < 0;
    num = Math.abs(Math.round(num * 100) / 100);

    var parts = num.toString().split('.');
    var intPart = parts[0];
    var decPart = parts.length > 1 ? '.' + parts[1] : '';

    // Indian grouping: last 3 digits then groups of 2
    if (intPart.length > 3) {
      var last3 = intPart.slice(-3);
      var remaining = intPart.slice(0, -3);
      var formatted = '';
      while (remaining.length > 2) {
        formatted = ',' + remaining.slice(-2) + formatted;
        remaining = remaining.slice(0, -2);
      }
      formatted = remaining + formatted + ',' + last3;
      intPart = formatted;
    }

    return (isNegative ? '-' : '') + '\u20B9' + intPart + decPart;
  }

  /**
   * Debounce function to limit execution frequency
   * @param {Function} func - The function to debounce
   * @param {number} wait - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * Generate a WhatsApp click-to-chat link
   * @param {string} message - Pre-filled message text
   * @returns {string} Full wa.me URL
   */
  function generateWhatsAppLink(message) {
    var baseUrl = 'https://wa.me/' + OMZATO.whatsapp;
    if (message) {
      baseUrl += '?text=' + encodeURIComponent(message);
    }
    return baseUrl;
  }

  // Expose utility functions globally for use by calculator and other page scripts
  window.OmzatoUtils = {
    formatIndianCurrency: formatIndianCurrency,
    debounce: debounce,
    generateWhatsAppLink: generateWhatsAppLink,
    config: OMZATO
  };

  /* ==========================================================================
     3. DETERMINE CURRENT PAGE
     ========================================================================== */

  function getCurrentPage() {
    var path = window.location.pathname.toLowerCase();
    var filename = path.split('/').pop() || '';

    // Remove trailing slash or index.html
    if (filename === '' || filename === 'index.html') {
      // Check if we are at root or a subdirectory
      var segments = path.replace(/\/$/, '').split('/').filter(Boolean);
      if (segments.length === 0) return 'home';
      return segments[segments.length - 1];
    }

    // Strip .html extension
    return filename.replace('.html', '');
  }

  /* ==========================================================================
     4. SHARED HEADER HTML INJECTION
     ========================================================================== */

  function buildHeader() {
    var headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    var currentPage = getCurrentPage();

    function activeClass(page) {
      if (Array.isArray(page)) {
        return page.indexOf(currentPage) !== -1 ? ' active' : '';
      }
      return currentPage === page ? ' active' : '';
    }

    // Calculator page identifiers for dropdown active state
    var calculatorPages = [
      'income-tax-calculator',
      'gst-calculator',
      'emi-calculator',
      'sip-calculator',
      'tds-calculator',
      'hra-calculator',
      'salary-calculator',
      'fd-calculator',
      'ppf-calculator'
    ];

    // Service page identifiers
    var servicePages = [
      'services',
      'tax-filing',
      'gst-services',
      'company-registration',
      'audit',
      'bookkeeping',
      'advisory'
    ];

    var isCalcPage = calculatorPages.indexOf(currentPage) !== -1;
    var isServicePage = servicePages.indexOf(currentPage) !== -1;

    var waLink = generateWhatsAppLink('Hi Omzato! I need help with my accounting/tax needs.');

    var headerHTML = '' +
      '<div class="header-inner">' +
        '<a href="/" class="logo" aria-label="Omzato Accounting Home">' +
          '<div class="logo-icon"><span>O</span></div>' +
          '<div class="logo-text">' +
            '<span class="logo-name">Omzato</span>' +
            '<span class="logo-tagline">Accounting</span>' +
          '</div>' +
        '</a>' +

        '<nav class="nav-links" aria-label="Main Navigation">' +

          '<a href="/"' + activeClass('home') + '>Home</a>' +

          /* ---- Services Dropdown ---- */
          '<div class="dropdown">' +
            '<a href="/services.html" class="dropdown-trigger' + (isServicePage ? ' active' : '') + '">' +
              'Services <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="margin-left:4px;vertical-align:middle;">' +
                '<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
            '</a>' +
            '<div class="dropdown-menu">' +
              '<a href="/tax-filing.html"' + activeClass('tax-filing') + '>Tax Filing</a>' +
              '<a href="/gst-services.html"' + activeClass('gst-services') + '>GST Services</a>' +
              '<a href="/company-registration.html"' + activeClass('company-registration') + '>Company Registration</a>' +
              '<a href="/audit.html"' + activeClass('audit') + '>Audit</a>' +
              '<a href="/bookkeeping.html"' + activeClass('bookkeeping') + '>Bookkeeping</a>' +
              '<a href="/advisory.html"' + activeClass('advisory') + '>Advisory</a>' +
            '</div>' +
          '</div>' +

          /* ---- Calculators Dropdown ---- */
          '<div class="dropdown">' +
            '<a href="/calculators.html" class="dropdown-trigger' + (isCalcPage ? ' active' : activeClass('calculators')) + '">' +
              'Calculators <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="margin-left:4px;vertical-align:middle;">' +
                '<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
            '</a>' +
            '<div class="dropdown-menu">' +
              '<a href="/income-tax-calculator.html"' + activeClass('income-tax-calculator') + '>Income Tax Calculator</a>' +
              '<a href="/gst-calculator.html"' + activeClass('gst-calculator') + '>GST Calculator</a>' +
              '<a href="/emi-calculator.html"' + activeClass('emi-calculator') + '>EMI Calculator</a>' +
              '<a href="/sip-calculator.html"' + activeClass('sip-calculator') + '>SIP Calculator</a>' +
              '<a href="/tds-calculator.html"' + activeClass('tds-calculator') + '>TDS Calculator</a>' +
              '<a href="/hra-calculator.html"' + activeClass('hra-calculator') + '>HRA Calculator</a>' +
              '<a href="/salary-calculator.html"' + activeClass('salary-calculator') + '>Salary Calculator</a>' +
              '<a href="/fd-calculator.html"' + activeClass('fd-calculator') + '>FD Calculator</a>' +
              '<a href="/ppf-calculator.html"' + activeClass('ppf-calculator') + '>PPF Calculator</a>' +
            '</div>' +
          '</div>' +

          '<a href="/why-us.html"' + activeClass('why-us') + '>Why Us</a>' +
          '<a href="/testimonials.html"' + activeClass('testimonials') + '>Testimonials</a>' +
          '<a href="/blog.html"' + activeClass('blog') + '>Blog</a>' +
          '<a href="/contact.html"' + activeClass('contact') + '>Contact</a>' +

          '<a href="' + waLink + '" target="_blank" rel="noopener noreferrer" class="nav-cta">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">' +
              '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
            '</svg>' +
            'WhatsApp Us' +
          '</a>' +

        '</nav>' +

        /* ---- Mobile Menu Toggle (Hamburger) ---- */
        '<button class="menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">' +
          '<span></span>' +
          '<span></span>' +
          '<span></span>' +
        '</button>' +

      '</div>' +

      /* ---- Mobile Navigation Overlay ---- */
      '<nav class="mobile-nav" aria-label="Mobile Navigation">' +
        '<a href="/"' + activeClass('home') + '>Home</a>' +
        '<a href="/services.html"' + (isServicePage ? ' class="active"' : '') + '>Services</a>' +
        '<a href="/tax-filing.html"' + activeClass('tax-filing') + ' style="padding-left:20px;font-size:0.95rem;">Tax Filing</a>' +
        '<a href="/gst-services.html"' + activeClass('gst-services') + ' style="padding-left:20px;font-size:0.95rem;">GST Services</a>' +
        '<a href="/company-registration.html"' + activeClass('company-registration') + ' style="padding-left:20px;font-size:0.95rem;">Company Registration</a>' +
        '<a href="/audit.html"' + activeClass('audit') + ' style="padding-left:20px;font-size:0.95rem;">Audit</a>' +
        '<a href="/bookkeeping.html"' + activeClass('bookkeeping') + ' style="padding-left:20px;font-size:0.95rem;">Bookkeeping</a>' +
        '<a href="/advisory.html"' + activeClass('advisory') + ' style="padding-left:20px;font-size:0.95rem;">Advisory</a>' +
        '<a href="/calculators.html"' + (isCalcPage ? ' class="active"' : activeClass('calculators')) + '>Calculators</a>' +
        '<a href="/income-tax-calculator.html"' + activeClass('income-tax-calculator') + ' style="padding-left:20px;font-size:0.95rem;">Income Tax Calculator</a>' +
        '<a href="/gst-calculator.html"' + activeClass('gst-calculator') + ' style="padding-left:20px;font-size:0.95rem;">GST Calculator</a>' +
        '<a href="/emi-calculator.html"' + activeClass('emi-calculator') + ' style="padding-left:20px;font-size:0.95rem;">EMI Calculator</a>' +
        '<a href="/sip-calculator.html"' + activeClass('sip-calculator') + ' style="padding-left:20px;font-size:0.95rem;">SIP Calculator</a>' +
        '<a href="/tds-calculator.html"' + activeClass('tds-calculator') + ' style="padding-left:20px;font-size:0.95rem;">TDS Calculator</a>' +
        '<a href="/hra-calculator.html"' + activeClass('hra-calculator') + ' style="padding-left:20px;font-size:0.95rem;">HRA Calculator</a>' +
        '<a href="/salary-calculator.html"' + activeClass('salary-calculator') + ' style="padding-left:20px;font-size:0.95rem;">Salary Calculator</a>' +
        '<a href="/fd-calculator.html"' + activeClass('fd-calculator') + ' style="padding-left:20px;font-size:0.95rem;">FD Calculator</a>' +
        '<a href="/ppf-calculator.html"' + activeClass('ppf-calculator') + ' style="padding-left:20px;font-size:0.95rem;">PPF Calculator</a>' +
        '<a href="/why-us.html"' + activeClass('why-us') + '>Why Us</a>' +
        '<a href="/testimonials.html"' + activeClass('testimonials') + '>Testimonials</a>' +
        '<a href="/blog.html"' + activeClass('blog') + '>Blog</a>' +
        '<a href="/contact.html"' + activeClass('contact') + '>Contact</a>' +
        '<a href="' + waLink + '" target="_blank" rel="noopener noreferrer" class="nav-cta">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
          '</svg>' +
          'WhatsApp Us' +
        '</a>' +
      '</nav>';

    headerEl.innerHTML = headerHTML;
  }

  /* ==========================================================================
     5. SHARED FOOTER HTML INJECTION
     ========================================================================== */

  function buildFooter() {
    var footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    var currentYear = new Date().getFullYear();
    var waLink = generateWhatsAppLink('Hi Omzato! I have a query.');

    var footerHTML = '' +
      '<div class="container">' +
        '<div class="footer-grid">' +

          /* ---- Column 1: Brand ---- */
          '<div class="footer-brand">' +
            '<a href="/" class="logo" aria-label="Omzato Accounting Home">' +
              '<div class="logo-icon"><span>O</span></div>' +
              '<div class="logo-text">' +
                '<span class="logo-name">Omzato</span>' +
                '<span class="logo-tagline">Accounting</span>' +
              '</div>' +
            '</a>' +
            '<p>Your trusted accounting partner in Panchkula, Haryana. We simplify taxes, GST, audits, and company compliance so you can focus on growing your business. ' + OMZATO.tagline + '</p>' +
            '<div class="footer-social">' +
              '<a href="' + OMZATO.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Follow Omzato on Instagram">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>' +
              '</a>' +
              '<a href="' + OMZATO.facebook + '" target="_blank" rel="noopener noreferrer" aria-label="Follow Omzato on Facebook">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' +
              '</a>' +
              '<a href="' + waLink + '" target="_blank" rel="noopener noreferrer" aria-label="Chat with Omzato on WhatsApp">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
              '</a>' +
            '</div>' +
          '</div>' +

          /* ---- Column 2: Quick Links ---- */
          '<div class="footer-column">' +
            '<h4>Quick Links</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="/">Home</a></li>' +
              '<li><a href="/services.html">Services</a></li>' +
              '<li><a href="/calculators.html">Calculators</a></li>' +
              '<li><a href="/why-us.html">Why Us</a></li>' +
              '<li><a href="/testimonials.html">Testimonials</a></li>' +
              '<li><a href="/blog.html">Blog</a></li>' +
              '<li><a href="/contact.html">Contact</a></li>' +
            '</ul>' +
          '</div>' +

          /* ---- Column 3: Services ---- */
          '<div class="footer-column">' +
            '<h4>Services</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="/tax-filing.html">ITR Filing</a></li>' +
              '<li><a href="/gst-services.html">GST Services</a></li>' +
              '<li><a href="/company-registration.html">Company Registration</a></li>' +
              '<li><a href="/audit.html">Audit</a></li>' +
              '<li><a href="/bookkeeping.html">Bookkeeping</a></li>' +
              '<li><a href="/advisory.html">Advisory</a></li>' +
            '</ul>' +
          '</div>' +

          /* ---- Column 4: Contact Info ---- */
          '<div class="footer-column">' +
            '<h4>Contact Info</h4>' +
            '<div class="footer-contact-item">' +
              '<span class="icon">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
              '</span>' +
              '<span>' + OMZATO.address + '</span>' +
            '</div>' +
            '<div class="footer-contact-item">' +
              '<span class="icon">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
              '</span>' +
              '<a href="tel:' + OMZATO.phone + '" style="color:inherit;text-decoration:none;">' + OMZATO.phoneDisplay + '</a>' +
            '</div>' +
            '<div class="footer-contact-item">' +
              '<span class="icon">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
              '</span>' +
              '<a href="mailto:' + OMZATO.email + '" style="color:inherit;text-decoration:none;">' + OMZATO.email + '</a>' +
            '</div>' +
            '<div class="footer-contact-item">' +
              '<span class="icon">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
              '</span>' +
              '<span>' + OMZATO.hours + '</span>' +
            '</div>' +
          '</div>' +

        '</div>' +

        /* ---- Bottom Bar ---- */
        '<div class="footer-bottom">' +
          '<p>&copy; ' + currentYear + ' ' + OMZATO.name + '. All rights reserved.</p>' +
          '<div>' +
            '<a href="/privacy.html">Privacy Policy</a>' +
            ' &nbsp;|&nbsp; ' +
            '<a href="/terms.html">Terms of Service</a>' +
          '</div>' +
        '</div>' +

      '</div>';

    footerEl.innerHTML = footerHTML;
  }

  /* ==========================================================================
     6. MOBILE HAMBURGER MENU
     ========================================================================== */

  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.contains('active');

      if (isOpen) {
        // Close menu
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        // Open menu
        toggle.classList.add('active');
        mobileNav.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close on link click
    var mobileLinks = mobileNav.querySelectorAll('a');
    for (var i = 0; i < mobileLinks.length; i++) {
      mobileLinks[i].addEventListener('click', function () {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     7. STICKY HEADER WITH SHRINK-ON-SCROLL
     ========================================================================== */

  function initStickyHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var onScroll = function () {
      if (window.scrollY > OMZATO.headerShrinkThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    // Check on load in case page is already scrolled
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ==========================================================================
     8. SCROLL ANIMATIONS (IntersectionObserver)
     ========================================================================== */

  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      var allAnimated = document.querySelectorAll('.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right');
      for (var i = 0; i < allAnimated.length; i++) {
        allAnimated[i].classList.add('visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, {
      threshold: 0.1,
      rootMargin: '-50px'
    });

    var targets = document.querySelectorAll('.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right');
    for (var j = 0; j < targets.length; j++) {
      observer.observe(targets[j]);
    }
  }

  /* ==========================================================================
     9. BACK-TO-TOP BUTTON
     ========================================================================== */

  function initBackToTop() {
    // Create the button dynamically
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);

    var onScroll = function () {
      if (window.scrollY > OMZATO.backToTopThreshold) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     10. FAQ ACCORDION
     ========================================================================== */

  function initFaqAccordion() {
    var faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;

    for (var i = 0; i < faqQuestions.length; i++) {
      faqQuestions[i].addEventListener('click', function () {
        var parentItem = this.closest('.faq-item');
        if (!parentItem) return;

        var isActive = parentItem.classList.contains('active');

        // Close all other items in the same FAQ list
        var faqList = parentItem.parentElement;
        if (faqList) {
          var allItems = faqList.querySelectorAll('.faq-item');
          for (var j = 0; j < allItems.length; j++) {
            allItems[j].classList.remove('active');
          }
        }

        // Toggle the clicked item (open if it was closed)
        if (!isActive) {
          parentItem.classList.add('active');
        }
      });
    }
  }

  /* ==========================================================================
     11. COOKIE CONSENT BANNER
     ========================================================================== */

  function initCookieConsent() {
    // Skip if already accepted or declined
    if (localStorage.getItem(OMZATO.cookieKey)) return;

    // Create cookie banner dynamically
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '' +
      '<p>We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies. ' +
        '<a href="/privacy.html" style="color:var(--green);font-weight:600;">Learn more</a>' +
      '</p>' +
      '<div class="cookie-btns">' +
        '<button class="btn btn-sm btn-primary cookie-accept">Accept</button>' +
        '<button class="btn btn-sm btn-secondary cookie-decline">Decline</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Show after 2 seconds
    setTimeout(function () {
      banner.classList.add('active');
    }, 2000);

    // Accept button
    var acceptBtn = banner.querySelector('.cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem(OMZATO.cookieKey, 'accepted');
        banner.classList.remove('active');
        setTimeout(function () {
          if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
          }
        }, 500);
      });
    }

    // Decline button
    var declineBtn = banner.querySelector('.cookie-decline');
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem(OMZATO.cookieKey, 'declined');
        banner.classList.remove('active');
        setTimeout(function () {
          if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
          }
        }, 500);
      });
    }
  }

  /* ==========================================================================
     12. SERVICE TABS
     ========================================================================== */

  function initServiceTabs() {
    var tabContainers = document.querySelectorAll('.service-tabs');
    if (!tabContainers.length) return;

    for (var t = 0; t < tabContainers.length; t++) {
      (function (tabContainer) {
        var buttons = tabContainer.querySelectorAll('button');
        if (!buttons.length) return;

        // Determine the parent that contains both tabs and content sections
        var parentSection = tabContainer.parentElement;
        if (!parentSection) return;

        for (var i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click', function () {
            var targetId = this.getAttribute('data-tab');

            // Remove active from all buttons in this tab group
            for (var j = 0; j < buttons.length; j++) {
              buttons[j].classList.remove('active');
            }

            // Add active to clicked button
            this.classList.add('active');

            // Hide all content sections in this parent
            var allContent = parentSection.querySelectorAll('.service-content');
            for (var k = 0; k < allContent.length; k++) {
              allContent[k].classList.remove('active');
            }

            // Show the target content section
            if (targetId) {
              var targetContent = parentSection.querySelector('#' + targetId);
              if (targetContent) {
                targetContent.classList.add('active');
              }
            }
          });
        }
      })(tabContainers[t]);
    }
  }

  /* ==========================================================================
     13. SMOOTH ANCHOR SCROLL WITH STICKY HEADER OFFSET
     ========================================================================== */

  function initSmoothAnchorScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#' || href.length < 2) return;

      var targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      var headerHeight = OMZATO.stickyHeaderHeight;
      var header = document.getElementById('site-header');
      if (header) {
        headerHeight = header.offsetHeight || headerHeight;
      }

      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', href);
      }
    });
  }

  /* ==========================================================================
     14. WHATSAPP FLOATING BUTTON
     ========================================================================== */

  function initWhatsAppFloat() {
    // Only inject if there is no existing .wa-float in the HTML
    if (document.querySelector('.wa-float')) return;

    var waLink = generateWhatsAppLink('Hi Omzato! I visited your website and need help with my accounting/tax needs.');

    var waFloat = document.createElement('a');
    waFloat.href = waLink;
    waFloat.target = '_blank';
    waFloat.rel = 'noopener noreferrer';
    waFloat.className = 'wa-float';
    waFloat.setAttribute('aria-label', 'Chat with Omzato on WhatsApp');
    waFloat.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

    document.body.appendChild(waFloat);
  }

  /* ==========================================================================
     15. INITIALIZATION ON DOMContentLoaded
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    // Build shared header and footer first
    buildHeader();
    buildFooter();

    // Initialize all interactive components
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initBackToTop();
    initFaqAccordion();
    initCookieConsent();
    initServiceTabs();
    initSmoothAnchorScroll();
    initWhatsAppFloat();
  });

  /* ==========================================================================
     16. RE-INITIALIZE SCROLL ANIMATIONS ON DYNAMIC CONTENT
     ========================================================================== */

  // Expose re-initialization for pages that load content dynamically
  window.OmzatoUtils.reinitScrollAnimations = initScrollAnimations;
  window.OmzatoUtils.reinitFaqAccordion = initFaqAccordion;
  window.OmzatoUtils.reinitServiceTabs = initServiceTabs;

})();
