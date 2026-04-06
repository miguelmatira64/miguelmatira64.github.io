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
    const previewImg = document.getElementById("meta-preview");
    const fullViewBtn = document.getElementById("open-full-view");
    const modalImageContainer = document.getElementById("modal-image-container");

    // --- Lightbox Logic ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightboxBtn = document.getElementById("close-lightbox");

    const openLightbox = (src) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
        // Force reflow
        lightbox.offsetHeight;
        lightbox.classList.remove("opacity-0", "pointer-events-none");
        lightboxImg.classList.remove("scale-95");
        lightboxImg.classList.add("scale-100");
    };

    const closeLightbox = () => {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.add("opacity-0", "pointer-events-none");
        lightboxImg.classList.remove("scale-100");
        lightboxImg.classList.add("scale-95");
        setTimeout(() => {
            lightbox.classList.add("hidden");
            lightboxImg.src = "";
        }, 500);
    };

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

    if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
        });
    }

    // Modal Image / Full View Triggers
    if (fullViewBtn && previewImg) {
        fullViewBtn.addEventListener("click", () => openLightbox(previewImg.src));
    }
    if (modalImageContainer && previewImg) {
        modalImageContainer.addEventListener("click", () => openLightbox(previewImg.src));
    }

    // Learn More smooth scroll
    const learnMoreBtn = document.querySelector('a[href="#"], .learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener("click", (e) => {
            const bioSection = document.getElementById("biography");
            if (bioSection) {
                e.preventDefault();
                bioSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // --- Scroll Reveal Logic ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Optional: stop observing after reveal for performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach(el => observer.observe(el));

    // Event delegation for opening the modal
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".open-modal");
        
        // Also allow clicking the bento-card image to open meta-modal/preview
        const card = e.target.closest(".bento-card");
        const cardImage = card ? card.querySelector("img") : null;
        
        if (btn && modal) {
            const dataFields = ["camera", "aperture", "shutter", "iso", "focal", "file"];
            dataFields.forEach(field => {
                const element = document.getElementById(`meta-${field}`);
                if (element) element.innerText = btn.getAttribute(`data-${field}`) || "N/A";
            });

            if (previewImg) {
                const filename = btn.getAttribute("data-file");
                // Remove relative indicator for consistency and check if full path is needed
                previewImg.src = filename ? `assets/${filename}` : "";
            }

            modal.classList.remove("hidden");
            modal.offsetHeight;
            modal.classList.remove("opacity-0", "pointer-events-none");
        } else if (card && !e.target.closest("button") && !e.target.closest("a") && cardImage) {
            openLightbox(cardImage.src);
        }
    });

    // --- Performance Optimization: Lazy Images ---
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    observer.unobserve(image);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});
