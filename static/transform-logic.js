import {GeometryCircle, GeometryLine, GeometrySpace, GeometryText} from "./geometry-logic.js";

const RADIUS = 100;


function get_margin(w) {
    return w / 10;
}

function _tree_to_space(tree) {
    if (tree == null) {
        return [new GeometrySpace(0, 0), null];
    }

    let [left, left_node] = _tree_to_space(tree.left);
    let [right, right_node] = _tree_to_space(tree.right);

    let top_margin = RADIUS * 2;
    if (left_node && right_node) {
        top_margin += get_margin(left.w - left_node.x + 2 * RADIUS + right_node.x);
    }
    let center_margin = RADIUS * 3;

    let space = new GeometrySpace(
        left.w + center_margin + right.w,
        top_margin + Math.max(left.h, right.h),
    );

    space.project(0, top_margin, left);
    space.project(left.w + center_margin, top_margin, right);

    let vertex = new GeometryCircle(left.w + RADIUS, RADIUS, RADIUS);

    space.insert(vertex);

    space.insert(new GeometryText(left.w + RADIUS, RADIUS, tree.value, RADIUS * 2 / Math.max(2, tree.value.toString().length)));
    space.insert(new GeometryText(left.w + 2.2 * RADIUS, RADIUS, tree.power, 50, "left"));

    if (left_node != null) {
        space.insert(new GeometryLine(left.w + RADIUS, RADIUS, left_node.x, left_node.y, RADIUS));
    }

    if (right_node != null) {
        space.insert(new GeometryLine(left.w + RADIUS, RADIUS, right_node.x, right_node.y, RADIUS));
    }

    return [space, vertex];
}

export function tree_to_space(tree) {
    let [space, root] = _tree_to_space(tree);

    let priorities = {"circle": 1, "line": 0, "text": 1};
    space.content.sort((a, b) => priorities[a.g_type] - priorities[b.g_type]);

    return [space, root];
}