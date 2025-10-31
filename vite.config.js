import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
const prefixes = ['REACT_APP'];

// For GitHub Pages deployment
// If deploying to https://<USERNAME>.github.io/<REPO>/, use: '/EDD_Chatbot/'
// If deploying to https://<USERNAME>.github.io/, use: '/'
const base = process.env.GITHUB_PAGES === 'true' ? '/EDD_Chatbot/' : './';

export default defineConfig({
  base: base,
  build: {
    outDir: 'build',
  },
  envPrefix: prefixes,
  plugins: [react()],
});
