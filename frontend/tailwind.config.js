/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#6B7280',
        success: '#16A34A',
        danger: '#DC2626'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        card: '0 10px 20px rgba(0,0,0,0.06)'
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}


