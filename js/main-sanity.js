/**
 * Main JavaScript for Restaurant Sebes - with Sanity CMS integration
 */

// ========================================
// CONFIGURARE SANITY
// ========================================
// Înlocuiește 'YOUR_PROJECT_ID' cu ID-ul proiectului tău Sanity
// Poți găsi acest ID în dashboard-ul Sanity (sanity.io/manage)
const SANITY_CONFIG = {
  projectId: 'rb9fvomb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true
};

// ========================================
// FUNCȚII PENTRU SANITY API
// ========================================

/**
 * Obține toate produsele din meniu de la Sanity
 */
async function fetchMenuItems() {
  const { projectId, dataset, apiVersion, useCdn } = SANITY_CONFIG;
  
  // Verifică dacă project ID este configurat
  if (projectId === 'YOUR_PROJECT_ID' || !projectId) {
    console.warn('Sanity project ID not configured. Using fallback menu.');
    return getFallbackMenuItems();
  }
  
  // Query GROQ pentru a obține toate produsele, inclusiv ierarhia de categorii
  const query = `*[_type == "menuItem" && isAvailable == true] | order(category->order asc, name asc) {
    _id,
    name,
    description,
    price,
    isAvailable,
    featured,
    "category": category-> {
      _id,
      title,
      "slug": slug.current,
      "parent": parent-> {
        _id,
        title,
        "slug": slug.current
      }
    }
  }`;
  
  const encodedQuery = encodeURIComponent(query);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}`;
  
  // Adaugă parametrul useCdn pentru cache mai rapid
  const cacheParam = useCdn ? '&useCdn=true' : '';
  
  try {
    const response = await fetch(url + cacheParam);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result && data.result.length > 0) {
      console.log(`S-au încărcat ${data.result.length} produse din Sanity`);
      return data.result;
    } else {
      console.log('Nu s-au găsit produse în Sanity. Folosesc meniul fallback.');
      return getFallbackMenuItems();
    }
    
  } catch (error) {
    console.error('Eroare la încărcarea meniului de la Sanity:', error);
    return getFallbackMenuItems();
  }
}

/**
 * Meniul de rezervă (fallback) când Sanity nu este disponibil
 */
function getFallbackMenuItems() {
  return [
    // FAST FOOD
    { _id: '1', name: 'Burger Special', description: 'Carne de vită, brânză cheddar, salată, roșie, sosuri speciale', price: 28, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '2', name: 'Burger Chicken', description: 'Fileu de pui pane, salată, roșie, sos maioneză', price: 24, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '3', name: 'Cartofi Prăjiți', description: 'Cartofi prăjiți crocanți, serviți cu sosuri la alegere', price: 12, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '4', name: 'Hot Dog Clasic', description: 'Cârnăcior, muștar, ketchup, ceapă, pâine proaspătă', price: 15, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '5', name: 'Shaorma Mică', description: 'Carne de pui, salată, sosuri, lipie', price: 20, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '6', name: 'Shaorma Mare', description: 'Porție dublă de carne, salată, sosuri, lipie', price: 28, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '7', name: 'Mititei (5 buc)', description: 'Mititei preparați la grătar, cu muștar și pâine', price: 22, category: { title: 'Fast Food', slug: 'fastfood' } },
    { _id: '8', name: 'Aripioare (6 buc)', description: 'Aripioare de pui fripte, cu sos BBQ sau picant', price: 18, category: { title: 'Fast Food', slug: 'fastfood' } },
    
    // TRADIȚIONALE
    { _id: '9', name: 'Sarmale cu Mămăliguță', description: 'Sarmale tradiționale în foi de varză, servite cu mămăligă și smântână', price: 32, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '10', name: 'Papanași', description: 'Papanași branzoși cu smântână și dulceață de fructe', price: 18, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '11', name: 'Tochitură Românească', description: 'Carne de porc, cârnați, ouă ochiuri, mămăliguță', price: 35, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '12', name: 'Mămăliguță cu Brânză', description: 'Mămăliguță caldă, brânză topită, smântână', price: 16, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '13', name: 'Ciorbă de Burtă', description: 'Ciorbă tradițională cu smântână și ou fiert', price: 18, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '14', name: 'Ciorbă de Legume', description: 'Ciorbă de sezon cu legume proaspete și smântână', price: 14, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '15', name: 'Pui la Cuptor', description: 'Pui întreg la cuptor cu legume și cartofi', price: 38, category: { title: 'Tradițional', slug: 'traditionale' } },
    { _id: '16', name: 'Coaste de Porc', description: 'Coaste de porc la grătar, cu mămăligă și salată', price: 36, category: { title: 'Tradițional', slug: 'traditionale' } },
    
    // BĂUTURI
    { _id: '17', name: 'Limonadă Proaspătă', description: 'Limonadă preparată din fructe proaspete și mentă', price: 10, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '18', name: 'Coca Cola', description: 'Băutură răcoritoare (330ml)', price: 8, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '19', name: 'Fanta', description: 'Băutură răcoritoare cu gust de portocale (330ml)', price: 8, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '20', name: 'Sprite', description: 'Băutură răcoritoare cu gust de lămâie (330ml)', price: 8, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '21', name: 'Apă Minerală', description: 'Apă minerală Borsec (500ml)', price: 6, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '22', name: 'Cafea Espresso', description: 'Cafea arabă proaspăt măcinată', price: 8, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '23', name: 'Cafea Latte', description: 'Cafea cu lapte și spumă de lapte', price: 12, category: { title: 'Băuturi', slug: 'bauturi' } },
    { _id: '24', name: 'Ceai', description: 'Ceai negru sau din plante', price: 8, category: { title: 'Băuturi', slug: 'bauturi' } },
    
    // CATERING
    { _id: '25', name: 'Pachet Familial (4 persoane)', description: 'Pachet complet: feluri principale, salate, desert', price: 120, category: { title: 'Catering', slug: 'catering' } },
    { _id: '26', name: 'Pachet Corporate (10 persoane)', description: 'Meniu complet pentru evenimente corporate', price: 280, category: { title: 'Catering', slug: 'catering' } },
    { _id: '27', name: 'Pachet Petrecere Copii', description: 'Meniu special pentru copii: nuggets, cartofi, gustări', price: 90, category: { title: 'Catering', slug: 'catering' } },
    { _id: '28', name: 'Meniu Nuntă', description: 'Meniu complet pentru nunți (per persoană)', price: 150, category: { title: 'Catering', slug: 'catering' } },
    { _id: '29', name: 'Meniu Eveniment', description: 'Meniu personalizat pentru orice tip de eveniment', price: 0, category: { title: 'Catering', slug: 'catering' } }
  ];
}

// ========================================
// RENDERIZARE MENIU
// ========================================

/**
 * Obține imaginea locală corespunzătoare produsului
 */
function getMenuItemImage(item) {
  const images = {
    'Burger Special': 'burger-special.jpeg',
    'Burger Chicken': 'burger-chicken.jpeg',
    'Cartofi Prăjiți': 'cartofi-prajiti.jpeg',
    'Hot Dog Clasic': 'hot-dog-clasic.jpeg',
    'Shaorma Mică': 'shaorma-mica.jpeg',
    'Shaorma Mare': 'shaorma-mare.jpeg',
    'Mititei (5 buc)': 'mititei.jpeg',
    'Aripioare (6 buc)': 'aripioare.jpeg',
    'Sarmale cu Mămăliguță': 'sarmale-cu-mamaliguta.jpeg',
    'Papanași': 'papanasi.jpeg',
    'Tochitură Românească': 'tochitura-romaneasca.jpeg',
    'Mămăliguță cu Brânză': 'mamaliguta-cu-branza.jpeg',
    'Ciorbă de Burtă': 'ciorba-de-burta.jpeg',
    'Ciorbă de Legume': 'ciorba-de-legume.jpeg',
    'Pui la Cuptor': 'pui-la-cuptor.jpeg',
    'Coaste de Porc': 'coaste-porc.jpeg'
  };

  // Verifică după nume exact
  if (images[item.name]) return `imgs/meniu/${images[item.name]}`;
  
  // Verifică parțial dacă nu găsește exact
  const lowerName = item.name.toLowerCase();
  for (const [key, value] of Object.entries(images)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return `imgs/meniu/${value}`;
    }
  }

  return null; // Nu returnăm nicio imagine dacă nu există una specifică
}

/**
 * Renderizează lista de produse în HTML, grupate pe ierarhia de categorii
 */
function renderMenuItems(items) {
  const menuList = document.getElementById('menuList');
  
  if (!menuList) {
    console.error('Elementul menuList nu a fost găsit');
    return;
  }
  
  // Golește lista curentă
  menuList.innerHTML = '';
  
  if (!items || items.length === 0) {
    menuList.innerHTML = `
      <div class="menu-empty">
        <p>Nu există produse disponibile momentan.</p>
        <p>Vă rugăm să ne contactați telefonic pentru informații.</p>
      </div>
    `;
    return;
  }
  
  // Grupăm produsele pe categorii principale și subcategorii
  const topCategoriesMap = {};
  
  items.forEach(item => {
    // Determinăm categoria principală (top category)
    const category = item.category || { title: 'Diverse', slug: 'diverse' };
    const isSubcategory = !!category.parent;
    const topCategory = isSubcategory ? category.parent : category;
    
    const topTitle = topCategory.title;
    const topValue = normalizeCategoryValue(topCategory.slug || 'diverse');
    
    if (!topCategoriesMap[topTitle]) {
      topCategoriesMap[topTitle] = {
        title: topTitle,
        value: topValue,
        subCategories: {} // Mapă pentru subcategorii: subTitle -> {title, items}
      };
    }
    
    const subTitle = category.title;
    if (!topCategoriesMap[topTitle].subCategories[subTitle]) {
      topCategoriesMap[topTitle].subCategories[subTitle] = {
        title: subTitle,
        isMain: !isSubcategory, // Marcam dacă este chiar categoria principală
        items: []
      };
    }
    topCategoriesMap[topTitle].subCategories[subTitle].items.push(item);
  });
  
  // Rendăm fiecare categorie principală
  Object.values(topCategoriesMap).forEach(topCategory => {
    const categorySection = document.createElement('div');
    categorySection.className = 'menu-category-section';
    categorySection.id = `category-${topCategory.value}`;
    categorySection.dataset.category = topCategory.value;
    
    let sectionHtml = `
      <div class="category-header">
        <h2 class="category-title">${topCategory.title}</h2>
        <div class="category-line"></div>
      </div>
    `;
    
    // Sortăm subcategoriile astfel încât categoria principală (dacă are produse direct) să fie prima
    const sortedSubCategories = Object.values(topCategory.subCategories).sort((a, b) => {
      if (a.isMain) return -1;
      if (b.isMain) return 1;
      return a.title.localeCompare(b.title);
    });
    
    sortedSubCategories.forEach(sub => {
      // Dacă subcategoria nu este categoria principală, adăugăm un subtitlu
      if (!sub.isMain) {
        sectionHtml += `<h3 class="subcategory-title">${sub.title}</h3>`;
      }
      
      sectionHtml += `
        <div class="menu-grid">
          ${sub.items.map(item => renderSingleItem(item, topCategory.value)).join('')}
        </div>
      `;
    });
    
    categorySection.innerHTML = sectionHtml;
    menuList.appendChild(categorySection);
  });
}

/**
 * Normalizează valoarea categoriei pentru a se potrivi cu filtrele
 */
function normalizeCategoryValue(value) {
  if (!value) return 'diverse';
  if (typeof value !== 'string') return value.current || 'diverse';
  
  const map = {
    'fast-food': 'fastfood',
    'fast_food': 'fastfood',
    'traditional': 'traditionale',
    'traditionale': 'traditionale',
    'mic-dejun': 'mic-dejun',
    'mic_dejun': 'mic-dejun',
    'bauturi': 'bauturi',
    'băuturi': 'bauturi',
    'catering': 'catering'
  };
  
  return map[value.toLowerCase()] || value.toLowerCase();
}

/**
 * Renderizează un singur produs (helper pentru renderMenuItems)
 */
function renderSingleItem(item, topCategoryValue) {
  // Pentru produsele cu preț 0 (La cerere), afișăm altfel
  const priceDisplay = item.price === 0 || !item.price 
    ? 'La cerere' 
    : `${Number(item.price).toFixed(2)} RON`;
  
  // Verifică dacă este produs recomandat
  const featuredClass = item.featured ? ' featured' : '';
  const itemImage = getMenuItemImage(item);
  
  // Generăm container-ul de imagine
  const imageHtml = itemImage 
    ? `<div class="menu-item-image">
         <img src="${itemImage}" alt="${item.name}" loading="lazy">
       </div>`
    : `<div class="menu-item-image no-image">
         <span class="material-symbols-outlined">restaurant</span>
       </div>`;
  
  return `
    <div class="menu-item${featuredClass}" data-category="${topCategoryValue}">
      ${imageHtml}
      <div class="menu-item-content">
        <div class="menu-item-header">
          <h3>${item.name}</h3>
          <span class="menu-price">${priceDisplay}</span>
        </div>
        <p class="menu-item-description">${item.description || ''}</p>
      </div>
    </div>
  `;
}

/**
 * Obține valoarea categoriei pentru data-category attribute
 */
function getCategoryValue(category) {
  if (!category) return 'fastfood';
  
  if (typeof category === 'string') {
    return category;
  }
  
  if (category.value) {
    // Reference type - extract the slug value
    const match = category.value.match(/categories\/(\w+)$/);
    if (match) return match[1];
  }
  
  return category.slug?.current || 'fastfood';
}

// ========================================
// INITIALIZARE
// ========================================

document.addEventListener('DOMContentLoaded', async function () {
  console.log('Restaurant Sebes - Initializare...');
  
  // Încarcă meniul de la Sanity sau din fallback
  const menuItems = await fetchMenuItems();
  
  // Renderizează meniul
  renderMenuItems(menuItems);
  
  // Initializează filtrarea (din menu.js)
  if (typeof initializeMenuFiltering === 'function') {
    initializeMenuFiltering();
  }

  // Verifică parametrii URL pentru filtrare automată (ex: ?filter=catering)
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    const filterBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
    if (filterBtn) {
      // Simulăm un click pe butonul de filtrare
      setTimeout(() => filterBtn.click(), 100);
    }
  }
  
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
      
      const formData = new FormData(this);
      const name = formData.get('name') || formData.querySelector('input[type="text"]')?.value;
      const phone = formData.get('tel') || formData.querySelector('input[type="tel"]')?.value;
      
      if (name && phone) {
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
        console.log('Testimonial navigation');
      });
    });
  }
  
  console.log('Restaurant Sebes - Inițializare completă');
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