/**
 * Menu filtering functionality for Restaurant Sebes
 * Works with Sanity CMS grouped layout
 */

document.addEventListener('DOMContentLoaded', function () {
  // Așteaptă ca meniul să fie renderizat
  const checkAndInitialize = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySections = document.querySelectorAll('.menu-category-section');
    
    if (filterButtons.length === 0 || categorySections.length === 0) {
      // Try again if elements not loaded yet
      setTimeout(checkAndInitialize, 100);
      return;
    }
    
    // Add click events to filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter category sections with animation
        filterCategorySections(categorySections, filterValue);
      });
    });
  };
  
  // Start checking after a short delay to ensure DOM is ready
  setTimeout(checkAndInitialize, 500);
});

/**
 * Filter category sections with smooth animation
 */
function filterCategorySections(sections, filterValue) {
  sections.forEach(section => {
    const sectionCategory = section.getAttribute('data-category');
    
    // Check if section should be shown
    const shouldShow = filterValue === 'all' || 
      sectionCategory?.toLowerCase() === filterValue.toLowerCase() ||
      getCategoryValueFromTitle(sectionCategory) === filterValue;
    
    if (shouldShow) {
      showElement(section);
    } else {
      hideElement(section);
    }
  });
}

/**
 * Show element with animation
 */
function showElement(el) {
  el.style.display = 'block';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 10);
}

/**
 * Hide element with animation
 */
function hideElement(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  setTimeout(() => {
    if (el.style.opacity === '0') {
      el.style.display = 'none';
    }
  }, 300);
}

/**
 * Convert category title to value for comparison
 */
function getCategoryValueFromTitle(title) {
  if (!title) return 'fastfood';
  
  const categoryMap = {
    'fast food': 'fastfood',
    'fastfood': 'fastfood',
    'tradițional': 'traditionale',
    'traditional': 'traditionale',
    'traditionale': 'traditionale',
    'băuturi': 'bauturi',
    'bauturi': 'bauturi',
    'catering': 'catering',
    'mic dejun': 'mic-dejun',
    'mic-dejun': 'mic-dejun'
  };
  
  const lowerTitle = title.toLowerCase();
  return categoryMap[lowerTitle] || lowerTitle;
}

/**
 * Initialize menu filtering (exposed for external use)
 */
window.initializeMenuFiltering = function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categorySections = document.querySelectorAll('.menu-category-section');
  
  if (filterButtons.length === 0) {
    return;
  }
  
  // Make sure all sections are visible initially
  categorySections.forEach(section => {
    section.style.display = 'block';
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  
  // Add click events
  filterButtons.forEach(button => {
    // Clone to remove old listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function () {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Find all matching buttons across the DOM (if duplicates exist)
      document.querySelectorAll(`.filter-btn[data-filter="${this.dataset.filter}"]`).forEach(btn => btn.classList.add('active'));
      
      const filterValue = this.getAttribute('data-filter');
      filterCategorySections(document.querySelectorAll('.menu-category-section'), filterValue);
    });
  });
};
