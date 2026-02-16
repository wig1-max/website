/* ============================================
   OMZATO ACCOUNTING — BLOG FUNCTIONALITY
   Category filtering, TOC, search, share, reading time
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     1. CATEGORY FILTERING
     Filters .blog-card elements on blog.html
     by data-category attribute using .tag buttons.
     "All" shows everything.
  ------------------------------------------ */
  function initCategoryFiltering() {
    var tagButtons = document.querySelectorAll('.tag');
    var blogCards = document.querySelectorAll('.blog-card');

    if (!tagButtons.length || !blogCards.length) {
      return;
    }

    tagButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        // Remove active class from all tags
        tagButtons.forEach(function (btn) {
          btn.classList.remove('active');
        });

        // Add active class to clicked tag
        button.classList.add('active');

        var category = button.getAttribute('data-category') ||
                       button.textContent.trim().toLowerCase();

        blogCards.forEach(function (card) {
          var cardCategory = card.getAttribute('data-category');

          if (category === 'all' || !category) {
            card.style.display = '';
          } else if (cardCategory && cardCategory.toLowerCase() === category.toLowerCase()) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ------------------------------------------
     2. AUTO TABLE OF CONTENTS
     Scans h2 and h3 elements inside .blog-content
     and generates a TOC list inside .blog-toc.
     h3 items are indented under their parent h2.
  ------------------------------------------ */
  function initTableOfContents() {
    var blogContent = document.querySelector('.blog-content');
    var tocContainer = document.querySelector('.blog-toc');

    if (!blogContent || !tocContainer) {
      return;
    }

    var headings = blogContent.querySelectorAll('h2, h3');

    if (!headings.length) {
      tocContainer.style.display = 'none';
      return;
    }

    // Build the TOC list
    var tocList = document.createElement('ul');
    var currentH2Item = null;
    var currentSubList = null;

    headings.forEach(function (heading, index) {
      // Generate a unique ID for the heading if it does not have one
      if (!heading.id) {
        var slug = heading.textContent
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        heading.id = slug + '-' + index;
      }

      var listItem = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.trim();

      listItem.appendChild(link);

      if (heading.tagName.toLowerCase() === 'h2') {
        // Top-level item
        currentH2Item = listItem;
        currentSubList = null;
        tocList.appendChild(listItem);
      } else if (heading.tagName.toLowerCase() === 'h3') {
        // Indented item under the most recent h2
        if (!currentSubList) {
          currentSubList = document.createElement('ul');
          currentSubList.style.paddingLeft = '20px';
          if (currentH2Item) {
            currentH2Item.appendChild(currentSubList);
          } else {
            // h3 without a preceding h2 — append to top level
            tocList.appendChild(listItem);
            return;
          }
        }
        currentSubList.appendChild(listItem);
      }
    });

    // Insert the list into the TOC container
    // Preserve any existing heading (e.g. <h4>Table of Contents</h4>)
    var existingHeading = tocContainer.querySelector('h4');
    if (!existingHeading) {
      var tocTitle = document.createElement('h4');
      tocTitle.textContent = 'Table of Contents';
      tocContainer.appendChild(tocTitle);
    }

    // Remove any previously generated list (in case of re-init)
    var oldList = tocContainer.querySelector('ul');
    if (oldList) {
      oldList.remove();
    }

    tocContainer.appendChild(tocList);
  }

  /* ------------------------------------------
     3. READING TIME ESTIMATE
     Calculates reading time from .blog-content
     text at 200 words per minute.
     Displays result in .reading-time element.
  ------------------------------------------ */
  function initReadingTime() {
    var blogContent = document.querySelector('.blog-content');
    var readingTimeEl = document.querySelector('.reading-time');

    if (!blogContent || !readingTimeEl) {
      return;
    }

    var text = blogContent.textContent || blogContent.innerText || '';
    var wordCount = text.trim().split(/\s+/).filter(function (word) {
      return word.length > 0;
    }).length;

    var wordsPerMinute = 200;
    var minutes = Math.ceil(wordCount / wordsPerMinute);

    if (minutes < 1) {
      minutes = 1;
    }

    readingTimeEl.textContent = minutes + ' min read';
  }

  /* ------------------------------------------
     4. SHARE BUTTONS
     Initializes social share buttons with
     dynamic URLs based on current page URL
     and document title.
  ------------------------------------------ */
  function initShareButtons() {
    var pageUrl = encodeURIComponent(window.location.href);
    var pageTitle = encodeURIComponent(document.title);

    // WhatsApp
    var whatsappBtn = document.querySelector('.share-whatsapp');
    if (whatsappBtn) {
      whatsappBtn.setAttribute(
        'href',
        'https://wa.me/?text=' + pageTitle + '%20-%20' + pageUrl
      );
      whatsappBtn.setAttribute('target', '_blank');
      whatsappBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // LinkedIn
    var linkedinBtn = document.querySelector('.share-linkedin');
    if (linkedinBtn) {
      linkedinBtn.setAttribute(
        'href',
        'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl
      );
      linkedinBtn.setAttribute('target', '_blank');
      linkedinBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // Twitter
    var twitterBtn = document.querySelector('.share-twitter');
    if (twitterBtn) {
      twitterBtn.setAttribute(
        'href',
        'https://twitter.com/intent/tweet?text=' + pageTitle + '&url=' + pageUrl
      );
      twitterBtn.setAttribute('target', '_blank');
      twitterBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // Facebook
    var facebookBtn = document.querySelector('.share-facebook');
    if (facebookBtn) {
      facebookBtn.setAttribute(
        'href',
        'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl
      );
      facebookBtn.setAttribute('target', '_blank');
      facebookBtn.setAttribute('rel', 'noopener noreferrer');
    }
  }

  /* ------------------------------------------
     5. BLOG SEARCH
     Client-side search on blog listing page.
     Input with id="blog-search" filters .blog-card
     elements by checking title and text content.
     Case insensitive.
  ------------------------------------------ */
  function initBlogSearch() {
    var searchInput = document.getElementById('blog-search');
    var blogCards = document.querySelectorAll('.blog-card');

    if (!searchInput || !blogCards.length) {
      return;
    }

    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();

      blogCards.forEach(function (card) {
        if (!query) {
          // Empty query — show all cards (respect active category filter)
          card.style.display = '';
          return;
        }

        // Check card title
        var titleEl = card.querySelector('.blog-card-title');
        var titleText = titleEl
          ? (titleEl.textContent || titleEl.innerText || '').toLowerCase()
          : '';

        // Check full card text content
        var cardText = (card.textContent || card.innerText || '').toLowerCase();

        if (titleText.indexOf(query) !== -1 || cardText.indexOf(query) !== -1) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  /* ------------------------------------------
     6. SMOOTH SCROLL FOR TOC LINKS
     When clicking a TOC link, smooth scroll
     to the heading with 80px offset for the
     sticky header.
  ------------------------------------------ */
  function initSmoothScrollTOC() {
    var tocContainer = document.querySelector('.blog-toc');

    if (!tocContainer) {
      return;
    }

    tocContainer.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) {
        return;
      }

      var targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') {
        return;
      }

      e.preventDefault();

      var targetEl = document.getElementById(targetId.substring(1));
      if (!targetEl) {
        return;
      }

      var headerOffset = 80;
      var elementPosition = targetEl.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  }

  /* ------------------------------------------
     INITIALIZATION
     Run all blog functions on DOMContentLoaded.
  ------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initCategoryFiltering();
    initTableOfContents();
    initReadingTime();
    initShareButtons();
    initBlogSearch();
    initSmoothScrollTOC();
  });

})();
