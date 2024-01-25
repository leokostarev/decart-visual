import {random_tree_with_n_nodes, tree_by_keys_and_values} from "./decart-logic.js";
import {tree_to_space} from "./transform-logic.js";
import {GeometrySpace} from "./geometry-logic.js";

const SPEED_FACTOR = 2.4;
const DEBUG = false;

const applyButton = document.getElementById("set-user-data");
const randomButton = document.getElementById("set-random");
const userData = document.getElementById("user-data");
const canvas = document.getElementById("canvas");

const increaseButton = document.getElementById("increase-size");
const decreaseButton = document.getElementById("decrease-size");

const closePopup = document.getElementById("close-popup");
const showPopup = document.getElementById("show-popup");
const popup = document.getElementById("rules-popup");

const ctx = canvas.getContext("2d");

let canvasRect = canvas.getBoundingClientRect();
canvas.width = canvasRect.width * 2;
canvas.height = canvasRect.height * 2;

function extractScreenPos(event) {
    let t = event.touches[0];
    return [t.screenX, t.screenY];
}

const mouse = {
    delta_x: 0, delta_y: 0, delta_scale: 0, prev_x: 0, prev_y: 0, drag: false,

    // mouse event handlers
    handle_mouse_up(event) {
        event.preventDefault();
        mouse.drag = false;
    },

    handle_mouse_down(event) {
        event.preventDefault();

        mouse.drag = true;
    },

    handle_mouse_move(event) {
        event.preventDefault();

        if (mouse.drag) {
            mouse.delta_x += event.movementX;
            mouse.delta_y += event.movementY;
        }

        mouse.prev_x = event.offsetX;
        mouse.prev_y = event.offsetY;
    },

    handle_mouse_wheel(event) {
        event.preventDefault();

        mouse.delta_scale -= event.deltaY;
    },

    handle_mouse_out(event) {
        event.preventDefault();

        mouse.drag = false;
        mouse.delta_x = 0;
        mouse.delta_y = 0;
        mouse.delta_scale = 0;
    },

    // touch event handlers

    handle_touch_down(event) {
        event.preventDefault();

        if (event.touches.length !== 1) {
            return;
        }
        mouse.drag = true;
        [mouse.prev_x, mouse.prev_y] = extractScreenPos(event);
    },

    handle_touch_up(event) {
        event.preventDefault();

        if (event.touches.length !== 0) {
            return;
        }
        mouse.drag = false;
    },

    handle_touch_move(event) {
        event.preventDefault();

        if (event.touches.length !== 1) {
            return;
        }
        if (mouse.drag) {
            console.log(event.touches);
            let pos = extractScreenPos(event);
            mouse.delta_x += pos[0] - mouse.prev_x;
            mouse.delta_y += pos[1] - mouse.prev_y;
            [mouse.prev_x, mouse.prev_y] = pos;
        }
    },

    update() {
        let changed = false;
        if (mouse.delta_scale) {
            panZoom.scaleAt(mouse.prev_x, mouse.prev_y, Math.exp(mouse.delta_scale / 1000));
            mouse.delta_scale = 0;
            changed = true;
        }

        if (mouse.delta_x !== 0 || mouse.delta_y !== 0) {
            panZoom.x += mouse.delta_x * SPEED_FACTOR;
            panZoom.y += mouse.delta_y * SPEED_FACTOR;
            mouse.delta_x = 0;
            mouse.delta_y = 0;
            changed = true;
        }

        return changed;
    },
};


const panZoom = {
    x:     0,
    y:     0,
    scale: 1,

    apply() {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.x, this.y);
    },

    scaleAt(x, y, sc) {  // x & y are screen coords, not world
        this.scale *= sc;
        x *= 2; // holyhell
        y *= 2;
        this.x = x + (this.x - x) * sc;
        this.y = y + (this.y - y) * sc;
    },

    toWorld(x, y) {   // converts from screen coords to world coords
        const inv = 1 / this.scale;
        return {
            x: (x - this.x) * inv,
            y: (y - this.y) * inv,
        };
    },
};


let space = new GeometrySpace(0, 0);


