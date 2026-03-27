/**
 * Menu filtering functionality for Restaurant Sebes
 * Works with Sanity CMS and fallback menu
 */

document.addEventListener('DOMContentLoaded', function () {
  // Așteaptă ca meniul să fie renderizat
  const checkAndInitialize = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (filterButtons.length === 0) {
      // Try again if filters not loaded yet
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
        
        // Filter menu items with animation
        filterMenuItems(menuItems, filterValue);
      });
    });
  };
  
  // Start checking after a short delay to ensure DOM is ready
  setTimeout(checkAndInitialize, 500);
});

/**
 * Filter menu items with smooth animation
 */
function filterMenuItems(menuItems, filterValue) {
  menuItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    // Check if item should be shown
    // Convert category title to value for comparison
    const shouldShow = filterValue === 'all' || 
      itemCategory?.toLowerCase() === filterValue.toLowerCase() ||
      getCategoryValueFromTitle(itemCategory) === filterValue;
    
    if (shouldShow) {
      showItem(item);
    } else {
      hideItem(item);
    }
  });
}

/**
 * Show item with animation
 */
function showItem(item) {
  // First make sure it's visible but transparent
  item.style.display = 'block';
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  
  // Trigger reflow
  void item.offsetWidth;
  
  // Animate to visible
  item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  item.style.opacity = '1';
  item.style.transform = 'translateY(0)';
}

/**
 * Hide item with animation
 */
function hideItem(item) {
  item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  item.style.opacity = '0';
  item.style.transform = 'translateY(-20px)';
  
  // After animation, set display none
  setTimeout(() => {
    if (item.style.opacity === '0') {
      item.style.display = 'none';
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
    'catering': 'catering'
  };
  
  const lowerTitle = title.toLowerCase();
  return categoryMap[lowerTitle] || 'fastfood';
}

/**
 * Initialize menu filtering (exposed for external use)
 */
window.initializeMenuFiltering = function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  
  if (filterButtons.length === 0 || menuItems.length === 0) {
    return;
  }
  
  // Make sure all items are visible initially
  menuItems.forEach(item => {
    item.style.display = 'block';
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  });
  
  // Add click events
  filterButtons.forEach(button => {
    // Remove existing listeners to avoid duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function () {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      filterMenuItems(document.querySelectorAll('.menu-item'), filterValue);
    });
  });
};