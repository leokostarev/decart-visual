export class GeometryCircle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.g_type = "circle";
    }
}

export class GeometryLine {
    constructor(x1, y1, x2, y2) {
        this.x = x1;
        this.y = y1;
        this.dx = x2 - x1;
        this.dy = y2 - y1;
        this.g_type = "line";
    }

    shorten_by(dist) {
        let len = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        let direction_x = this.dx * dist / len;
        let direction_y = this.dy * dist / len;

        this.x += direction_x;
        this.y += direction_y;
        this.dx -= direction_x * 2;
        this.dy -= direction_y * 2;
    }

    get x1() {
        return this.x;
    }

    get y1() {
        return this.y;
    }

    get x2() {
        return this.x + this.dx;
    }

    get y2() {
        return this.y + this.dy;
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
