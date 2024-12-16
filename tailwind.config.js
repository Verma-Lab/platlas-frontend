/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the path to match your project
    'node_modules/flowbite-react/**/*.{js,jsx,tstsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbitePlugin // ESModules import for the plugin
  ],
}
