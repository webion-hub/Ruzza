import sharedConfig from '@ruzza/config/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedConfig],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
