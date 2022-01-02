// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.
window.addEventListener('DOMContentLoaded', (event) => {
    // Alerts
    let alertList = document.querySelectorAll('.alert');
    console.log("alertList", alertList);
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
});
