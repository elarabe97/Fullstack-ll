/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'electric-blue': '#1E90FF',
                'neon-green': '#39FF14',
                'black': '#000000',
                'glass': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                'orbitron': ['Orbitron', 'sans-serif'],
                'roboto': ['Roboto', 'sans-serif'],
            },
            boxShadow: {
                'electric-blue': '0 0 10px #1E90FF, 0 0 20px #1E90FF',
                'neon-green': '0 0 10px #39FF14, 0 0 20px #39FF14',
            }
        },
    },
    plugins: [],
}
