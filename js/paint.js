// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.


let isDragging = false;
let lastPosition;


window.addEventListener("DOMContentLoaded", (event) => {
    init();
});


const clear = () => {
    const mainCanvasElem = document.getElementById("main-canvas");
    const context = mainCanvasElem.getContext("2d");

    context.clearRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);
}

const getPosition = (e) => {
    const mainCanvasElem = document.getElementById("main-canvas");

    let x = e.clientX - mainCanvasElem.getBoundingClientRect().left,
        y = e.clientY - mainCanvasElem.getBoundingClientRect().top;
    return [x, y];
}

const getPositionString = (position) => {
    return " (" + position[0] + ", " + position[1] + ")";
}

const init = () => {
    const mainCanvasElem = document.getElementById("main-canvas");
    const context = mainCanvasElem.getContext("2d");

    context.strokeStyle = document.getElementById("side-color").value;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = document.getElementById("side-pen-size").value;

    mainCanvasElem.addEventListener("mousedown", function (e) {
        let checkElem = document.getElementById("side-bucket");
        if (checkElem && checkElem.checked) {
            const x = e.offsetX || e.layerX;
            const y = e.offsetY || e.layerY;
            const hexColorCode = document.getElementById("side-color").value;
            const bucketFill = new BucketFill(mainCanvasElem);
            bucketFill.draw(Color.fromHexCode(hexColorCode), x, y);

            checkElem.checked = false;
        } else {
            mouseDown(getPosition(e));
        }
    });

    mainCanvasElem.addEventListener("mouseup", function (e) {
        let checkElem = document.getElementById("side-bucket");
        if (!checkElem || !checkElem.checked) {
            mouseUp(getPosition(e));
        }
    });

    mainCanvasElem.addEventListener("mousemove", function (e) {
        let checkElem = document.getElementById("side-bucket");
        if (!checkElem || !checkElem.checked) {
            mouseMove(getPosition(e));
        }
    });

    mainCanvasElem.addEventListener("touchstart", function (e) {
        let checkElem = document.getElementById("side-bucket");
        if (checkElem && checkElem.checked) {
            const x = e.offsetX || e.layerX;
            const y = e.offsetY || e.layerY;
            const hexColorCode = document.getElementById("side-color").value;
            const bucketFill = new BucketFill(mainCanvasElem);
            bucketFill.draw(Color.fromHexCode(hexColorCode), x, y);

            checkElem.checked = false;
        } else {
            if (e.changedTouches.length == 1) {
                mouseDown(getPosition(e.changedTouches[0]));
            }
        }
    });

    mainCanvasElem.addEventListener("touchend", function (e) {
        let checkElem = document.getElementById("side-bucket");
        if (!checkElem || !checkElem.checked) {
            if (e.changedTouches.length == 1) {
                mouseUp(getPosition(e.changedTouches[0]));
            }
        }
    });

    mainCanvasElem.addEventListener("touchmove", function (e) {
        e.preventDefault();

        let checkElem = document.getElementById("side-bucket");
        if (!checkElem || !checkElem.checked) {
            if (e.changedTouches.length == 1) {
                mouseMove(getPosition(e.changedTouches[0]));
            }
        }
    });
}

const mouseDown = (position) => {
    const mainCanvasElem = document.getElementById("main-canvas");
    const context = mainCanvasElem.getContext("2d");

    isDragging = true;
    context.beginPath();
    lastPosition = position;

    isManualChangedFromLocalStorage = true;
}

const mouseMove = (position) => {
    if (isDragging) {
        const mainCanvasElem = document.getElementById("main-canvas");
        const context = mainCanvasElem.getContext("2d");

        context.strokeStyle = document.getElementById("side-color").value;
        context.lineWidth = document.getElementById("side-pen-size").value;

        context.moveTo(lastPosition[0], lastPosition[1]);
        context.lineTo(position[0], position[1]);
        context.stroke();
        lastPosition = position;
    }
}

const mouseUp = (position) => {
    const mainCanvasElem = document.getElementById("main-canvas");
    const context = mainCanvasElem.getContext("2d");

    mouseMove(position);
    context.closePath();
    isDragging = false;
}
