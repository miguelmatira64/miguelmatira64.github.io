document.addEventListener("DOMContentLoaded", () => {
    // --- Dark Mode Logic ---
    const html = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");

    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        html.classList.add("dark");
    } else {
        html.classList.remove("dark");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            html.classList.toggle("dark");
            const isDark = html.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            
            // Subtle rotation animation for the icon if needed
            const icon = themeToggle.querySelector(".material-symbols-outlined");
            if (icon) {
                icon.style.transform = "rotate(360deg)";
                setTimeout(() => icon.style.transform = "", 500);
            }
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById("meta-modal");
    const closeBtn = document.getElementById("close-modal");

    const closeModal = () => {
        if (modal) {
            modal.classList.add("opacity-0", "pointer-events-none");
            setTimeout(() => modal.classList.add("hidden"), 300);
        }
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Event delegation for opening the modal
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".open-modal");
        if (btn && modal) {
            const dataFields = ["camera", "aperture", "shutter", "iso", "focal", "file"];
            dataFields.forEach(field => {
                const element = document.getElementById(`meta-${field}`);
                if (element) element.innerText = btn.getAttribute(`data-${field}`) || "N/A";
            });

            modal.classList.remove("hidden");
            // Force reflow for animation
            modal.offsetHeight;
            modal.classList.remove("opacity-0", "pointer-events-none");
        }
    });

    // --- Performance Optimization: Lazy Images ---
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    // Already set in src, but can be used for data-src if needed
                    observer.unobserve(image);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});
