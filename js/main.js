/**
 * Main JavaScript for Restaurant Sebes - Stitch Design System
 */

document.addEventListener('DOMContentLoaded', function () {
  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
      }
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    const headerScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', throttle(headerScroll, 50));
    headerScroll();
  }
  
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 64;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Set active nav item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.main-nav a');
  navItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref === currentPage || (currentPage === '' && itemHref === 'index.html')) {
      item.classList.add('active');
    }
  });
  
  // Form submission for reservation
  const reservationForm = document.querySelector('.reservation-form form');
  if (reservationForm) {
    reservationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name') || formData.querySelector('input[type="text"]')?.value;
      const phone = formData.get('tel') || formData.querySelector('input[type="tel"]')?.value;
      
      if (name && phone) {
        // Show success message - user will call to confirm
        alert('Cererea de rezervare a fost trimisă! Vă vom contacta în scurt timp pentru confirmare la numărul: ' + phone);
        this.reset();
      } else {
        alert('Vă rugăm să completați toate câmpurile necesare.');
      }
    });
  }
  
  // Testimonial navigation (placeholder functionality)
  const navBtns = document.querySelectorAll('.nav-btn');
  if (navBtns.length > 0) {
    navBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // In a full implementation, this would navigate between testimonials
        console.log('Testimonial navigation');
      });
    });
  }
  
  // Lazy load images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }
  
  // Newsletter subscription
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('.newsletter-input');
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Abonează-te';
      
      if (!emailInput || !emailInput.value) return;
      
      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Se trimite...';
        }
        
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailInput.value
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert(data.message || 'Te-ai abonat cu succes!');
          this.reset();
        } else {
          throw new Error(data.error || 'A apărut o eroare. Vă rugăm să încercați din nou.');
        }
      } catch (error) {
        alert(error.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
});

/**
 * Throttle function
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