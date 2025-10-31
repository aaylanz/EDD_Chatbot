import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
const prefixes = ['REACT_APP'];

// eslint-disable-next-line no-undef
const base = process.env.GITHUB_PAGES === 'true' ? '/EDD_Chatbot/' : './';

export default defineConfig({
  base: base,
  build: {
    outDir: 'build',
  },
  envPrefix: prefixes,
  plugins: [react()],
});
