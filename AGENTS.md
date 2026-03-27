# Agent Guidelines for Restaurant Sebes Website

## 1. Development Commands

### Installation
```bash
# Install dependencies (though minimal for static site)
npm install
```

### Development Server
```bash
# Start local development server
npm run dev
```

### Build Commands
```bash
# Build for production (Vercel)
npm run build

# Preview production build locally
npm run start
```

### Linting
```bash
# Basic linting reminder (manual review recommended)
npm run lint
```

### Testing
```bash
# Manual testing reminder
npm run test
```

### Deployment
```bash
# Deploy to Vercel
npm run deploy
```

### Running a Single Test
Since this is a static website with minimal JavaScript, testing is primarily manual:
```bash
# For JavaScript unit testing (if adding tests later)
# npm test -- src/js/specific-test.js

# Manual testing steps:
# 1. Open site in browser
# 2. Check responsiveness across devices
# 3. Test navigation menu on mobile/desktop
# 4. Verify all links work
# 5. Check form validation (if forms added)
# 6. Confirm click-to-call functionality
```

## 2. Code Style Guidelines

### File Organization
- Keep HTML files in root directory
- CSS in `/css` folder (themes.css, styles.css, responsive.css)
- JavaScript in `/js` folder (main.js, menu.js, utils.js)
- Images in `/imgs` folder (organized by category)
- Assets (fonts, icons) in `/assets` folder

### HTML Guidelines
- Use semantic HTML5 elements (header, nav, section, article, footer)
- Always include `lang="ro"` on html tag for Romanian language
- Include proper viewport meta tag for mobile responsiveness
- Use descriptive alt text for all images
- Include favicon link
- Link to external resources (Google Fonts, Font Awesome) in head
- Place JavaScript at bottom of body before closing tag
- Use consistent indentation (2 spaces)
- Close all tags properly
- Use comments to mark major sections

### CSS Guidelines
- Use CSS variables for theme colors in themes.css
- Follow BEM-like naming convention for components
- Mobile-first approach in responsive.css
- Use rem/em units for scalable typography
- Keep selector specificity low
- Use flexbox and grid for layouts
- Optimize for performance (avoid expensive properties)
- Include fallbacks for older browsers where needed
- Separate concerns: themes (variables), styles (core), responsive (overrides)
- Use meaningful class names that describe purpose, not appearance
- Group related properties together
- Use shorthand properties when appropriate

### JavaScript Guidelines
- Use ES6+ features (const/let, arrow functions, template literals)
- Follow functional programming principles where appropriate
- Use IIFE or modules to avoid polluting global scope
- Add JSDoc comments for complex functions
- Handle edge cases and errors gracefully
- Use requestAnimationFrame for animations
- Implement debouncing/throttling for scroll/resize events
- Use passive event listeners where applicable
- Cache DOM queries when used repeatedly
- Use strict mode ('use strict')
- Initialize functionality on DOMContentLoaded
- Use feature detection for browser compatibility
- Keep functions small and focused
- Use meaningful variable and function names
- Follow consistent naming conventions (camelCase for variables/functions)
- Add comments for complex logic
- Use triple equals (===) for comparisons
- Prefer const over let, let over var

### Naming Conventions
- HTML files: kebab-case (index.html, meniu.html)
- CSS classes: kebab-case (site-header, menu-item)
- JavaScript variables/functions: camelCase (mainNav, initUtils)
- Constants: UPPER_SNAKE_CASE (MAX_ITEMS, API_URL)
- Images: descriptive kebab-case names (logo.jpeg, menu-fastfood.jpeg)
- Folders: kebab-case (css, js, imgs)

### Color Usage (from themes.css)
- Primary Brown: #5D4037 (text, primary elements)
- Secondary Brown: #8D6E63 (secondary elements, borders)
- Accent Yellow: #FFEB3B (CTA buttons, highlights)
- Accent Green: #4CAF50 (hover states, positive actions)
- Dark Black: #212121 (footer, dark backgrounds)
- Off White: #FAFAFA (light backgrounds, cards)
- Text Gray: #666666 (body text, secondary text)

### Typography
- Headings: Playfair Display font family
- Body text: Open Sans font family
- Use appropriate font weights (400 regular, 500 medium, 600 semi-bold, 700 bold)
- Maintain proper hierarchy (h1 > h2 > h3 > p)
- Ensure adequate line height for readability (1.6)
- Use relative units (rem) for font sizes

