import {GeometryCircle, GeometryLine, GeometrySpace, GeometryText} from "./geometry-logic.js";

const RADIUS = 100;

function get_margin(w) {
    return 10 + w / 10;
}

function _tree_to_space(tree) {
    if (tree == null) {
        return [new GeometrySpace(0, 0), null];
    }

    let [left, left_p] = _tree_to_space(tree.left);
    let [right, right_p] = _tree_to_space(tree.right);

    let top_margin = RADIUS * 2 + get_margin(left.w + right.w);
    let center_margin = RADIUS * 2;

    let space = new GeometrySpace(
        left.w + center_margin + right.w,
        top_margin + Math.max(left.h, right.h),
    );

    space.project(0, top_margin, left);
    space.project(left.w + center_margin, top_margin, right);

    space.insert(new GeometryCircle(left.w + RADIUS, RADIUS, RADIUS));

    space.insert(new GeometryText(left.w + RADIUS, RADIUS, tree.value, RADIUS * 2 / Math.max(2, tree.value.toString().length)));
    space.insert(new GeometryText(left.w + 2.2 * RADIUS, RADIUS, tree.power, 50, "left"));

    if (left_p != null) {
        let line = new GeometryLine(left.w + RADIUS, RADIUS, left_p[0], left_p[1] + top_margin);
        line.shorten_by(RADIUS);
        space.insert(line);
    }

    if (right_p != null) {
        let line = new GeometryLine(left.w + RADIUS, RADIUS,
            right_p[0] + left.w + center_margin, right_p[1] + top_margin);
        line.shorten_by(RADIUS);
        space.insert(line);
    }

    return [space, [left.w + RADIUS, RADIUS]];
}

export function tree_to_space(tree) {
    let [space, [tx, ty]] = _tree_to_space(tree);

    let priorities = {"circle": 1, "line": 0, "text": 1};
    space.content.sort((a, b) => priorities[a.g_type] - priorities[b.g_type]);

    return [space, tx];
}