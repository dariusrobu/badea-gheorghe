/**
 * Blog JavaScript for Restaurant Sebes - with Sanity CMS integration
 */

// ========================================
// CONFIGURARE SANITY
// ========================================
const SANITY_CONFIG = {
  projectId: 'rb9fvomb',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: true
};

// ========================================
// FALLBACK BLOG POSTS (când Sanity nu e disponibil)
// ========================================

function getFallbackBlogPosts() {
  return [
    {
      _id: 'fallback-1',
      title: 'Bine ați venit la Restaurant Badea Gheorghe',
      slug: { current: 'bine-ati-venit' },
      author: 'Badea Gheorghe',
      publishedAt: '2024-01-15T10:00:00Z',
      excerpt: 'Bine ați venit la Restaurant Badea Gheorghe! Descoperiți gusturile autentice ale României într-o atmosferă caldă și primitoare.',
      featuredImage: null,
      categories: ['noutati']
    },
    {
      _id: 'fallback-2',
      title: 'Meniu Nou de Primăvară',
      slug: { current: 'meniu-nou-primavara' },
      author: 'Badea Gheorghe',
      publishedAt: '2024-03-01T10:00:00Z',
      excerpt: 'Descoperiți noul nostru meniu de primăvară cu preparate proaspete, pregătite cu ingrediente locale și de sezon.',
      featuredImage: null,
      categories: ['retete', 'oferte']
    },
    {
      _id: 'fallback-3',
      title: 'Eveniment Special: Seară de Vinuri',
      slug: { current: 'seara-de-vinuri' },
      author: 'Badea Gheorghe',
      publishedAt: '2024-02-10T10:00:00Z',
      excerpt: 'Vă invităm la o seară specială de vinuri, alături de sommelieri experți. Descoperiți cele mai fine vinuri românești!',
      featuredImage: null,
      categories: ['evenimente']
    }
  ];
}

// ========================================
// FUNCȚII PENTRU SANITY API
// ========================================

/**
 * Obține toate articolele blog de la Sanity
 */
async function fetchBlogPosts() {
  const { projectId, dataset, apiVersion, useCdn } = SANITY_CONFIG;
  
  if (projectId === 'YOUR_PROJECT_ID' || !projectId) {
    console.warn('Sanity project ID not configured. Using fallback blog posts.');
    return getFallbackBlogPosts();
  }

  try {
    const query = encodeURIComponent(`*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author,
      publishedAt,
      excerpt,
      "imageUrl": featuredImage.asset->url,
      categories
    }`);
    
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.result || getFallbackBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return getFallbackBlogPosts();
  }
}

/**
 * Obține un singur articol după slug
 */
async function fetchBlogPostBySlug(slug) {
  const { projectId, dataset, apiVersion } = SANITY_CONFIG;
  
  if (projectId === 'YOUR_PROJECT_ID' || !projectId) {
    const posts = getFallbackBlogPosts();
    return posts.find(p => p.slug.current === slug) || posts[0];
  }

  try {
    const query = encodeURIComponent(`*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      author,
      publishedAt,
      excerpt,
      "imageUrl": featuredImage.asset->url,
      body,
      categories
    }`);
    
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}&$$slug="${slug}"`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.result || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Obține articolele featured
 */
async function fetchFeaturedBlogPosts() {
  const { projectId, dataset, apiVersion } = SANITY_CONFIG;
  
  if (projectId === 'YOUR_PROJECT_ID' || !projectId) {
    return getFallbackBlogPosts().slice(0, 2);
  }

  try {
    const query = encodeURIComponent(`*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      author,
      publishedAt,
      excerpt,
      "imageUrl": featuredImage.asset->url,
      categories
    }`);
    
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.result || getFallbackBlogPosts().slice(0, 2);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return getFallbackBlogPosts().slice(0, 2);
  }
}

// ========================================
// FUNCȚII UTILITARE
// ========================================

/**
 * Formatează data pentru afișare în română
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ro-RO', options);
}

/**
 * Obține numele categoriei în română
 */
function getCategoryName(category) {
  const categories = {
    'evenimente': 'Evenimente',
    'retete': 'Rețete',
    'noutati': 'Noutăți',
    'oferte': 'Oferte Speciale'
  };
  return categories[category] || category;
}

/**
 * Obține URL-ul imaginii din Sanity cu transformări
 */
function getImageUrl(imageUrl, width = 800) {
  if (!imageUrl) return null;
  
  // Dacă e deja o imagine locală, returnează direct
  if (imageUrl.startsWith('imgs/') || imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Pentru imagini Sanity, adaugă parametri de transformare
  return `${imageUrl}?w=${width}&h=${Math.round(width * 0.6)}&fit=crop&auto=format`;
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.fetchBlogPosts = fetchBlogPosts;
  window.fetchBlogPostBySlug = fetchBlogPostBySlug;
  window.fetchFeaturedBlogPosts = fetchFeaturedBlogPosts;
  window.formatDate = formatDate;
  window.getCategoryName = getCategoryName;
  window.getImageUrl = getImageUrl;
  window.SANITY_CONFIG = SANITY_CONFIG;
}
