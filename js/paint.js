// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.

let mainCanvasElem = document.getElementById("main-canvas");
let context = mainCanvasElem.getContext("2d");
let isDragging = false;
let lastPosition;


window.addEventListener("DOMContentLoaded", (event) => {
    init();
});


const move = (position) => {
    if (isDragging) {
        context.strokeStyle = document.getElementById("side-color").value;
        context.lineWidth = document.getElementById("side-pen-size").value;

        context.moveTo(lastPosition[0], lastPosition[1]);
        context.lineTo(position[0], position[1]);
        context.stroke();
        lastPosition = position;
    }
}

const down = (position) => {
    isDragging = true;
    context.beginPath();
    lastPosition = position;
}

const up = (position) => {
    move(position);
    context.closePath();
    isDragging = false;
}

const getPosition = (e) => {
    let x = e.clientX - mainCanvasElem.getBoundingClientRect().left,
        y = e.clientY - mainCanvasElem.getBoundingClientRect().top;
    return [x, y];
}

const getPositionString = (position) => {
    return " (" + position[0] + ", " + position[1] + ")";
}

const log = (message) => {
    let current = document.getElementById("message").textContent;
    message = current + "\n" + message;
    document.getElementById("message").innerHTML = message;
}

const init = () => {
    let message;

    context.strokeStyle = document.getElementById("side-color").value;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = document.getElementById("side-pen-size").value;

    mainCanvasElem.addEventListener("mousedown", function (e) {
        log("mousedown" + getPositionString(getPosition(e)));
        down(getPosition(e));
    });

    mainCanvasElem.addEventListener("mouseup", function (e) {
        log("mouseup" + getPositionString(getPosition(e)));
        up(getPosition(e));
    });

    mainCanvasElem.addEventListener("click", function (e) {
        log("click" + getPositionString(getPosition(e)));
    });

    mainCanvasElem.addEventListener("mousemove", function (e) {
        move(getPosition(e));
    });

    mainCanvasElem.addEventListener("touchstart", function (e) {
        message = "touchstart";
        e.changedTouches.forEach(function (item) {
            message += getPositionString(getPosition(item));
        });
        log(message);
        if (e.changedTouches.length == 1) {
            down(getPosition(e.changedTouches[0]));
        }
    });

    mainCanvasElem.addEventListener("touchcancel", function (e) {
        message = "touchcancel";
        e.changedTouches.forEach(function (item) {
            message += getPositionString(getPosition(item));
        });
        log(message);
    });

    mainCanvasElem.addEventListener("touchend", function (e) {
        message = "touchend";
        e.changedTouches.forEach(function (item) {
            message += getPositionString(getPosition(item));
        });
        log(message);
        if (e.changedTouches.length == 1) {
            up(getPosition(e.changedTouches[0]));
        }
    });

    mainCanvasElem.addEventListener("touchmove", function (e) {
        message = "touchmove";
        e.changedTouches.forEach(function (item) {
            message += getPositionString(getPosition(item));
        });
        if (e.changedTouches.length == 1) {
            move(getPosition(e.changedTouches[0]));
        }
    });
}

const clear = () => {
    context.clearRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);
    document.getElementById("message").innerHTML = "";
}