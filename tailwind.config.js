module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                primary: "#1A6BFF",
                cyan: "#00C2FF",
                bg: "#F0F5FF",
                surface: "#FFFFFF",
                textMain: "#0A1628",
                textSoft: "#4A6080"
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                space: ['Space Grotesk', 'sans-serif']
            },
            boxShadow: {
                glow: "0 8px 32px rgba(26,107,255,0.2)"
            }
        }
    },
    plugins: []
}