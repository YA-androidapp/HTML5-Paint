// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.
window.addEventListener('DOMContentLoaded', (event) => {
    initializeBootstrap();
    initializeUI();
    loadDefaultImage();
    checkTouchFeature();
});

const checkTouchFeature = () => {
    if (navigator.maxTouchPoints > 0) {
        hideOverlay();
    }
}

const hideOverlay = () => {
    const overlayElem = document.getElementById("overlay");
    overlayElem.style.display = "none";
}

const initializeBootstrap = () => {
    // Alerts
    let alertList = document.querySelectorAll('.alert');
    alertList.forEach(function (alert) {
        new bootstrap.Alert(alert);
    });

    const showAlertElem = document.getElementById("show-alert");
    showAlertElem.addEventListener("click", function () {
        let alertList = document.querySelectorAll('.alert');
        alertList.forEach(function (alert) {
            alert.classList.add("show");
            alert.style.display = "flex";
        })
    });

    const hideAlertElem = document.getElementById("hide-alert");
    hideAlertElem.addEventListener("click", function () {
        let alertList = document.querySelectorAll('.alert');
        alertList.forEach(function (alert) {
            alert.classList.remove("show");
            alert.style.display = "none";
        })
    });

    const infoAlertClose = document.getElementById("infoAlertClose");
    infoAlertClose.addEventListener("click", function () {
        let alert = document.getElementById("infoAlert");
        alert.classList.remove("show");
        alert.style.display = "none";
    });

    const copiedAlertClose = document.getElementById("copied-alert-close");
    copiedAlertClose.addEventListener("click", function () {
        let alert = document.getElementById("copied-alert");
        alert.classList.remove("show");
        alert.style.display = "none";
    });

    const warningAlertClose = document.getElementById("warningAlertClose");
    warningAlertClose.addEventListener("click", function () {
        let alert = document.getElementById("warningAlert");
        alert.classList.remove("show");
        alert.style.display = "none";
    });

    const dangerAlertClose = document.getElementById("dangerAlertClose");
    dangerAlertClose.addEventListener("click", function () {
        let alert = document.getElementById("dangerAlert");
        alert.classList.remove("show");
        alert.style.display = "none";
    });


    // Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    // Toast
    var toastTrigger = document.getElementById('liveToastBtn');
    var toastLiveExample = document.getElementById('liveToast');
    if (toastTrigger) {
        toastTrigger.addEventListener('click', function () {
            var toast = new bootstrap.Toast(toastLiveExample);
            toast.show();
        })
    }

    // Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

const initializeUI = () => {
    document.getElementById('copyMenu').addEventListener('click', () => {
        const img = document.getElementById('mainImg');
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
            const item = new ClipboardItem({
                'image/png': blob
            });
            await navigator.clipboard.write([item]);

            let alert = document.getElementById("copied-alert");
            alert.classList.remove("show");
            alert.classList.add("show");
            alert.style.display = "flex";
        });
    });
}

const loadDefaultImage = () => {
    var canvasElem = document.getElementById('mainImg');

    if (canvasElem && canvasElem.getContext) {
        var context = canvasElem.getContext('2d');

        var img = new Image();
        img.src = 'img/placeholder.png';
        img.onload = function onImageLoad() {
            context.drawImage(img, 0, 0);
        }
    }
}