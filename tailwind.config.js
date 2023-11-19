/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Roboto', 'sans-serif'],
            },
            colors: {
                'background-color': '#151515',
                'font-color': '#EAEAEA',
            },
            flexGrow: {
                'min': '1 1 auto'
            }
        },
    },
}
