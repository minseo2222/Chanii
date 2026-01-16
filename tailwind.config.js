/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pastel: {
                    pink: '#FFB3BA',
                    peach: '#FFDFBA',
                    yellow: '#FFFFBA',
                    green: '#BAFFC9',
                    blue: '#BAE1FF',
                    purple: '#D4BAFF',
                },
                freshness: {
                    good: '#4ADE80',
                    warning: '#FBBF24',
                    danger: '#EF4444',
                },
            },
            fontFamily: {
                sans: ['Noto Sans KR', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
