// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.

const DEFAULT_IMAGE_PATH = "img/placeholder.png";


let isManualChangedFromLocalStorage = false;


window.addEventListener("DOMContentLoaded", (event) => {
    initializeBootstrap();
    initializeUI();
    checkTouchFeature();
});

const checkTouchFeature = () => {
    hideOverlay();
}

const hideOverlay = () => {
    const overlayElem = document.getElementById("overlay");
    overlayElem.style.display = "none";
}

const initializeBootstrap = () => {
    let alertList = document.querySelectorAll(".alert");
    alertList.forEach((alert) => {
        new bootstrap.Alert(alert);
    });

    const alertCloseButtons = [
        document.getElementById("copied-alert-close")
    ];

    alertCloseButtons.forEach((element) => {
        element.addEventListener("click", () => {
            let alert = element.parentElement;
            alert.classList.remove("show");
            alert.style.display = "none";
        });
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='popover']"));
    var popoverList = popoverTriggerList.map((popoverTriggerEl) => {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    var liveToastButton = document.getElementById("about-menu");
    var liveToast = document.getElementById("live-toast");
    if (liveToastButton) {
        liveToastButton.addEventListener("click", () => {
            var toast = new bootstrap.Toast(liveToast);
            toast.show();
        });
    }

    localStorageModal = new bootstrap.Modal(document.getElementById("localStorageModal"), { backdrop: true });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='tooltip']"));
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

const initializeUI = () => {
    window.addEventListener("beforeunload", (event) => {
        saveToLocalStorage();
    });

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey === true) {
            switch (event.key.toLowerCase()) {
                case "c":
                    copyImage();
                    return false;
                case "v":
                    pasteImage();
                    return false;
                default:
                    break;
            }
        }
    });

    document.getElementById("open-file-button").addEventListener("click", (event) => {
        let img = document.getElementById("open-file").files[0];
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => {
            openImage(reader.result);
        }
    });

    document.getElementById("copy-menu").addEventListener("click", () => {
        copyImage();
    });

    document.getElementById("new-menu").addEventListener("click", () => {
        clearCanvas();
    });

    document.getElementById("paste-menu").addEventListener("click", () => {
        pasteImage()
    });

    document.getElementById("save-as-menu").addEventListener("click", () => {
        const mainCanvasElem = document.getElementById("main-canvas");

        mainCanvasElem.toBlob(async (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.download = formatDateTime(new Date(), "YYYYMMDDhhmmss") + ".png";
            a.href = url;
            a.click();
            a.remove();
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1E4);
        });
    });

    document.getElementById("read-ls-menu").addEventListener("click", () => {
        if (storageAvailable("localStorage")) {
            let localStorageKeys = [];

            const imageArea = document.getElementById("localStorageModalImages");
            imageArea.innerHTML = "";

            for (key in localStorage) {
                if (localStorage.hasOwnProperty(key) && !isNaN(key)) {
                    localStorageKeys.push(key);
                }
            }
            localStorageKeys.sort((a, b) => -1 * (a - b));
            localStorageKeys.forEach((item) => {
                const itemImg = document.createElement("img");
                itemImg.title = displayDateTimeString(item);
                itemImg.classList.add("img-thumbnail");
                itemImg.src = localStorage[item];
                itemImg.style.width = "20%";

                itemImg.setAttribute("data-bs-dismiss", "modal");
                itemImg.setAttribute("aria-label", "Close");

                itemImg.addEventListener("click", (e) => {
                    const mainCanvasElem = document.getElementById("main-canvas");
                    const context = mainCanvasElem.getContext("2d")
                    const img = new Image()
                    img.onload = (event) => {
                        URL.revokeObjectURL(event.target.src);
                        context.drawImage(event.target, 0, 0);
                        isManualChangedFromLocalStorage = false;
                    }
                    img.src = e.target.src;
                });

                imageArea.appendChild(itemImg);
            });

            localStorageModal.show();
        }
    });

    document.getElementById("write-ls-menu").addEventListener("click", () => {
        saveToLocalStorage(true);
    });

    document.getElementById("clear-ls-button").addEventListener("click", () => {
        if (storageAvailable("localStorage")) {
            localStorage.clear();

            isManualChangedFromLocalStorage = false;
        }
    });

    const sidePenSize = document.getElementById("side-pen-size");
    sidePenSize.title = sidePenSize.value;
    sidePenSize.addEventListener("input", (event) => {
        sidePenSize.title = event.target.value;
    });
    sidePenSize.addEventListener("change", (event) => {
        sidePenSize.title = event.target.value;
    });

    document.getElementById("side-color-black").addEventListener("click", () => {
        document.getElementById("side-color").value = "#000000";
    });

    document.getElementById("side-color-white").addEventListener("click", () => {
        document.getElementById("side-color").value = "#ffffff";
    });

    document.getElementById("side-color-red").addEventListener("click", () => {
        document.getElementById("side-color").value = "#ff0000";
    });

    document.getElementById("side-color-orange").addEventListener("click", () => {
        document.getElementById("side-color").value = "#ff6600";
    });

    document.getElementById("side-color-yellow").addEventListener("click", () => {
        document.getElementById("side-color").value = "#ffff00";
    });

    document.getElementById("side-color-green").addEventListener("click", () => {
        document.getElementById("side-color").value = "#00ff00";
    });

    document.getElementById("side-color-aqua").addEventListener("click", () => {
        document.getElementById("side-color").value = "#00ffff";
    });

    document.getElementById("side-color-blue").addEventListener("click", () => {
        document.getElementById("side-color").value = "#0000ff";
    });

    document.getElementById("side-color-magenta").addEventListener("click", () => {
        document.getElementById("side-color").value = "#ff00ff";
    });

    setCanvasSize();

    clearCanvas();
}

