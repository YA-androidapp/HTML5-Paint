// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.
window.addEventListener("DOMContentLoaded", (event) => {
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
    let alertList = document.querySelectorAll(".alert");
    alertList.forEach(function (alert) {
        new bootstrap.Alert(alert);
    });

    const showAlertElem = document.getElementById("show-alert");
    showAlertElem.addEventListener("click", function () {
        let alertList = document.querySelectorAll(".alert");
        alertList.forEach(function (alert) {
            alert.classList.add("show");
            alert.style.display = "flex";
        })
    });

    const alertCloseButtons = [
        document.getElementById("info-alert-close"),
        document.getElementById("copied-alert-close"),
        document.getElementById("warning-alert-close"),
        document.getElementById("danger-alert-close")
    ];

    alertCloseButtons.forEach((element) => {
        element.addEventListener("click", function () {
            let alert = element.parentElement;
            alert.classList.remove("show");
            alert.style.display = "none";
        });
    })

    // Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='popover']"))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    // Toast
    var liveToastButton = document.getElementById("live-toast-button");
    var liveToast = document.getElementById("live-toast");
    if (liveToastButton) {
        liveToastButton.addEventListener("click", function () {
            var toast = new bootstrap.Toast(liveToast);
            toast.show();
        })
    }

    // Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='tooltip']"))
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

const initializeUI = () => {
    document.getElementById("copy-menu").addEventListener("click", () => {
        const img = document.getElementById("main-canvas");
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
            const item = new ClipboardItem({
                "image/png": blob
            });
            await navigator.clipboard.write([item]);

            let alert = document.getElementById("copied-alert");
            alert.classList.remove("show");
            alert.classList.add("show");
            alert.style.display = "flex";
        });
    });

    const sidePenSize = document.getElementById("side-pen-size");
    sidePenSize.title = sidePenSize.value;
    sidePenSize.addEventListener("input", (event) => {
        sidePenSize.title = event.target.value;
    });
    sidePenSize.addEventListener("change", (event) => {
        sidePenSize.title = event.target.value;
    });
}

const loadDefaultImage = () => {
    var mainCanvasElem = document.getElementById("main-canvas");

    if (mainCanvasElem && mainCanvasElem.getContext) {
        var context = mainCanvasElem.getContext("2d");

        var img = new Image();
        img.src = "img/placeholder.png";
        img.onload = function onImageLoad() {
            context.drawImage(img, 0, 0);
        }
    }
}