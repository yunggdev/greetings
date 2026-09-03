// Camera and gallery handling.
// Photos are stored locally in IndexedDB when available, with localStorage fallback.

const Camera = (() => {
  let stream = null;
  let pendingPhotoData = null;
  let eximage = null;
  let db = null;

  const els = {};


  function openModal(modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    els.video.srcObject = null;
  }

  function initDB() {

    // els.placeholder.classList.add("kanjut");
    return new Promise(resolve => {
      // els.placeholder.classList.remove("hide");

      if (!("indexedDB" in window)) {
        resolve(false);
        return;
      }

      const request = indexedDB.open("GreetingWeb1001", 1);
      request.onupgradeneeded = event => {
        const database = event.target.result;
        if (!database.objectStoreNames.contains("photos")) {
          database.createObjectStore("photos");
        }
      };
      request.onsuccess = event => {
        db = event.target.result;
        resolve(true);
      };
      request.onerror = () => resolve(false);
    });


  }

  function savePhoto(dataUrl) {
    return new Promise(resolve => {
      if (!db) {
        try {
          console.log(dataUrl)
          localStorage.setItem("greeting-photo", dataUrl);
        } catch (_) { }
        resolve();
        return;
      }

      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").put(dataUrl, "current");
      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        try { localStorage.setItem("greeting-photo", dataUrl); } catch (_) { }
        resolve();
      };
    });
  }

  function loadPhoto() {
    return new Promise(resolve => {
      if (!db) {
        resolve(localStorage.getItem("greeting-photo"));
        return;
      }

      const tx = db.transaction("photos", "readonly");
      const request = tx.objectStore("photos").get("current");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(localStorage.getItem("greeting-photo"));
    });
  }

  function clearPhoto() {
    try { localStorage.removeItem("greeting-photo"); } catch (_) { }
    if (db) {
      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").delete("current");
    }
  }

  function setPolaroidImage(dataUrl) {
    // console.log(dataUrl)
    if (!dataUrl) {
      els.image.removeAttribute("src");
      els.image.classList.remove("visible");
      els.placeholder.hidden = false;
      return;
    }

    els.image.src = dataUrl;
    els.image.classList.add("visible");
    els.placeholder.classList.add("hide");
    // els.placeholder.classList.remove("kanjut");
    // els.placeholder.hidden = true;
    // els.placeholder.setAttribute("aria-hidden", "true");
  }

  async function startCamera() {
    openModal(els.cameraModal);
    els.error.hidden = true;

    if (!navigator.mediaDevices?.getUserMedia) {
      showCameraError("Kamera tidak tersedia di browser ini. Silakan gunakan Choose from Gallery.");
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      els.video.srcObject = stream;
    } catch (error) {
      console.error(error);
      showCameraError("Izin kamera ditolak atau kamera sedang digunakan. Silakan coba lagi atau pilih foto dari gallery.");
    }
  }

  function showCameraError(message) {
    els.error.textContent = message;
    els.error.hidden = false;
  }


  async function uploadToSupabase(dataUrl) {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const formData = new FormData();

      formData.append(
        "image",
        blob,
        `photobooth-${Date.now()}.jpg`
      );

      const result = await fetch(
        "https://greetings-one-chi.vercel.app/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error || "Upload gagal");
      }

      console.log("Upload Supabase berhasil:", data);
      console.log("Image URL:", data.data.img_url);

      return data.data.img_url;

    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }


  function capture() {
    console.log("masuk sini pak")
    if (!stream || !els.video.videoWidth) {
      showCameraError("Kamera belum siap. Tunggu sebentar lalu coba lagi.");
      return;
    }

    const canvas = els.canvas;
    canvas.width = els.video.videoWidth;
    canvas.height = els.video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(els.video, 0, 0, canvas.width, canvas.height);

    pendingPhotoData = canvas.toDataURL("image/jpeg", .88);
    console.log(pendingPhotoData)

    uploadToSupabase(pendingPhotoData);

    els.previewImage.src = pendingPhotoData;

    stopStream();
    closeModal(els.cameraModal);
    openModal(els.previewModal);
  }

  function acceptPendingPhoto() {
    if (!pendingPhotoData) return;
    setPolaroidImage(pendingPhotoData);
    savePhoto(pendingPhotoData);
    els.status.textContent = "Foto berhasil disimpan di polaroid ♡";
    closeModal(els.previewModal);
    pendingPhotoData = null;
  }

  function retake() {
    closeModal(els.previewModal);
    pendingPhotoData = null;
    startCamera();
  }

  function handleGallery(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      els.status.textContent = "File tersebut bukan gambar.";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      pendingPhotoData = reader.result;
      els.previewImage.src = pendingPhotoData;
      openModal(els.previewModal);
    };
    reader.readAsDataURL(file);
  }

  async function resetPhoto() {
    clearPhoto();
    setPolaroidImage(null);
    els.status.textContent = "Kembali menggunakan foto default.";
  }


  // function handlePageReload() {
  //   console.log("masuk sini pak")
  //   const navigation = performance.getEntriesByType("navigation")[0];

  //   if (navigation && navigation.type === "reload") {
  //     clearPhoto()

  //   }


  // }

  // document.addEventListener("DOMContentLoaded", handlePageReload);
  async function init() {
    els.cameraBtn = document.getElementById("cameraBtn");
    els.galleryInput = document.getElementById("galleryInput");
    els.resetPhotoBtn = document.getElementById("resetPhotoBtn");
    els.cameraModal = document.getElementById("cameraModal");
    els.previewModal = document.getElementById("previewModal");
    els.video = document.getElementById("cameraVideo");
    els.canvas = document.getElementById("cameraCanvas");
    els.error = document.getElementById("cameraError");
    els.captureBtn = document.getElementById("captureBtn");
    els.closeCameraBtn = document.getElementById("closeCameraBtn");
    els.previewImage = document.getElementById("previewImage");
    els.retakeBtn = document.getElementById("retakeBtn");
    els.usePhotoBtn = document.getElementById("usePhotoBtn");
    els.image = document.getElementById("polaroidImage");
    els.placeholder = document.getElementById("photoPlaceholder");
    els.status = document.getElementById("photoStatus");
    // els.photoPlaceholder = document.getElementById("photoPlaceholder");

    els.cameraBtn.addEventListener("click", startCamera);
    els.galleryInput.addEventListener("change", handleGallery);
    els.captureBtn.addEventListener("click", capture);
    els.closeCameraBtn.addEventListener("click", () => {
      stopStream();
      closeModal(els.cameraModal);
    });
    document.querySelector("[data-close-camera]").addEventListener("click", () => {
      stopStream();
      closeModal(els.cameraModal);
    });
    els.usePhotoBtn.addEventListener("click", acceptPendingPhoto);
    els.retakeBtn.addEventListener("click", retake);
    els.resetPhotoBtn.addEventListener("click", resetPhoto);

    await initDB();
    const saved = await loadPhoto();
    if (saved) setPolaroidImage(saved);
  }

  return { init, stopStream };
})();

export default Camera