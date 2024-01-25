export class GeometryCircle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.g_type = "circle";
    }
}

export class GeometryLine {
    constructor(x1, y1, x2, y2, shortening = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.g_type = "line";

        let l = Math.hypot(x2 - x1, y2 - y1);

        this.sx = (x2 - x1) / l * shortening;
        this.sy = (y2 - y1) / l * shortening;
    }

    get sx1() {
        return this.x1 + this.sx;
    }

    get sy1() {
        return this.y1 + this.sy;
    }

    get sx2() {
        return this.x2 - this.sx;
    }

    get sy2() {
        return this.y2 - this.sy;
    }

    get x() {
        return this.x1;
    }

    get y() {
        return this.y1;
    }

    set x(v) {
        this.x2 += v - this.x1;
        this.x1 = v;
    }

    set y(v) {
        this.y2 += v - this.y1;
        this.y1 = v;
    }
}


export class GeometryText {
    constructor(x, y, text, size, align = "center", baseline = "middle") {
        text = text.toString();
        this.x = x;
        this.y = y;
        this.text = text;
        this.align = align;
        this.baseline = baseline;
        this.size = size;
        this.g_type = "text";
    }
}

export class GeometrySpace {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.content = [];
    }

    insert(thing) {
        this.content.push(thing);
    }

    project(dx, dy, otherSpace) {
        for (let thing of otherSpace.content) {
            thing.x += dx;
            thing.y += dy;
            this.insert(thing);
        }
    }
}
