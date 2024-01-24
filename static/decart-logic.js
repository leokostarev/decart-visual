export class Node {
    constructor(value, power, left = null, right = null) {
        this.value = value;
        this.power = power;
        this.left = left;
        this.right = right;
    }
}

export function split_by(node, k) {
    if (node == null) {
        return [null, null];
    }

    if (node.value <= k) {
        let [left, right] = split_by(node.right, k);
        node.right = left;
        return [node, right];
    } else {
        let [left, right] = split_by(node.left, k);
        node.left = right;
        return [left, node];
    }
}

export function merge(left, right) {
    if (left == null) {
        return right;
    }
    if (right == null) {
        return left;
    }

    if (left.power > right.power) {
        left.right = merge(left.right, right);
        return left;
    } else {
        right.left = merge(left, right.left);
        return right;
    }
}

export function insert(root, val, power = Math.floor(Math.random() * 1000)) {
    let [left, right] = split_by(root, val);
    return merge(merge(left, new Node(val, power)), right);
}


export function random_tree_with_n_nodes(n) {
    let root = null;
    for (let i = 0; i < n; i++) {
        root = insert(root, Math.floor(Math.random() * 1000));
    }
    return root;
}

export function tree_by_keys_and_values(ls) {
    let root = null;
    for (let i = 0; i < ls.length; i++) {
        root = insert(root, ...ls[i]);
    }
    return root;
}