function draw_everything(thick_mode = false) {
    { // clear canvas
        ctx.fillStyle = "white";
        let {x, y} = panZoom.toWorld(0, 0);
        ctx.clearRect(x, y, canvas.width / panZoom.scale, canvas.height / panZoom.scale);
    }

    { // draw tree
        ctx.fillStyle = "black";

        if (thick_mode) {
            ctx.lineWidth = 100;
            for (let thing of space.content) {
                if (thing.g_type === "line") {
                    ctx.beginPath();
                    ctx.moveTo(thing.x1, thing.y1);
                    ctx.lineTo(thing.x2, thing.y2);
                    ctx.stroke();
                }
            }

        } else {
            ctx.lineWidth = 15;

            for (let thing of space.content) {

                if (thing.g_type === "circle") {
                    ctx.beginPath();
                    ctx.arc(thing.x, thing.y, thing.radius, 0, 2 * Math.PI);
                    ctx.stroke();

                } else if (thing.g_type === "line") {
                    ctx.beginPath();
                    ctx.moveTo(thing.sx1, thing.sy1);
                    ctx.lineTo(thing.sx2, thing.sy2);
                    ctx.stroke();

                } else if (thing.g_type === "text") {
                    ctx.textAlign = thing.align;
                    ctx.textBaseline = thing.baseline;
                    ctx.font = `${thing.size}px monospace`;
                    ctx.fillText(thing.text, thing.x, thing.y);
                }
            }
        }
    }

    if (DEBUG) { // draw axes
        ctx.beginPath();
        ctx.moveTo(1000, 0);
        ctx.lineTo(-1000, 0);
        ctx.moveTo(0, 1000);
        ctx.lineTo(0, -1000);
        ctx.stroke();
    }
}

function update(forced = false) {
    const changed = mouse.update();
    if (changed || forced) {
        panZoom.apply();
        draw_everything(panZoom.scale < 0.2);
    }
    requestAnimationFrame(update);
}


requestAnimationFrame(() => update(true));

function setTree(tree) {
    let [_space, root] = tree_to_space(tree);
    if (root) {
        panZoom.x = canvas.width / 2 - root.x;
    }
    panZoom.y = 0;
    panZoom.scale = 1;
    space = _space;
}

function setRandomTree() {
    let n = parseInt(prompt("Enter number of nodes: ", "30"));
    setTree(random_tree_with_n_nodes(n));
}

function setUserTree() {
    try {
        let dat = userData.value
                          .split("\n")
                          .filter(x => x)
                          .map(line => {
                              let nums = line
                                  .split(" ")
                                  .filter(x => x)
                                  .map(Number);
                              if (nums.length >= 3) {
                                  throw Error("Too many numbers in line(max 2): " + line);
                              }
                              return nums;
                          });

        setTree(tree_by_keys_and_values(dat));
    } catch (e) {
        alert(e);
    }
}


function setPopupVisibility(x) {
    popup.style.display = x ? "grid" : "none";
}


function increaseSize() {
    panZoom.scaleAt(canvas.width / 4, canvas.height / 4, 1.1);
}

function decreaseSize() {
    panZoom.scaleAt(canvas.width / 4, canvas.height / 4, 0.9);
}

setTree(random_tree_with_n_nodes(10));

canvas.addEventListener("mousedown", mouse.handle_mouse_down);
canvas.addEventListener("mouseup", mouse.handle_mouse_up);
canvas.addEventListener("mousemove", mouse.handle_mouse_move);
canvas.addEventListener("wheel", mouse.handle_mouse_wheel);
canvas.addEventListener("mouseout", mouse.handle_mouse_out);
canvas.addEventListener("touchmove", mouse.handle_touch_move);
canvas.addEventListener("touchstart", mouse.handle_touch_down);
canvas.addEventListener("touchend", mouse.handle_touch_up);
applyButton.addEventListener("click", setUserTree);
randomButton.addEventListener("click", setRandomTree);

increaseButton.addEventListener("click", increaseSize);
document.addEventListener("keypress", event => {
    if (event.key === "=") increaseSize();
});

decreaseButton.addEventListener("click", decreaseSize);
document.addEventListener("keypress", event => {
    if (event.key === "-") decreaseSize();
});

showPopup.addEventListener("click", () => setPopupVisibility(true));
closePopup.addEventListener("click", () => setPopupVisibility(false));
