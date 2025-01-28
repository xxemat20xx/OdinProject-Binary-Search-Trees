class Node {
    constructor(data) {
        this.left = null;
        this.right = null;
        this.data = data;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    // Function to build a balanced BST from a sorted array
    buildTree(arr) {
        // Base case: if the array is empty, return null
        if (arr.length === 0) return null;

        // Find the middle index
        const mid = Math.floor(arr.length / 2);

        // Create a new node with the middle element
        const root = new Node(arr[mid]);

        // Recursively build the left and right subtrees
        root.left = this.buildTree(arr.slice(0, mid));
        root.right = this.buildTree(arr.slice(mid + 1));

        return root;
    }
    insert(value, node = this.root){
        if(node === null){
            return new Node(value);
        }
        // duplicate not allowed
        if (value === node.data) {
            return node;
        }

        if (value < node.data) {
            node.left = this.insert(value, node.left);
        } else {
            node.right = this.insert(value, node.right);
        }
        return node;
    }
    delete(value, node = this.root){
        if(node === null){
            return null;
        }
        if(value < node.data){
            node.left = this.delete(value, node.left);
        }else if(value > node.data){
            node.right = this.delete(value, node.right);
        }else {
            if(node.left === null && node.right === null){
                return null;
            }
            if (node.left === null) {
                return node.right;
            }
            if (node.right === null) {
                return node.left;
            }
            const minValue = this.findMin(node.right);
            node.data = minValue; 
            node.right = this.delete(minValue, node.right); 
        }
        return node;
    }
    findMin(node) {
        while (node.left !== null) {
            node = node.left; // Keep traversing left to find the smallest value
        }
        return node.data;
    }
    find(value, node = this.root){
        if(node === null) return false;

        if (value === node.data) return true;

        if (value < node.data) {
            return this.find(value, node.left);
        } else if (value > node.data) {
            return this.find(value, node.right);
        }
    }
    levelOrder(callback){
        if(typeof callback !== 'function'){
           throw Error('Error: Not a call back function');
        }
        const queue = [];
        this._levelOrderHelper(this.root, 0, queue, callback);
        return queue;
    }
    _levelOrderHelper(node, level, queue, callback) {
        if (!node) return;
        
         // Ensure the queue has a sub-array for the current level
        if (queue.length <= level) {
            queue.push([]);// Add a new level array
        }
        // Add the current node to its respective level in the queue
        queue[level].push(node.data); 

        // Call the callback with node data and level
        callback(node, level, queue);
    
        // Recursively process the left and right children at the next level
        this._levelOrderHelper(node.left, level + 1, queue, callback);
        this._levelOrderHelper(node.right, level + 1, queue, callback);
    }
    inOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Error: Not a callback function');
        }
        this._inOrderHelper(this.root, callback);
    }

    _inOrderHelper(node, callback) {
        if (node === null) return;  // Base case: stop if node is null

        this._inOrderHelper(node.left, callback);  // Traverse left subtree
        callback(node);  // Visit current node
        this._inOrderHelper(node.right, callback);  // Traverse right subtree
    }

    // Pre-order traversal: node, left, right
    preOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Error: Not a callback function');
        }
        this._preOrderHelper(this.root, callback);
    }

    _preOrderHelper(node, callback) {
        if (node === null) return;  // Base case: stop if node is null

        callback(node);  // Visit current node
        this._preOrderHelper(node.left, callback);  // Traverse left subtree
        this._preOrderHelper(node.right, callback);  // Traverse right subtree
    }

    // Post-order traversal: left, right, node
    postOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Error: Not a callback function');
        }
        this._postOrderHelper(this.root, callback);
    }

    _postOrderHelper(node, callback) {
        if (node === null) return;  // Base case: stop if node is null

        this._postOrderHelper(node.left, callback);  // Traverse left subtree
        this._postOrderHelper(node.right, callback);  // Traverse right subtree
        callback(node);  // Visit current node
    }
    height(node = this.root) {
        if (node === null) return -1; // Base case: height of empty tree is -1.
    
        // Recursively calculate the height of the left and right subtrees.
        let leftHeight = this.height(node.left);
        let rightHeight = this.height(node.right);
    
        // Height is the maximum depth of the subtrees + 1 (for the current node).
        return Math.max(leftHeight, rightHeight) + 1;
    }
    depth(nodeValue, node = this.root, currentDepth = 0) {
        if (node === null) return null;
    
        if (node.data === nodeValue) {
            return currentDepth; // Found the node, return the depth
        }
        // Traverse left if the value is smaller
        if (nodeValue < node.data) {
            return this.depth(nodeValue, node.left, currentDepth + 1);
        }
        // Traverse right if the value is larger
        else if (nodeValue > node.data) {
            return this.depth(nodeValue, node.right, currentDepth + 1);
        }
    }
    isBalanced(node = this.root) {
        if (node === null) return true; // An empty tree is balanced
    
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
    
        // Check if the current node is balanced
        const isCurrentNodeBalanced = Math.abs(leftHeight - rightHeight) <= 1;
    
        // Recursively check if the left and right subtrees are balanced
        return (
            isCurrentNodeBalanced &&
            this.isBalanced(node.left) &&
            this.isBalanced(node.right)
        );
    }
    rebalance() {
        // Perform an in-order traversal to get the sorted array of node values
        const newArray = [];
        this.inOrder((node) => {
            newArray.push(node.data);
        });
    
        this.root = this.buildTree(newArray);
    }
    

    prettyPrint() {
        const prettyPrintHelper = (node, prefix = "", isLeft = true) => {
            if (node === null) {
                return;
            }
            if (node.right !== null) {
                prettyPrintHelper(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
            }
            console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
            if (node.left !== null) {
                prettyPrintHelper(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
            }
        };

        prettyPrintHelper(this.root); // Call the helper function with the root node
    }
}
const bst = new BST();
const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
bst.root = bst.buildTree(sortedArray);

console.log("Initial tree:");
bst.prettyPrint();

bst.insert(11);
console.log("\nTree after inserting 11:");
bst.prettyPrint();

bst.delete(4);
console.log("\nTree after deleting 4:");
bst.prettyPrint();

console.log("\nFind 5:", bst.find(5));
console.log("Find 12:", bst.find(12));

console.log("\nLevel Order Traversal:");
bst.levelOrder((node, level, queue) => {
    console.log(`Level ${level}: ${node.data}`);
});

console.log("\nIn Order Traversal:");
bst.inOrder((node) => {
    console.log(node.data);
});

console.log("\nPre Order Traversal:");
bst.preOrder((node) => {
    console.log(node.data);
});

console.log("\nPost Order Traversal:");
bst.postOrder((node) => {
    console.log(node.data);
});

console.log("\nHeight of the tree:", bst.height());
console.log("Depth of node with value 5:", bst.depth(5));

console.log("\nIs the tree balanced?", bst.isBalanced());

bst.insert(12);
bst.insert(13);
console.log("\nTree after inserting 12 and 13:");
bst.prettyPrint();

console.log("\nIs the tree balanced?", bst.isBalanced());

bst.rebalance();
console.log("\nTree after rebalancing:");
bst.prettyPrint();

console.log("\nIs the tree balanced?", bst.isBalanced());