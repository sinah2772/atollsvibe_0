/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Category colors - background
    'bg-blue-50', 'bg-blue-100', 'bg-emerald-50', 'bg-emerald-100', 'bg-purple-50', 'bg-purple-100',
    'bg-amber-50', 'bg-amber-100', 'bg-rose-50', 'bg-rose-100', 'bg-indigo-50', 'bg-indigo-100',
    'bg-teal-50', 'bg-teal-100', 'bg-orange-50', 'bg-orange-100', 'bg-cyan-50', 'bg-cyan-100',
    'bg-pink-50', 'bg-pink-100',
    // Category colors - text
    'text-blue-600', 'text-blue-700', 'text-emerald-600', 'text-emerald-700', 'text-purple-600', 'text-purple-700',
    'text-amber-600', 'text-amber-700', 'text-rose-600', 'text-rose-700', 'text-indigo-600', 'text-indigo-700',
    'text-teal-600', 'text-teal-700', 'text-orange-600', 'text-orange-700', 'text-cyan-600', 'text-cyan-700',
    'text-pink-600', 'text-pink-700',
    // Category colors - borders
    'border-blue-200', 'border-blue-300', 'border-emerald-200', 'border-emerald-300', 'border-purple-200', 'border-purple-300',
    'border-amber-200', 'border-amber-300', 'border-rose-200', 'border-rose-300', 'border-indigo-200', 'border-indigo-300',
    'border-teal-200', 'border-teal-300', 'border-orange-200', 'border-orange-300', 'border-cyan-200', 'border-cyan-300',
    'border-pink-200', 'border-pink-300',
    // Category colors - hover
    'hover:bg-blue-100', 'hover:bg-blue-200', 'hover:bg-emerald-100', 'hover:bg-emerald-200', 'hover:bg-purple-100', 'hover:bg-purple-200',
    'hover:bg-amber-100', 'hover:bg-amber-200', 'hover:bg-rose-100', 'hover:bg-rose-200', 'hover:bg-indigo-100', 'hover:bg-indigo-200',
    'hover:bg-teal-100', 'hover:bg-teal-200', 'hover:bg-orange-100', 'hover:bg-orange-200', 'hover:bg-cyan-100', 'hover:bg-cyan-200',
    'hover:bg-pink-100', 'hover:bg-pink-200'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};