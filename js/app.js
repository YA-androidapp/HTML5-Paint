// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.

const DEFAULT_IMAGE_PATH = "img/placeholder.png";


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
    });

    // Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='popover']"));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Toast
    var liveToastButton = document.getElementById("live-toast-button");
    var liveToast = document.getElementById("live-toast");
    if (liveToastButton) {
        liveToastButton.addEventListener("click", function () {
            var toast = new bootstrap.Toast(liveToast);
            toast.show();
        });
    }

    // Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='tooltip']"));
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

const initializeUI = () => {
    document.getElementById("open-file-button").addEventListener("click", (event) => {
        let img = document.getElementById("open-file").files[0];
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function () {
            drawImage(reader.result);
        }
    });

    document.getElementById("copy-menu").addEventListener("click", () => {
        const img = document.getElementById("main-canvas");
        const canvas = document.createElement("canvas");
        canvas.width = img.width; // img.naturalWidth
        canvas.height = img.height; // img.naturalHeight
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
            // in Firefox: dom.events.asyncClipboard.clipboardItem=true
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

    document.getElementById("new-menu").addEventListener("click", () => {
        loadDefaultImage();
    });

    document.getElementById("save-as-menu").addEventListener("click", () => {
        const img = document.getElementById("main-canvas");
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.download = formatDateTime(new Date(), 'YYYYMMDDhhmmss') + '.png';
            a.href = url;
            a.click();
            a.remove();
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1E4);
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

const drawImage = (url) => {
    let mainCanvasElem = document.getElementById("main-canvas");
    if (mainCanvasElem && mainCanvasElem.getContext) {
        let context = mainCanvasElem.getContext("2d");
        let image = new Image();
        image.src = url;
        image.onload = () => {
            // mainCanvasElem.width = image.width
            // mainCanvasElem.height = image.height
            context.drawImage(image, 0, 0);
        }
    }
}

const formatDateTime = (date, format) => {
    let year_str = date.getFullYear();
    let month_str = ('0' + date.getMonth()).slice(-2);
    let day_str = ('0' + date.getDate()).slice(-2);
    let hour_str = ('0' + date.getHours()).slice(-2);
    let minute_str = ('0' + date.getMinutes()).slice(-2);
    let second_str = ('0' + date.getSeconds()).slice(-2);

    return format.replace(/YYYY/g, year_str)
        .replace(/MM/g, month_str)
        .replace(/DD/g, day_str)
        .replace(/hh/g, hour_str)
        .replace(/mm/g, minute_str)
        .replace(/ss/g, second_str);
}

const loadDefaultImage = () => {
    drawImage(DEFAULT_IMAGE_PATH);
}
