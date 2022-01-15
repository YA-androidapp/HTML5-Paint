// https://nullpon.moe/dev/sample/canvas/bucketfill.html

class CanvasPixels {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
        this.pixels = this.imageData.data;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    getColor(x, y) {
        const p = ((this.width * y) + x) * 4;
        if (p < this.pixels.length) {
            return new Color(this.pixels[p], this.pixels[p + 1], this.pixels[p + 2]);
        } else {
            return new Color(0, 0, 0)
        }
    }

    setColor(color, x, y) {
        const p = ((this.width * y) + x) * 4;
        this.pixels[p] = color.r;
        this.pixels[p + 1] = color.g;
        this.pixels[p + 2] = color.b;
    }

    updateCanvas() {
        this.context.putImageData(this.imageData, 0, 0);
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    equals(other) {
        return this.r === other.r && this.g === other.g && this.b === other.b;
    }

    static fromHexCode(hex) {
        return new Color(
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16)
        );
    }
}

class BucketFill {
    constructor(canvas) {
        this.canvas = canvas;
    }

    #drawToRight(fillColor, xFrom, y) {
        let rightEnd = null;
        for (let x = xFrom; x < this.pixels.width; x++) {  // →に塗り進む
            if (!this.seedColor.equals(this.pixels.getColor(x, y))) break; // seedでない色に達したら終了
            this.pixels.setColor(fillColor, x, y);
            rightEnd = x;
        }
        return rightEnd; // 塗りつぶした右端の位置を返す
    }

    #drawToLeft(fillColor, xFrom, y) {
        let leftEnd = null;
        for (let x = xFrom; x >= 0; x--) {  // ←に塗り進む
            if (!this.seedColor.equals(this.pixels.getColor(x, y))) break; // seedでない色に達したら終了
            this.pixels.setColor(fillColor, x, y);
            leftEnd = x;
        }
        return leftEnd;  // 塗りつぶした左端の位置を返す
    }

    #updateSeeds({ xFrom, xTo, y }) {
        if (y < 0 || this.pixels.height <= y) {
            return;
        }

        let prevIsSeed = false;
        for (let x = xFrom; x <= xTo; x++) {
            if (this.pixels.getColor(x, y).equals(this.seedColor)) {
                if (!prevIsSeed) {
                    this.seeds.push({ x, y });
                }
                prevIsSeed = true
            } else {
                prevIsSeed = false;
            }
        }
    }

    draw(fillColor, x, y) {
        if (x >= this.canvas.width && y >= this.canvas.height) return;

        this.seeds = [{ x, y }];
        this.pixels = new CanvasPixels(this.canvas);
        this.seedColor = this.pixels.getColor(x, y);

        if (fillColor.equals(this.seedColor)) {
            return;
        }

        while (this.seeds.length > 0) {
            const seed = this.seeds.pop();
            const x = seed.x;
            const y = seed.y;
            const leftEndX = this.#drawToLeft(fillColor, x, y) ?? x;
            const rightEndX = this.#drawToRight(fillColor, x + 1, y) ?? x;
            this.#updateSeeds({ xFrom: leftEndX, xTo: rightEndX, y: y + 1 });
            this.#updateSeeds({ xFrom: leftEndX, xTo: rightEndX, y: y - 1 });
        }

        this.pixels.updateCanvas();
    }
}
