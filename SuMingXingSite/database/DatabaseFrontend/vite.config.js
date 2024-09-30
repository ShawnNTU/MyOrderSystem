import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'


// https://vitejs.dev/config/
export default defineConfig({
  base:"./",
  plugins: [
    react(),
    eslint(),
    nodePolyfills({
      include:['crypto', 'util', 'url', 'timers', 'http', 'stream', 'zlib', 'fs'],
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
    })
  ],
  // not sure whether below is needed
  css:{
    postcss:{
      plugins:[
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  server:{
    hmr:{
      overlay:true
    }
  },
  build: {
    outDir:"dist",
    assetsDir:".",
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      // external:["public/react.svg", "public/vite.svg"],
      // comment below line so vite will build index.html automatically
      // input: '/src/main.jsx',
      output:{
        // dir:"./dist/",
        assetFileNames:(assetInfo) =>{
          // maybe can use "assetInfo" to do some processing
          console.log(assetInfo.name);
          return "[ext]/[name].[ext]"
        },
        entryFileNames:"js/[name].js"
      },
    },
  },
  optimizeDeps: {
    exclude: ['crypto', 'util', 'url', 'timers', 'http', 'stream', 'zlib', 'fs']
  }
})