### Image Guidelines
- Optimize JPEG images for web (quality 80-85%)
- Use descriptive, keyword-rich alt text in Romanian
- Include width and height attributes when known to prevent layout shift
- Use loading="lazy" for below-the-fold images
- Serve appropriately sized images for different screen sizes
- Use meaningful file names that describe content
- Keep aspect ratios consistent for similar image types

### Accessibility
- Ensure sufficient color contrast (WCAG AA compliance)
- Make all functionality available via keyboard
- Use ARIA labels when necessary
- Ensure form elements have associated labels
- Make link purpose clear from link text
- Provide skip navigation links
- Ensure focus styles are visible
- Use semantic HTML for screen reader compatibility

### Performance
- Minimize HTTP requests
- Leverage browser caching (via Vercel headers)
- Optimize images and serve in next-gen formats where possible
- Minify CSS and JavaScript in production
- Use CSS transforms for animations instead of properties that trigger layout
- Prioritize above-the-fold content
- Use font-display: swap for Google Fonts
- Avoid render-blocking resources

### SEO
- Include unique, descriptive title tags for each page
- Write compelling meta descriptions with Romanian keywords
- Use header hierarchy properly (h1 only once per page)
- Include structured data where appropriate (LocalBusiness schema)
- Ensure URL structure is logical and readable
- Include XML sitemap
- Configure robots.txt properly
- Use canonical tags to prevent duplicate content
- Include Open Graph tags for social sharing
- Ensure fast loading times (optimize images, minimize code)

### Security
- Implement Content Security Policy (CSP) headers
- Use X-Content-Type-Options: nosniff
- Implement X-Frame-Options: SAMEORIGIN
- Sanitize any user input (if forms added)
- Use HTTPS in production (Vercel provides this automatically)
- Keep dependencies updated
- Avoid eval() and similar dangerous functions

### Vercel-Specific Guidelines
- Use vercel.json for custom routing and headers
- Leverage Vercel's automatic SSL
- Use environment variables for configuration
- Take advantage of Vercel's edge network
- Utilize Vercel's image optimization (when implemented)
- Preview changes using Vercel's preview deployments
- Use Vercel's analytics for performance insights

## 3. Sanity CMS Integration

### Folder Structure
```
sanity/
├── package.json          # Dependencies for Sanity project
├── sanity.config.js     # Main Sanity configuration
├── schemas/
│   ├── index.js         # Export all schemas
│   ├── menuItem.js     # Schema for menu items
│   └── category.js     # Schema for menu categories
└── README.md            # Setup guide
```

### Setting Up Sanity CMS

1. **Install dependencies:**
```bash
cd sanity
npm install
```

2. **Configure Project ID:**
Edit `sanity/sanity.config.js` and replace `'YOUR_PROJECT_ID'` with your Sanity project ID.

To get the Project ID:
- Go to https://www.sanity.io/manage
- Select your project
- Copy the "Project ID" from General settings

3. **Start Sanity Studio:**
```bash
cd sanity
npm run dev
```
This opens at http://localhost:3333

4. **Add Categories first:**
Create 4 categories in Sanity Studio:
- Fast Food
- Tradițional
- Băuturi
- Catering

5. **Add Menu Items:**
Create menu products with:
- Name
- Category (reference)
- Description
- Price (RON)
- Available (boolean)
- Featured (boolean)

### Updating the Website

1. **Configure JavaScript:**
Edit `js/main-sanity.js` and set your Sanity Project ID:
```javascript
const SANITY_CONFIG = {
  projectId: 'YOUR_PROJECT_ID',  // Replace with your actual ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true
};
```

2. **Update HTML to use Sanity scripts:**
In `meniu.html`, replace:
- `<script src="js/main.js"></script>` with `<script src="js/main-sanity.js"></script>`
- `<script src="js/menu.js"></script>` with `<script src="js/menu-sanity.js"></script>`

### Environment Variables (Vercel)

Add in Vercel dashboard → Settings → Environment Variables:
- `SANITY_PROJECT_ID` = your project ID
- `SANITY_DATASET` = production (optional, defaults to production)

### Fallback Menu

The system includes a fallback menu in `js/main-sanity.js` that displays if Sanity API is unavailable. This ensures the website always works even if the CMS has issues.

### Editing Menu via CMS

To edit menu items:
1. Go to https://[your-project].sanity.studio
2. Find the menu item you want to edit
3. Modify fields (name, price, description, etc.)
4. Click "Publish"

Changes appear on the live site within a few minutes.