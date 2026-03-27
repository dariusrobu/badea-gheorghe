/**
 * Catering - JavaScript
 * Handle catering order form with Stripe checkout
 */

const SANITY_CONFIG = {
  projectId: 'rb9fvomb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true
};

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51TFKJSJmAwGV0K29UpnQdff7wsX4TiD3RKkjY7WAy7MhRmwhUJrydXu6MzO1MwqkQTeMFRxenYFjaikKE1aEgaEN002vd0AVY8';

// Fallback catering menu items
const FALLBACK_CATERING_MENU = [
  { id: '1', name: 'Pachet Familial (4 persoane)', description: 'Pachet complet: feluri principale, salate, desert', price: 120, category: 'catering' },
  { id: '2', name: 'Pachet Corporate (10 persoane)', description: 'Meniu complet pentru evenimente corporate', price: 280, category: 'catering' },
  { id: '3', name: 'Pachet Petrecere Copii', description: 'Meniu special pentru copii: nuggets, cartofi, gustări', price: 90, category: 'catering' },
  { id: '4', name: 'Meniu Nuntă', description: 'Meniu complet pentru nunți (per persoană)', price: 150, category: 'catering' },
  { id: '5', name: 'Meniu Eveniment', description: 'Meniu personalizat pentru orice tip de eveniment', price: 0, category: 'catering' }
];

let cart = {};
let menuItems = [];

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
  // Check for payment success/cancel from Stripe redirect
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const orderId = urlParams.get('orderId');
    if (orderId) {
      showPaymentSuccess(orderId);
    }
  }
  
  // Set minimum date for pickup
  const pickupDate = document.getElementById('pickupDate');
  if (pickupDate) {
    const today = new Date().toISOString().split('T')[0];
    pickupDate.min = today;
    pickupDate.value = today;
  }
  
  // Load menu items
  await loadCateringMenu();
  
  // Setup delivery type toggle
  setupDeliveryToggle();
  
  // Setup submit button
  setupSubmitButton();
});

function showPaymentSuccess(orderId) {
  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  const deliveryForm = document.getElementById('deliveryForm');
  
  if (orderItems) {
    orderItems.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <span class="material-symbols-outlined" style="font-size: 4rem; color: var(--accent-green);">check_circle</span>
        <h4 style="font-family: 'Newsreader', serif; font-size: 1.5rem; color: var(--accent-green); margin: 16px 0;">Plata a fost confirmată!</h4>
        <p style="font-family: 'Manrope', sans-serif; color: var(--text-dark);">Comanda ta a fost confirmată.</p>
        <p style="font-family: 'Manrope', sans-serif; font-weight: 700; color: var(--primary-brown); margin-top: 12px; padding: 12px; background: white; border-radius: 8px;">Cod Comandă: ${orderId}</p>
      </div>
    `;
  }
  if (orderTotal) orderTotal.textContent = 'Plătit';
  if (deliveryForm) deliveryForm.style.display = 'none';
  
  updatePaymentStatus(orderId);
}

async function updatePaymentStatus(orderId) {
  console.log('Updating payment status for order:', orderId);
  try {
    const response = await fetch(
      `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/mutate/${SANITY_CONFIG.dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          mutations: [{
            patch: {
              id: orderId,
              set: {
                paymentStatus: 'paid',
                status: 'confirmed'
              }
            }
          }]
        })
      }
    );
    console.log('Payment status update response:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.log('Failed to update payment status:', error);
  }
}