const clearCanvas = () => {
    saveToLocalStorage();

    const mainCanvasElem = document.getElementById("main-canvas");
    if (mainCanvasElem && mainCanvasElem.getContext) {
        let context = mainCanvasElem.getContext("2d");
        context.clearRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);

        context.fillStyle = "white";
        context.fillRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);
    }
}

const openImage = (url) => {
    const mainCanvasElem = document.getElementById("main-canvas");
    if (mainCanvasElem && mainCanvasElem.getContext) {
        let context = mainCanvasElem.getContext("2d");
        context.clearRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);

        context.fillStyle = "white";
        context.fillRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);

        let image = new Image();
        image.src = url;
        image.onload = () => {
            context.drawImage(image, 0, 0);
        }
    }
}

const displayDateTimeString = (dateString) => {
    return dateString.substring(0, 4) + "/" +
        dateString.substring(4, 6) + "/" +
        dateString.substring(6, 8) + " " +
        dateString.substring(8, 10) + ":" +
        dateString.substring(10, 12) + ":" +
        dateString.substring(12, 14)
}

const formatDateTime = (date, format) => {
    let year_str = date.getFullYear();
    let month_str = ("0" + date.getMonth()).slice(-2);
    let day_str = ("0" + date.getDate()).slice(-2);
    let hour_str = ("0" + date.getHours()).slice(-2);
    let minute_str = ("0" + date.getMinutes()).slice(-2);
    let second_str = ("0" + date.getSeconds()).slice(-2);

    return format.replace(/YYYY/g, year_str)
        .replace(/MM/g, month_str)
        .replace(/DD/g, day_str)
        .replace(/hh/g, hour_str)
        .replace(/mm/g, minute_str)
        .replace(/ss/g, second_str);
}

const saveToLocalStorage = (forceUpdate = false) => {
    if (forceUpdate || isManualChangedFromLocalStorage) {
        if (storageAvailable("localStorage")) {
            const key = formatDateTime(new Date(), "YYYYMMDDhhmmss");

            const mainCanvasElem = document.getElementById("main-canvas");
            if (mainCanvasElem) {
                localStorage[key] = mainCanvasElem.toDataURL();
            }
        }
    }
}

const setCanvasSize = () => {
    const mainCanvasElem = document.getElementById("main-canvas");
    const parentElem = mainCanvasElem.parentElement;
    const h = parentElem.clientHeight;
    const w = parentElem.clientWidth;

    mainCanvasElem.setAttribute("width", w);
    mainCanvasElem.setAttribute("height", h);
    mainCanvasElem.style.width = w + "px";
    mainCanvasElem.style.height = h + "px";
}

const storageAvailable = (type) => {
    var storage;
    try {
        storage = window[type];
        var x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            (storage && storage.length !== 0);
    }
}



const copyImage = () => {
    const mainCanvasElem = document.getElementById("main-canvas");

    mainCanvasElem.toBlob(async (blob) => {
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
}

const pasteImage = () => {
    const mainCanvasElem = document.getElementById("main-canvas");

    try {
        navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.read().then((data) => {
                    data.forEach((item) => {
                        if (item.types.includes("image/png")) {
                            item.getType("image/png").then((blob) => {
                                const context = mainCanvasElem.getContext("2d")
                                const img = new Image()
                                img.onload = (event) => {
                                    URL.revokeObjectURL(event.target.src);
                                    context.drawImage(event.target, 0, 0);
                                }
                                img.src = URL.createObjectURL(blob)
                            });
                        }
                    });
                });
            }
        });
    } catch (err) {
        // TODO: Firefox

    }
}
