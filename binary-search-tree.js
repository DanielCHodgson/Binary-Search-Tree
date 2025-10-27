class Tree {
  #root = null;
  #array = null;

  constructor(array) {
    this.#array = [...new Set(array)].sort((a, b) => a - b);
    this.#root = this.buildTree(this.#array);
  }

  buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const root = new Node(array[mid]);

    root.setLeft(this.buildTree(array, start, mid - 1));
    root.setRight(this.buildTree(array, mid + 1, end));

    return root;
  }

  insert(value) {
    this.#root = this.#insertRec(this.#root, value);
  }

  #insertRec(node, value) {
    if (node === null) {
      return new Node(value);
    }

    if (value < node.getValue()) {
      node.setLeft(this.#insertRec(node.getLeft(), value));
    } else if (value > node.getValue()) {
      node.setRight(this.#insertRec(node.getRight(), value));
    }

    return node;
  }

  delete(value) {
    this.#root = this.#deleteRec(this.#root, value);
  }

  #deleteRec(node, value) {
    if (node === null) return null;

    if (value < node.getValue()) {
      node.setLeft(this.#deleteRec(node.getLeft(), value));
    } else if (value > node.getValue()) {
      node.setRight(this.#deleteRec(node.getRight(), value));
    } else {
      if (node.getLeft() === null) return node.getRight();
      if (node.getRight() === null) return node.getLeft();

      const succ = this.#getSuccessor(node);
      node.setValue(succ.getValue());
      node.setRight(this.#deleteRec(node.getRight(), succ.getValue()));
    }

    return node;
  }

  #getSuccessor(node) {
    let curr = node.getRight();
    while (curr.getLeft() !== null) curr = curr.getLeft();
    return curr;
  }

  getRoot() {
    return this.#root;
  }
}

class Node {
  #value = null;
  #left = null;
  #right = null;
  #height = 1;

  constructor(value) {
    this.#value = value;
  }

  getValue() {
    return this.#value;
  }

  getHeight() {
    return this.#height;
  }

  getLeft() {
    return this.#left;
  }

  getRight() {
    return this.#right;
  }

  setValue(value) {
    this.#value = value;
  }

  setHeight(height) {
    this.#height = height;
  }

  setLeft(node) {
    this.#left = node;
  }

  setRight(node) {
    this.#right = node;
  }
}

function prettyPrint(node, prefix = "", isLeft = true) {
  if (node === null) {
    return;
  }
  if (node.getRight()) {
    prettyPrint(node.getRight(), `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.getValue()}`);
  if (node.getLeft()) {
    prettyPrint(node.getLeft(), `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
}

const myTree = new Tree([7, 3, 9, 1, 5, 3, 7, 2, 8]);
const rootNode = myTree.getRoot();
prettyPrint(rootNode);

console.log("inserting: 20, 30, 40");

myTree.insert(20);
myTree.insert(30);
myTree.insert(10);
prettyPrint(rootNode);

console.log("deleting: 20, 30, 40");

myTree.delete(20);
myTree.delete(30);
myTree.delete(10);
prettyPrint(rootNode);

console.log("deleting: 5");

myTree.delete(5);
prettyPrint(rootNode);
