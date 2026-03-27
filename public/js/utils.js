/**
 * Utility functions for the Restaurant Sebes website
 */

/**
 * Debounce function to limit rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately on leading edge
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle function to limit rate of function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {Object} options - Options for checking
 * @returns {boolean} Whether element is in viewport
 */
function isInViewport(element, options = {}) {
  const rect = element.getBoundingClientRect();
  const {
    threshold = 0,
    rootMargin = '0px'
  } = options;
  
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const above = rect.bottom - threshold * rect.height < 0;
  const below = rect.top - threshold * rect.height > viewHeight;
  const left = rect.right - threshold * rect.width < 0;
  const right = rect.left - threshold * rect.width > viewWidth;
  
  return !(above || below || left || right);
}

/**
 * Add CSS class when element enters viewport
 * @param {Element} element - Element to observe
 * @param {string} className - Class to add
 * @param {Object} options - Options for viewport checking
 */
function addClassOnScroll(element, className, options = {}) {
  if (isInViewport(element, options)) {
    element.classList.add(className);
  }
}

/**
 * Format currency in Lei (Romanian currency)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatLei(amount) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Get current date in Romanian format
 * @returns {string} Formatted date string
 */
function getRomanianDate() {
  return new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Scroll to element with smooth behavior
 * @param {Element|string} target - Element or selector to scroll to
 * @param {number} offset - Offset in pixels (default: 0)
 */
function smoothScrollTo(target, offset = 0) {
  let element;
  if (typeof target === 'string') {
    element = document.querySelector(target);
  } else {
    element = target;
  }
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Initialize tooltips for elements with data-tooltip attribute
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', function () {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.pageXOffset + rect.width / 2}px`;
      tooltip.style.top = `${rect.top + window.pageYOffset - 10}px`;
      
      // Add fade-in effect
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
      });
    });
    
    el.addEventListener('mouseleave', function () {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
        }, 200);
      }
    });
  });
}

/**
 * Initialize animations on scroll
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const handleScroll = () => {
    animatedElements.forEach(el => {
      if (isInViewport(el, { threshold: 0.1 })) {
        const animation = el.getAttribute('data-animate');
        el.classList.add('animate__animated', animation);
        // Remove the attribute to prevent re-animation
        el.removeAttribute('data-animate');
      }
    });
  };
  
  // Check on load and scroll
  handleScroll();
  window.addEventListener('scroll', throttle(handleScroll, 100));
}

/**
 * Initialize all utilities
 */
function initUtils() {
  initTooltips();
  initScrollAnimations();
}

// Export for use in other files (if using modules)
if (typeof window !== 'undefined') {
  window.utils = {
    debounce,
    throttle,
    isInViewport,
    addClassOnScroll,
    formatLei,
    getRomanianDate,
    smoothScrollTo,
    initTooltips,
    initScrollAnimations,
    initUtils
  };
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initUtils);