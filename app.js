document.addEventListener("DOMContentLoaded", () => {
    // ── Theme / Dark Mode Logic ─────────────────────────────────
    const html = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        html.classList.add("dark");
        html.classList.remove("light");
    } else {
        html.classList.remove("dark");
        html.classList.add("light");
    }

    const updateToggleIcon = () => {
        const icon = themeToggle?.querySelector(".material-symbols-outlined");
        if (!icon) return;
        icon.textContent = html.classList.contains("dark") ? "light_mode" : "dark_mode";
    };
    updateToggleIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            html.classList.toggle("dark");
            html.classList.toggle("light");
            const isDark = html.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateToggleIcon();
        });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            html.classList.toggle("dark", e.matches);
            html.classList.toggle("light", !e.matches);
            updateToggleIcon();
        }
    });

    // ── Contact Dropdown Toggle ─────────────────────────────────
    const contactBtn = document.getElementById("contact-btn");
    const contactDropdown = document.getElementById("contact-dropdown");

    if (contactBtn && contactDropdown) {
        contactBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isExpanded = contactBtn.getAttribute("aria-expanded") === "true";
            contactBtn.setAttribute("aria-expanded", !isExpanded);
            contactDropdown.classList.toggle("opacity-100");
            contactDropdown.classList.toggle("visible");
            contactDropdown.classList.toggle("scale-100");
            contactDropdown.classList.toggle("opacity-0");
            contactDropdown.classList.toggle("invisible");
            contactDropdown.classList.toggle("scale-95");
        });

        document.addEventListener("click", (e) => {
            if (!contactDropdown.contains(e.target) && e.target !== contactBtn) {
                contactBtn.setAttribute("aria-expanded", "false");
                contactDropdown.classList.add("opacity-0", "invisible", "scale-95");
                contactDropdown.classList.remove("opacity-100", "visible", "scale-100");
            }
        });
    }

    // ── Metadata Modal Logic ────────────────────────────────────
    const modal = document.getElementById("meta-modal");
    const closeBtn = document.getElementById("close-modal");
    const previewImg = document.getElementById("meta-preview");
    const fullViewBtn = document.getElementById("open-full-view");

    // ── Lightbox Logic ──────────────────────────────────────────
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightboxBtn = document.getElementById("close-lightbox");

    const openLightbox = (src) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
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
        }, 350);
    };

    const openMetadataModal = (sourceEl) => {
        if (!modal) return;
        const dataFields = ["camera", "aperture", "shutter", "iso", "focal", "file", "title", "lens"];
        dataFields.forEach(field => {
            const el = document.getElementById(`meta-${field}`);
            if (el) el.innerText = sourceEl.getAttribute(`data-${field}`) || "N/A";
        });

        if (previewImg) {
            const filename = sourceEl.getAttribute("data-file");
            previewImg.src = filename ? `assets/${filename}` : "";
        }

        modal.classList.remove("hidden");
        modal.offsetHeight;
        modal.classList.remove("opacity-0", "pointer-events-none");
    };

    const closeMetadataModal = () => {
        if (!modal) return;
        modal.classList.add("opacity-0", "pointer-events-none");
        setTimeout(() => modal.classList.add("hidden"), 250);
    };

    if (closeBtn) closeBtn.addEventListener("click", closeMetadataModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeMetadataModal();
        });
    }

    if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
        });
    }

    if (fullViewBtn && previewImg) {
        fullViewBtn.addEventListener("click", () => {
            closeMetadataModal();
            openLightbox(previewImg.src);
        });
    }

    // Escape key closes modals/lightboxes/dropdowns
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLightbox();
            closeMetadataModal();
            if (contactDropdown) {
                contactDropdown.classList.add("opacity-0", "invisible", "scale-95");
                contactDropdown.classList.remove("opacity-100", "visible", "scale-100");
            }
        }
    });

    // ── Photo Card Tap & Metadata Interaction ───────────────────
    document.addEventListener("click", (e) => {
        // 1. Direct click on Metadata button (top-right pill or action bar)
        const metaTrigger = e.target.closest(".open-metadata-btn, .photo-meta-trigger");
        if (metaTrigger) {
            e.stopPropagation();
            openMetadataModal(metaTrigger);
            return;
        }

        // 2. Direct click on Fullscreen button
        const fullscreenBtn = e.target.closest(".open-fullscreen-btn");
        if (fullscreenBtn) {
            e.stopPropagation();
            const card = fullscreenBtn.closest(".photo-card");
            const img = card ? card.querySelector("img") : null;
            if (img) openLightbox(img.src);
            return;
        }

        // 3. Tapping anywhere on a photo-card
        const card = e.target.closest(".photo-card");
        if (card) {
            // Check if card is already active
            const wasActive = card.classList.contains("is-active");

            // Deactivate other cards
            document.querySelectorAll(".photo-card.is-active").forEach(c => {
                if (c !== card) c.classList.remove("is-active");
            });

            // Toggle active state
            card.classList.toggle("is-active", !wasActive);
            return;
        }

        // 4. Clicked outside any photo card -> deactivate all active photo cards
        document.querySelectorAll(".photo-card.is-active").forEach(c => {
            c.classList.remove("is-active");
        });
    });

    // ── Smooth Scroll for #about ────────────────────────────────
    const learnMoreBtn = document.querySelector('a[href="#about"], .learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener("click", (e) => {
            const targetSection = document.getElementById("about");
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // ── Scroll Reveal System ────────────────────────────────────
    const observerOptions = {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // ── Lazy Image Observer ─────────────────────────────────────
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    obs.unobserve(entry.target);
                }
            });
        });
        document.querySelectorAll('img[loading="lazy"]').forEach(img => imageObserver.observe(img));
    }
});
