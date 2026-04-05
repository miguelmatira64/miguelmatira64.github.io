document.addEventListener("DOMContentLoaded", () => {
    // Modal Logic for Photography Metadata
    const modal = document.getElementById("meta-modal");
    const closeBtn = document.getElementById("close-modal");

    // Helper to close modal
    const closeModal = () => {
        if (modal) modal.classList.add("hidden");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal(); // Click outside to close
        });
    }

    // Event delegation for opening the modal (works for dynamically loaded buttons too)
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".open-modal");
        if (btn && modal) {
            // Read data attributes from the clicked button
            const camera = btn.getAttribute("data-camera") || "N/A";
            const aperture = btn.getAttribute("data-aperture") || "N/A";
            const shutter = btn.getAttribute("data-shutter") || "N/A";
            const iso = btn.getAttribute("data-iso") || "N/A";
            const focal = btn.getAttribute("data-focal") || "N/A";
            const file = btn.getAttribute("data-file") || "N/A";

            // Populate modal fields
            document.getElementById("meta-camera").innerText = camera;
            document.getElementById("meta-aperture").innerText = aperture;
            document.getElementById("meta-shutter").innerText = shutter;
            document.getElementById("meta-iso").innerText = iso;
            document.getElementById("meta-focal").innerText = focal;
            document.getElementById("meta-file").innerText = file;

            // Show modal
            modal.classList.remove("hidden");
        }
    });
});
