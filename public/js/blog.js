/**
 * Blog UI JavaScript for Restaurant Sebes
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on blog page or blog post page
  const blogGrid = document.getElementById('blogGrid');
  const blogPost = document.getElementById('blogPost');
  
  if (blogGrid) {
    loadBlogPosts();
  }
  
  if (blogPost) {
    loadBlogPost();
  }
});

/**
 * Încarcă și afișează lista de articole blog
 */
async function loadBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  // Afișează loading state
  blogGrid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Se încarcă articolele...</p></div>';

  try {
    const posts = await window.fetchBlogPosts();
    
    if (!posts || posts.length === 0) {
      blogGrid.innerHTML = '<div class="empty-state"><p>Nu există articole disponibile momentan.</p></div>';
      return;
    }

    blogGrid.innerHTML = posts.map(post => createBlogCard(post)).join('');
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogGrid.innerHTML = '<div class="error-state"><p>A apărut o eroare la încărcarea articolelor. Încercați mai târziu.</p></div>';
  }
}

/**
 * Creează HTML pentru un card de blog
 */
function createBlogCard(post) {
  const imageUrl = window.getImageUrl(post.imageUrl, 600);
  const date = window.formatDate(post.publishedAt);
  const categories = post.categories ? post.categories.map(cat => 
    `<span class="blog-category">${window.getCategoryName(cat)}</span>`
  ).join('') : '';
  
  return `
    <article class="blog-card">
      <a href="blog-post.html?slug=${post.slug.current}" class="blog-card-link">
        ${imageUrl ? `<div class="blog-card-image" style="background-image: url('${imageUrl}')"></div>` : '<div class="blog-card-image blog-card-image-placeholder"></div>'}
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-date">${date}</span>
            ${categories}
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt || ''}</p>
          <span class="blog-read-more">Citește mai mult <span class="material-symbols-outlined">arrow_forward</span></span>
        </div>
      </a>
    </article>
  `;
}

/**
 * Încarcă și afișează un singur articol blog
 */
async function loadBlogPost() {
  const blogPostContainer = document.getElementById('blogPost');
  const relatedPostsContainer = document.getElementById('relatedPosts');
  if (!blogPostContainer) return;

  // Obține slug-ul din URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    blogPostContainer.innerHTML = '<div class="error-state"><p>Articolul nu a fost găsit.</p><a href="blog.html" class="btn">Înapoi la blog</a></div>';
    return;
  }

  // Afișează loading state
  blogPostContainer.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Se încarcă articolul...</p></div>';

  try {
    const post = await window.fetchBlogPostBySlug(slug);
    
    if (!post) {
      blogPostContainer.innerHTML = '<div class="error-state"><p>Articolul nu a fost găsit.</p><a href="blog.html" class="btn">Înapoi la blog</a></div>';
      return;
    }

    blogPostContainer.innerHTML = createBlogPost(post);
    
    // Load related posts (all posts except current)
    if (relatedPostsContainer) {
      const allPosts = await window.fetchBlogPosts();
      const relatedPosts = allPosts.filter(p => p.slug.current !== slug).slice(0, 3);
      if (relatedPosts.length > 0) {
        relatedPostsContainer.innerHTML = relatedPosts.map(post => createBlogCard(post)).join('');
      } else {
        relatedPostsContainer.parentElement.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    blogPostContainer.innerHTML = '<div class="error-state"><p>A apărut o eroare la încărcarea articolului.</p><a href="blog.html" class="btn">Înapoi la blog</a></div>';
  }
}

/**
 * Creează HTML pentru un articol blog complet
 */
function createBlogPost(post) {
  const imageUrl = window.getImageUrl(post.imageUrl, 1200);
  const date = window.formatDate(post.publishedAt);
  const categories = post.categories ? post.categories.map(cat => 
    `<span class="blog-category">${window.getCategoryName(cat)}</span>`
  ).join('') : '';
  
  // Pentru body-ul articolului, vom folosi simplu text sau HTML
  // Într-o implementare completă, folosim Portable Text serializer
  let bodyContent = '';
  if (post.body && post.body.length > 0) {
    bodyContent = post.body.map(block => {
      if (block._type === 'block') {
        let text = block.children.map(child => child.text).join('');
        switch (block.style) {
          case 'h1': return `<h1>${text}</h1>`;
          case 'h2': return `<h2>${text}</h2>`;
          case 'h3': return `<h3>${text}</h3>`;
          case 'blockquote': return `<blockquote>${text}</blockquote>`;
          default: return `<p>${text}</p>`;
        }
      }
      return '';
    }).join('');
  }
  
  return `
    <article class="blog-post">
      <header class="blog-post-header">
        <div class="blog-post-meta">
          <span class="blog-date">${date}</span>
          <span class="blog-author">de ${post.author}</span>
          ${categories ? `<div class="blog-categories">${categories}</div>` : ''}
        </div>
        <h1 class="blog-post-title">${post.title}</h1>
        ${post.excerpt ? `<p class="blog-post-excerpt">${post.excerpt}</p>` : ''}
      </header>
      
      ${imageUrl ? `<div class="blog-post-image" style="background-image: url('${imageUrl}')"></div>` : ''}
      
      <div class="blog-post-content">
        ${bodyContent || '<p>Conținutul articolului va fi adăugat în curând.</p>'}
      </div>
      
      <footer class="blog-post-footer">
        <a href="blog.html" class="btn btn-secondary">
          <span class="material-symbols-outlined">arrow_back</span>
          Înapoi la blog
        </a>
      </footer>
    </article>
  `;
}