async function loadCateringMenu() {
  const menuContainer = document.getElementById('cateringMenu');
  
  try {
    const query = encodeURIComponent('*[_type == "menuItem" && category->title == "Catering"]');
    const response = await fetch(
      `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${query}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        menuItems = data.result.map(item => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: 'catering'
        }));
      }
    }
  } catch (error) {
    console.log('Using fallback catering menu');
  }
  
  if (menuItems.length === 0) {
    menuItems = FALLBACK_CATERING_MENU;
  }
  
  renderCateringMenu();
}

function renderCateringMenu() {
  const menuContainer = document.getElementById('cateringMenu');
  menuContainer.innerHTML = '';
  
  menuItems.forEach(item => {
    const priceDisplay = item.price === 0 ? 'La cerere' : `${item.price} RON`;
    const qty = cart[item.id] || 0;
    
    const packageEl = document.createElement('div');
    packageEl.className = `catering-package${qty > 0 ? ' selected' : ''}`;
    packageEl.innerHTML = `
      <div class="package-info">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <span class="package-price">${priceDisplay}</span>
      </div>
      <div class="quantity-control">
        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
        <span class="qty-value" id="qty-${item.id}">${qty}</span>
        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
      </div>
    `;
    
    menuContainer.appendChild(packageEl);
  });
}

function updateQuantity(itemId, delta) {
  const currentQty = cart[itemId] || 0;
  const newQty = Math.max(0, currentQty + delta);
  
  if (newQty === 0) {
    delete cart[itemId];
  } else {
    cart[itemId] = newQty;
  }
  
  renderCateringMenu();
  updateOrderSummary();
  updateSubmitButton();
}

function updateOrderSummary() {
  const orderItemsContainer = document.getElementById('orderItems');
  const orderTotalEl = document.getElementById('orderTotal');
  
  const itemCount = Object.keys(cart).reduce((sum, id) => sum + cart[id], 0);
  
  if (itemCount === 0) {
    orderItemsContainer.innerHTML = `
      <div class="empty-cart">
        <span class="material-symbols-outlined">restaurant_menu</span>
        <p>Selectează produsele pentru a începe comanda</p>
      </div>
    `;
    orderTotalEl.textContent = '0 RON';
    return;
  }
  
  let itemsHtml = '';
  let total = 0;
  
  Object.keys(cart).forEach(itemId => {
    const qty = cart[itemId];
    const item = menuItems.find(m => m.id === itemId);
    if (item && item.price > 0) {
      const itemTotal = item.price * qty;
      total += itemTotal;
      itemsHtml += `
        <div class="order-item">
          <div>
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-qty">${qty} x ${item.price} RON</div>
          </div>
          <div class="order-item-price">${itemTotal} RON</div>
        </div>
      `;
    }
  });
  
  orderItemsContainer.innerHTML = itemsHtml;
  orderTotalEl.textContent = total > 0 ? `${total} RON` : 'La cerere';
}

function setupDeliveryToggle() {
  const btns = document.querySelectorAll('.delivery-type-btn');
  const pickupRow = document.getElementById('pickupRow');
  const pickupLocationGroup = document.getElementById('pickupLocationGroup');
  const deliveryAddressGroup = document.getElementById('deliveryAddressGroup');
  
  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const type = this.dataset.type;
      
      if (type === 'pickup') {
        pickupRow.style.display = 'grid';
        pickupLocationGroup.style.display = 'block';
        deliveryAddressGroup.style.display = 'none';
      } else {
        pickupRow.style.display = 'none';
        pickupLocationGroup.style.display = 'none';
        deliveryAddressGroup.style.display = 'block';
      }
    });
  });
}

function updateSubmitButton() {
  const btn = document.getElementById('submitOrderBtn');
  const itemCount = Object.keys(cart).length;
  
  const name = document.getElementById('customerName')?.value;
  const phone = document.getElementById('customerPhone')?.value;
  const deliveryType = document.querySelector('.delivery-type-btn.active')?.dataset.type;
  
  let isValid = itemCount > 0 && name && phone;
  
  if (deliveryType === 'pickup') {
    const pickupDate = document.getElementById('pickupDate')?.value;
    const pickupTime = document.getElementById('pickupTime')?.value;
    const pickupLocation = document.getElementById('pickupLocation')?.value;
    isValid = isValid && pickupDate && pickupTime && pickupLocation;
  } else {
    const address = document.getElementById('deliveryAddress')?.value;
    isValid = isValid && address;
  }
  
  btn.disabled = !isValid;
}

document.addEventListener('DOMContentLoaded', function() {
  const formFields = ['customerName', 'customerPhone', 'customerEmail', 'pickupDate', 'pickupTime', 'pickupLocation', 'deliveryAddress'];
  
  formFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', updateSubmitButton);
      field.addEventListener('change', updateSubmitButton);
    }
  });
});

function setupSubmitButton() {
  const submitBtn = document.getElementById('submitOrderBtn');
  
  submitBtn.addEventListener('click', async function() {
    await submitOrder();
  });
}

async function submitOrder() {
  const submitBtn = document.getElementById('submitOrderBtn');
  const successMessage = document.getElementById('successMessage');
  const confirmationRef = document.getElementById('confirmationRef');
  
  submitBtn.disabled = true;
  submitBtn.style.background = '#999';
  submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Se procesează...';
  
  const deliveryType = document.querySelector('.delivery-type-btn.active').dataset.type;
  const total = calculateTotal();
  const refNumber = 'CAT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
  
  // First save order to Sanity with pending payment
  const orderData = {
    _type: 'cateringOrder',
    _id: refNumber,
    customerName: document.getElementById('customerName').value,
    phone: document.getElementById('customerPhone').value,
    email: document.getElementById('customerEmail').value || '',
    deliveryType: deliveryType,
    deliveryDate: document.getElementById('pickupDate').value,
    deliveryTime: deliveryType === 'pickup' ? document.getElementById('pickupTime').value : '14:00',
    pickupLocation: deliveryType === 'pickup' ? document.getElementById('pickupLocation').value : null,
    deliveryAddress: deliveryType === 'delivery' ? document.getElementById('deliveryAddress').value : null,
    items: Object.keys(cart).map(itemId => ({
      menuItem: {_type: 'reference', _ref: itemId},
      quantity: cart[itemId]
    })),
    specialInstructions: document.getElementById('specialInstructions').value || '',
    totalAmount: total,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    // Save order to Sanity first
    const sanityResponse = await fetch(
      `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/mutate/${SANITY_CONFIG.dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          mutations: [{ create: orderData }]
        })
      }
    );
    
    if (!sanityResponse.ok) {
      throw new Error('Failed to save order');
    }
    
    // If total is 0, just show success without payment
    if (total === 0) {
      confirmationRef.textContent = `Cod Comandă: ${refNumber}\nVom contacta pentru confirmare și plată.`;
      successMessage.classList.add('show');
      resetForm();
      return;
    }
    
    // For paid orders, create Stripe Checkout session
    const stripeItems = Object.keys(cart).map(itemId => {
      const item = menuItems.find(m => m.id === itemId);
      return {
        name: item.name,
        description: item.description || '',
        price: item.price,
        quantity: cart[itemId]
      };
    });
    
    // Call our API to create Stripe checkout session
    const stripeResponse = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: stripeItems,
        customerName: orderData.customerName,
        email: orderData.email,
        orderId: refNumber
      })
    });
    
    if (!stripeResponse.ok) {
      throw new Error('Failed to create payment session');
    }
    
    const { url } = await stripeResponse.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
    
  } catch (error) {
    console.error('Error:', error);
    confirmationRef.textContent = `Cod Comandă: ${refNumber}\nTe rugăm să ne suni pentru confirmare.`;
    successMessage.classList.add('show');
    resetForm();
  }
}

function resetForm() {
  cart = {};
  renderCateringMenu();
  updateOrderSummary();
  document.getElementById('customerName').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('customerEmail').value = '';
  document.getElementById('specialInstructions').value = '';
  
  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Comandă Trimisă!';
}

function calculateTotal() {
  let total = 0;
  Object.keys(cart).forEach(itemId => {
    const item = menuItems.find(m => m.id === itemId);
    if (item && item.price > 0) {
      total += item.price * cart[itemId];
    }
  });
  return total;
}

function getToken() {
  return 'sktEeI0L2T4bQ9IERIYR903svBfVWjXoW9WXQhz6AoeYC1yYLhIOEg8XY6q4lIU6oVxIBGRHdHqAOUT2QVg9sZBihbe2ae8LLtcMZruM1WFTa4gaL5cv7Zi6QWDUJTm0LgaKsVQI5NPGmZvllSNLr9PqHxYvS5TOhrovxhhSwPSyLRMt2p53';
}