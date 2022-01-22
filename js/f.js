// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.


// var canvas = new fabric.Canvas('canvas');
// canvas.isDrawingMode = true;


/* Free drawing */
(function () {
    var $ = function (id) { return document.getElementById(id) };

    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });

    fabric.Object.prototype.transparentCorners = false;

    var drawingModeEl = $('drawing-mode'),
        drawingOptionsEl = $('drawing-mode-options'),
        drawingColorEl = $('drawing-color'),
        drawingShadowColorEl = $('drawing-shadow-color'),
        drawingLineWidthEl = $('drawing-line-width'),
        drawingShadowWidth = $('drawing-shadow-width'),
        drawingShadowOffset = $('drawing-shadow-offset'),
        clearEl = $('clear-canvas');

    clearEl.onclick = function () { canvas.clear() };

    drawingModeEl.onclick = function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = 'Cancel drawing mode';
            drawingOptionsEl.style.display = '';
        }
        else {
            drawingModeEl.innerHTML = 'Enter drawing mode';
            drawingOptionsEl.style.display = 'none';
        }
    };

    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
        vLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var hLinePatternBrush = new fabric.PatternBrush(canvas);
        hLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
        diamondPatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('canvas');
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRect().width;

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };

        var img = new Image();
        img.src = 'img/asset/honey_im_subtle.png';

        var texturePatternBrush = new fabric.PatternBrush(canvas);
        texturePatternBrush.source = img;
    }

    $('drawing-mode-selector').onchange = function () {

        if (this.value === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
            canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            var brush = canvas.freeDrawingBrush;
            brush.color = drawingColorEl.value;
            if (brush.getPatternSrc) {
                brush.source = brush.getPatternSrc.call(brush);
            }
            brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            brush.shadow = new fabric.Shadow({
                blur: parseInt(drawingShadowWidth.value, 10) || 0,
                offsetX: 0,
                offsetY: 0,
                affectStroke: true,
                color: drawingShadowColorEl.value,
            });
        }
    };

    drawingColorEl.onchange = function () {
        var brush = canvas.freeDrawingBrush;
        brush.color = this.value;
        if (brush.getPatternSrc) {
            brush.source = brush.getPatternSrc.call(brush);
        }
    };
    drawingShadowColorEl.onchange = function () {
        canvas.freeDrawingBrush.shadow.color = this.value;
    };
    drawingLineWidthEl.onchange = function () {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function () {
        canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function () {
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.getPatternSrc) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.source = canvas.freeDrawingBrush.getPatternSrc.call(this);
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(drawingShadowWidth.value, 10) || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: drawingShadowColorEl.value,
        });
    }


    // Controls customization
    document.getElementById('rotatingPointOffset').oninput = function () {
        canvas.item(0).controls.mtr.offsetY = -parseFloat(this.value);
        canvas.requestRenderAll();
    };

    function observeBoolean(property) {
        document.getElementById(property).onclick = function () {
            canvas.item(0)[property] = this.checked;
            canvas.renderAll();
        };
    }

    function observeNumeric(property) {
        document.getElementById(property).oninput = function () {
            canvas.item(0)[property] = parseFloat(this.value);
            if (property === 'padding') {
                canvas.item(0).setCoords();
            }
            canvas.requestRenderAll();
        };
    }

    function observeValue(property) {
        document.getElementById(property).oninput = function () {
            canvas.item(0)[property] = this.value;
            canvas.requestRenderAll();
        };
    }

    function observeRadio(property) {
        document.getElementById(property).onchange = function () {
            var name = document.getElementById(this.id).name;
            canvas.item(0)[name] = this.value;
            canvas.renderAll();
        };
    }

    function observeOptionsList(property) {
        var list = document.querySelectorAll('#' + property +
            ' [type="checkbox"]');
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].onchange = function () {
                canvas.item(0)[property](this.name, this.checked);
                canvas.renderAll();
            };
        };
    }

    observeBoolean('hasControls');
    observeBoolean('hasBorders');
    observeBoolean('visible');
    observeBoolean('selectable');
    observeBoolean('evented');
    observeBoolean('transparentCorners');
    observeBoolean('centeredScaling');
    observeBoolean('centeredRotation');

    observeNumeric('padding');
    observeNumeric('cornerSize');
    observeValue('borderColor');
    observeValue('cornerColor');
    observeValue('cornerStrokeColor');
    observeRadio('cornerStyle1');
    observeRadio('cornerStyle2');

    observeOptionsList('setControlVisible');


    /* Copy and Paste */
    document.getElementById("copy").onclick = function () {
        // clone what are you copying since you
        // may want copy and paste on different moment.
        // and you do not want the changes happened
        // later to reflect on the copy.
        canvas.getActiveObject().clone(function (cloned) {
            _clipboard = cloned;
        });
    };

    document.getElementById("paste").onclick = function () {
        // clone what are you copying since you
        // may want copy and paste on different moment.
        // and you do not want the changes happened
        // later to reflect on the copy.
        canvas.getActiveObject().clone(function (cloned) {
            // clone again, so you can do multiple copies.
            _clipboard.clone(function (clonedObj) {
                canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    // active selection needs a reference to the canvas.
                    clonedObj.canvas = canvas;
                    clonedObj.forEachObject(function (obj) {
                        canvas.add(obj);
                    });
                    // this should solve the unselectability
                    clonedObj.setCoords();
                } else {
                    canvas.add(clonedObj);
                }
                _clipboard.top += 10;
                _clipboard.left += 10;
                canvas.setActiveObject(clonedObj);
                canvas.requestRenderAll();
            });
        });
    };
})();
