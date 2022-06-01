// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.


const fonts = '"游ゴシック体", YuGothic, "游ゴシック", "Yu Gothic", sans-serif';


window.addEventListener("DOMContentLoaded", (event) => {
    initializeFillText();
});


const initializeFillText = () => {
    document.getElementById("side-filltext-reflect").addEventListener("click", (event) => {
        reflectText();
    });

    document.getElementById("side-filltext-text").addEventListener("change", (event) => {
        previewText();
    });

    document.getElementById("side-filltext-text").addEventListener("keydown", (event) => {
        previewText();
    });

    document.getElementById("side-filltext-x").addEventListener("change", (event) => {
        previewText();
    });

    document.getElementById("side-filltext-y").addEventListener("change", (event) => {
        previewText();
    });

    document.getElementById("side-filltext-size").addEventListener("change", (event) => {
        previewText();
    });
}

const previewText = () => {
    const subCanvasElem = document.getElementById("sub-canvas");
    if (subCanvasElem && subCanvasElem.getContext) {
        const text = document.getElementById("side-filltext-text").value;

        const size = document.getElementById("side-filltext-size").value;
        const x = document.getElementById("side-filltext-x").value;
        const y = document.getElementById("side-filltext-y").value;

        let mainContext = subCanvasElem.getContext("2d");
        mainContext.clearRect(0, 0, subCanvasElem.width, subCanvasElem.height);

        mainContext.fillStyle = document.getElementById("side-color").value;
        mainContext.font = 'normal ' + size + 'pt ' + fonts;
        mainContext.strokeStyle = document.getElementById("side-color").value;

        mainContext.fillText(text, x, y);
        mainContext.strokeText(text, x, y);
    }
}

const reflectText = () => {
    const mainCanvasElem = document.getElementById("main-canvas");
    if (mainCanvasElem && mainCanvasElem.getContext) {
        const text = document.getElementById("side-filltext-text").value;
        if (text.length > 0) {
            const size = document.getElementById("side-filltext-size").value;
            const x = document.getElementById("side-filltext-x").value;
            const y = document.getElementById("side-filltext-y").value;

            let mainContext = mainCanvasElem.getContext("2d");
            mainContext.fillStyle = document.getElementById("side-color").value;
            mainContext.font = 'normal ' + size + 'pt ' + fonts;
            mainContext.strokeStyle = document.getElementById("side-color").value;

            mainContext.fillText(text, x, y);
            mainContext.strokeText(text, x, y);

            const subCanvasElem = document.getElementById("sub-canvas");
            if (subCanvasElem && subCanvasElem.getContext) {
                let subContext = subCanvasElem.getContext("2d");
                subContext.clearRect(0, 0, subCanvasElem.width, subCanvasElem.height);

                document.getElementById("side-filltext-size").value = 64;
                document.getElementById("side-filltext-text").value = "";
                document.getElementById("side-filltext-x").value = 100;
                document.getElementById("side-filltext-y").value = 100;
            }
        }
    }
}
