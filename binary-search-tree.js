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

    this.#updateHeight(root);

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

    this.#updateHeight(node);
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

    this.#updateHeight(node);
    return node;
  }

  #getSuccessor(node) {
    let curr = node.getRight();
    while (curr.getLeft() !== null) curr = curr.getLeft();
    return curr;
  }

  find(value) {
    return this.#findRec(this.#root, value);
  }

  #findRec(node, value) {
    if (node === null) return null;
    const nodeValue = node.getValue();

    if (value === nodeValue) return node;
    if (value < nodeValue) return this.#findRec(node.getLeft(), value);
    if (value > nodeValue) return this.#findRec(node.getRight(), value);
  }

  levelOrderForEach(callback) {
    if (!callback) throw new Error("callback required");
    if (this.#root === null) return [];

    const queue = [this.#root];
    const result = [];

    while (queue.length > 0) {
      const currNode = queue.shift();
      result.push(callback(currNode));
      if (currNode.getLeft()) queue.push(currNode.getLeft());
      if (currNode.getRight()) queue.push(currNode.getRight());
    }

    return result;
  }

  preOrderForEach(callback) {
    const result = [];
    this.#preOrderForEachRec(this.#root, callback, result);
    return result;
  }

  #preOrderForEachRec(node, callback, result) {
    if (node === null) return;
    result.push(callback(node));
    this.#preOrderForEachRec(node.getLeft(), callback, result);
    this.#preOrderForEachRec(node.getRight(), callback, result);
  }

  inOrderForEach(callback) {
    const result = [];
    this.#inOrderForEachRec(this.#root, callback, result);
    return result;
  }

  #inOrderForEachRec(node, callback, result) {
    if (node === null) return;
    this.#inOrderForEachRec(node.getLeft(), callback, result);
    result.push(callback(node));
    this.#inOrderForEachRec(node.getRight(), callback, result);
  }

  postOrderForEach(callback) {
    const result = [];
    this.#postOrderForEachRec(this.#root, callback, result);
    return result;
  }

  #postOrderForEachRec(node, callback, result) {
    if (node === null) return;
    this.#postOrderForEachRec(node.getLeft(), callback, result);
    this.#postOrderForEachRec(node.getRight(), callback, result);
    result.push(callback(node));
  }

  height(value) {
    const node = this.find(value);
    if (!node) return null;
    return node.getHeight();
  }

  #updateHeight(node) {
    const leftHeight = node.getLeft() ? node.getLeft().getHeight() : -1;
    const rightHeight = node.getRight() ? node.getRight().getHeight() : -1;
    node.setHeight(Math.max(leftHeight, rightHeight) + 1);
  }

  depth(value) {
    let node = this.#root;
    let depth = 0;

    while (node !== null) {
      if (value === node.getValue()) return depth;
      if (value < node.getValue()) {
        node = node.getLeft();
      } else {
        node = node.getRight();
      }
      depth++;
    }
    return null;
  }

  isBalanced() {
    return this.#isBalancedRec(this.#root);
  }

  #isBalancedRec(node) {
    if (node === null) return true;

    let leftHeight = -1;
    let rightHeight = -1;

    if (node.getLeft() !== null) leftHeight = node.getLeft().getHeight();
    if (node.getRight() !== null) rightHeight = node.getRight().getHeight();

    const heightDiff = Math.abs(leftHeight - rightHeight);

    if (heightDiff > 1) {
      return false;
    }

    return (
      this.#isBalancedRec(node.getLeft()) &&
      this.#isBalancedRec(node.getRight())
    );
  }

  rebalance() {
    const sorted = this.inOrderForEach(function (node) {
      return node.getValue();
    });
    this.#root = this.buildTree(sorted);
  }

  getRoot() {
    return this.#root;
  }
}

class Node {
  #value = null;
  #left = null;
  #right = null;
  #height = 0;

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

console.log("searching: 5");
console.log(myTree.find(5));

console.log("deleting: 5");
myTree.delete(5);

console.log("searching: 5");
console.log(myTree.find(5));

prettyPrint(rootNode);

console.log("levelOrderForEach test:");
console.log(myTree.levelOrderForEach((node) => node.getValue()));

console.log("preOrderForEach test:");
console.log(myTree.preOrderForEach((node) => node.getValue()));

console.log("inOrderForEach test:");
console.log(myTree.inOrderForEach((node) => node.getValue()));

console.log("postOrderForEach test:");
console.log(myTree.postOrderForEach((node) => node.getValue()));

console.log("Height of 9: " + myTree.height(9));
console.log("Height of 7: " + myTree.height(7));

console.log("Depth of 9: " + myTree.depth(9));
console.log("Depth of 7: " + myTree.depth(7));

console.log("Is balanced:", myTree.isBalanced());

console.log("Inserting: 50, 60, 70")
myTree.insert(50);
myTree.insert(60);
myTree.insert(70);

prettyPrint(myTree.getRoot());

console.log("Is balanced after insertions:", myTree.isBalanced());


console.log("Rebalancing")
myTree.rebalance();

console.log("Is balanced after rebalance:", myTree.isBalanced());
prettyPrint(myTree.getRoot());
