import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        meniu: resolve(__dirname, 'meniu.html'),
        admin: resolve(__dirname, 'admin.html'),
        blog: resolve(__dirname, 'blog.html'),
        blogPost: resolve(__dirname, 'blog-post.html'),
        contact: resolve(__dirname, 'contact.html'),
        locatii: resolve(__dirname, 'locatii.html')
      }
    }
  }
});
