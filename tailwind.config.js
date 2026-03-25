/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#ffffff', // White background
                card: '#f9fafb', // Light gray cards (gray-50)
                primary: '#6366f1', // Purple/blue primary (indigo-500)
                income: '#10b981', // Green for income (emerald-500)
                expense: '#ef4444', // Red for expense (red-500)
            },
            borderRadius: {
                'xl': '1rem', // Ensures rounded (xl) is standardized
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Soft shadows
            }
        },
    },
    plugins: [],
}