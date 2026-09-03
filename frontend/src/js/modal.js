const Modal = (() => {

    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.getElementById("photoModal");
        const modalImage = document.getElementById("modalImage");
        const modalDescription = document.getElementById("modalDescription");
        const modalDate = document.getElementById("modalDate");
        const closeModal = document.getElementById("closeModal");

        const cards = document.querySelectorAll(".photo-card");


        // Ketika card diklik
        cards.forEach((card) => {
            card.addEventListener("click", () => {

                const image = card.dataset.img;
                const description = card.dataset.description;
                const date = card.dataset.date;

                // Masukkan data ke modal
                modalImage.src = image;
                modalDescription.textContent = description;
                modalDate.textContent = date;

                // Tampilkan modal
                modal.classList.add("active");

                // Stop halaman agar tidak scroll
                document.body.style.overflow = "hidden";
            });
        });


        // Tutup modal dengan tombol X
        closeModal.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        });


        // Tutup jika klik area luar modal
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("active");
                document.body.style.overflow = "";
            }
        });


        // Tutup dengan tombol ESC
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                modal.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    });

})();

export default Modal
