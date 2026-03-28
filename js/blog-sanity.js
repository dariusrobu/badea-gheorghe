/**
 * Blog Sanity API Integration
 * Fetches blog posts from Sanity CMS
 */

const SANITY_CONFIG = {
  projectId: 'rb9fvomb',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: true
};

/**
 * Fetch all blog posts from Sanity
 */
async function fetchBlogPosts() {
  const query = encodeURIComponent(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author,
      publishedAt,
      excerpt,
      categories,
      featuredImage {
        asset->{
          _id,
          url
        }
      }
    }
  `);

  try {
    const response = await fetch(
      `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${query}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
async function fetchBlogPostBySlug(slug) {
  const query = encodeURIComponent(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      author,
      publishedAt,
      excerpt,
      categories,
      featuredImage {
        asset->{
          _id,
          url
        }
      },
      body
    }
  `);

  try {
    const response = await fetch(
      `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${query}&slug=${slug}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Get image URL from Sanity asset
 */
function getImageUrl(imageData, width = 600) {
  if (!imageData || !imageData.asset) {
    return null;
  }

  const assetId = imageData.asset._id;
  if (!assetId) return null;

  // If it's already a full URL, return it
  if (assetId.startsWith('http')) {
    return assetId;
  }

  // Build Sanity image URL
  const projectId = SANITY_CONFIG.projectId;
  const dataset = SANITY_CONFIG.dataset;
  
  // Extract the image ID from the asset reference
  const imageId = assetId.replace('image-', '').split('-')[0];
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}-${width}x${Math.round(width * 0.75)}.jpg`;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ro-RO', options);
}

/**
 * Get category display name
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

// Make functions available globally
window.fetchBlogPosts = fetchBlogPosts;
window.fetchBlogPostBySlug = fetchBlogPostBySlug;
window.getImageUrl = getImageUrl;
window.formatDate = formatDate;
window.getCategoryName = getCategoryName;
