/**
 * Menu filtering functionality for Restaurant Sebes website
 */

document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
   
  if (filterButtons.length === 0 || menuItems.length === 0) {
    return;
  }
   
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
       
      const filterValue = this.getAttribute('data-filter');
       
      // Filter menu items
      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Add animation class for reveal effect
          item.classList.remove('hide');
          item.classList.add('show');
        } else {
          item.style.display = 'none';
          item.classList.remove('show');
          item.classList.add('hide');
        }
      });
    });
  });
   
  // Optional: Add initial animation class to all items
  menuItems.forEach(item => {
    item.classList.add('menu-item-initial');
  });
});