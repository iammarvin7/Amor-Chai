import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. Set the base path to your repository name
  base: "/Amor_Chai_Website/", 

  build: {
    // 2. CRITICAL FIX: Ensure all asset paths are relative to the index.html file 
    // This often fixes issues with images and other bundled assets.
    assetsDir: 'assets',
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.mp4'],
    
    // 3. Set the public path to empty, telling it to use relative paths from the root of the deployed content
    rollupOptions: {
        output: {
            // Forces all assets to be referenced from the root of the deployment
            chunkFileNames: 'assets/[name].[hash].js',
            entryFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash].[ext]',
        },
    },
  },
})