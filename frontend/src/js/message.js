// https://docs.google.com/spreadsheets/d/1JTDKMIY_u8_f_44ZJnvDLgiewCD5SfamywnJsQpEwt8/edit?gid=0#gid=0

const GOOGLE_SCRIPT_URL =
    import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL;
// const GOOGLE_SCRIPT_URL =
//     "https://script.google.com/macros/s/AKfycbx4Ei04SCTJ9z_12vTeLrhZ5Zp13M2PvcgtkS8p_BQwg6De_ifpFITrX3pwiL3tr8uTqw/exec";

// const form 

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log(GOOGLE_SCRIPT_URL)

function initMessageSender() {
    const senderName = document.getElementById("senderName");
    const senderMessage = document.getElementById("senderMessage");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    const messageCounter = document.getElementById("messageCounter");

    const messagePopup = document.getElementById("messagePopup");
    const messagePopupIcon = document.getElementById("messagePopupIcon");
    const messagePopupTitle = document.getElementById("messagePopupTitle");
    const messagePopupText = document.getElementById("messagePopupText");

    // Pastikan semua element tersedia
    if (
        !senderName ||
        !senderMessage ||
        !sendMessageBtn ||
        !messagePopup ||
        !messagePopupIcon ||
        !messagePopupTitle ||
        !messagePopupText
    ) {
        console.warn("Message sender: element tidak ditemukan.");
        return;
    }

    /* =========================================
       MESSAGE COUNTER
    ========================================= */

    if (messageCounter) {
        senderMessage.addEventListener("input", () => {
            messageCounter.textContent = senderMessage.value.length;
        });
    }


    /* =========================================
       SHOW POPUP
    ========================================= */

    function showPopup(icon, title, text) {
        messagePopupIcon.textContent = icon;
        messagePopupTitle.textContent = title;
        messagePopupText.textContent = text;

        messagePopup.classList.add("show");
        messagePopup.setAttribute("aria-hidden", "false");
    }


    /* =========================================
       HIDE POPUP
    ========================================= */

    function hidePopup() {
        messagePopup.classList.remove("show");
        messagePopup.setAttribute("aria-hidden", "true");
    }


    /* =========================================
       SEND MESSAGE
    ========================================= */

    sendMessageBtn.addEventListener("click", async () => {
        const name = senderName.value.trim();
        const message = senderMessage.value.trim();


        /* =====================================
           VALIDATION
        ===================================== */
        console.log(name)
        console.log(message)

        // Nama dan pesan kosong
        if (!name && !message) {
            showPopup(
                "🌷",
                "Isi dulu ya cantik",
                "Nama dan pesannya jangan lupa diisi ♡"
            );
            await wait(1700);
            hidePopup()

            return;
        }


        // Nama kosong
        if (!name) {
            showPopup(
                "🌷",
                "Nama nya di isi ya cantik",
                "Biar pembuatnya tahu siapa yang meninggalkan pesan ♡"
            );
            await wait(1700);
            hidePopup()
            senderName.focus();
            return;
        }


        // Pesan kosong
        if (!message) {
            showPopup(
                "💌",
                "Pesannya di isi dulu ya cantik",
                "Tulis sedikit pesan untuk pembuatnya ♡"
            );
            await wait(1700);
            hidePopup()
            senderMessage.focus();
            return;
        }


        /* =====================================
           SEND TO GOOGLE SHEETS
        ===================================== */

        try {
            // Cegah double click ketika sedang mengirim
            sendMessageBtn.disabled = true;
            sendMessageBtn.textContent = "💌 Sending...";


            const formData = new URLSearchParams();

            formData.append("name", name);
            formData.append("message", message);


            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                },

                body: formData.toString(),
            });


            if (!response.ok) {
                throw new Error("Gagal mengirim pesan.");
            }


            /* =====================================
               POPUP 1
            ===================================== */

            showPopup(
                "💌",
                "Pesan terkirim!",
                "Terima kasih sudah mengirim pesan ♡"
            );


            await wait(1000);


            /* =====================================
               POPUP 2
            ===================================== */

            showPopup(
                "🌸",
                "Ada bunga buat kamu!",
                "Sebentar ya cantik ♡"
            );


            await wait(1000);


            /* =====================================
               REDIRECT
            ===================================== */

            window.location.href = "flower.html";


        } catch (error) {
            console.error("Message sender error:", error);


            showPopup(
                "🥺",
                "Pesannya belum terkirim",
                "Coba lagi ya cantik ♡"
            );


            sendMessageBtn.disabled = false;
            sendMessageBtn.textContent = "💌 Send Message";
        }
    });


    /* =========================================
       RETURN PUBLIC API
    ========================================= */

    return {
        showPopup,
        hidePopup,
    };
}


/* =========================================
   DEFAULT EXPORT
========================================= */

export default initMessageSender;

