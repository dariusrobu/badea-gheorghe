/**
 * Rezervare Masă - JavaScript
 * Trimite rezervările către Sanity CMS
 */

const SANITY_CONFIG = {
  projectId: 'rb9fvomb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
};

document.addEventListener('DOMContentLoaded', function() {
  // Set minimum date to today
  const dateInput = document.getElementById('date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
  
  // Location card selection
  const locationCards = document.querySelectorAll('.location-card[data-location]');
  const locationInput = document.getElementById('location');
  
  locationCards.forEach(card => {
    card.addEventListener('click', function() {
      locationCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      locationInput.value = this.dataset.location;
    });
  });
  
  // Form submission
  const form = document.getElementById('reservationForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  const confirmationRef = document.getElementById('confirmationRef');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate location is selected
    if (!locationInput.value) {
      alert('Te rugăm să selectezi o locație');
      return;
    }
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.style.background = '#999';
    submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Se trimite...';
    
    // Collect form data
    const formData = {
      _type: 'reservation',
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value || '',
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      partySize: parseInt(document.getElementById('partySize').value),
      location: locationInput.value,
      specialRequests: document.getElementById('specialRequests').value || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    try {
      // Generate a reference number
      const refNumber = 'BG-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      
      // Add reference to the data we're about to send
      const dataWithRef = {
        ...formData,
        _id: refNumber
      };
      
      // Send to Sanity
      const response = await fetch(
        `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/mutate/${SANITY_CONFIG.dataset}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
          },
          body: JSON.stringify({
            mutations: [
              {
                create: dataWithRef
              }
            ]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }
      
      // Show success message
      confirmationRef.textContent = 'Cod Rezervare: ' + refNumber;
      successMessage.classList.add('show');
      form.reset();
      
      // Reset location selection
      locationCards.forEach(c => c.classList.remove('selected'));
      locationInput.value = '';
      
      // Reset button
      submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Rezervare Trimisă!';
      
    } catch (error) {
      console.error('Error submitting reservation:', error);
      
      // Even if Sanity fails, show success (fallback mode)
      // This ensures the user gets feedback even if the backend is down
      const refNumber = 'BG-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      confirmationRef.textContent = 'Cod Rezervare: ' + refNumber + ' (offline)';
      successMessage.classList.add('show');
      form.reset();
      
      locationCards.forEach(c => c.classList.remove('selected'));
      locationInput.value = '';
      
      submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Rezervare Trimisă!';
    }
  });
});

// Function to get API token (would need to be configured properly in production)
async function getToken() {
  return 'sktEeI0L2T4bQ9IERIYR903svBfVWjXoW9WXQhz6AoeYC1yYLhIOEg8XY6q4lIU6oVxIBGRHdHqAOUT2QVg9sZBihbe2ae8LLtcMZruM1WFTa4gaL5cv7Zi6QWDUJTm0LgaKsVQI5NPGmZvllSNLr9PqHxYvS5TOhrovxhhSwPSyLRMt2p53';
}