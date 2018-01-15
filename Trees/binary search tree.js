
(()=>{
    function Node(val) {
        return {
            key: val,
            left: null,
            right: null
        }
    }
    
    class BinarySearchTree {
        constructor(val) {
            this.root = Node(val);
        }
    
        getRoot() {
            return this.root;
        }
    
        setRoot(val) {
            this.root = Node(val)
        }
    
        insertNode(val, node) {
    
            if (node && node.key == val) return;
    
            if (node && node.key > val) {
                if (node.left) this.insertNode(val, node.left);
                else {
                    node.left = Node(val);
                };
            } else {
                if (node.right) this.insertNode(val, node.right);
                else {
                    node.right = Node(val);
                }
            }
    
        }
    
        findNode(val, node){
            if (node && node.key == val) return node;
    
            if (node && node.key > val) {
                return this.findNode(val, node.left);
            } else {
                return this.findNode(val, node.right);
            }
        }
    
        checkIfChildren(node){
            return (node.left || node.right) ? true : false;
        }
    
        findChildForSwap(node){// retreive node meant to be deleted
    
            //if no left child, set node meant for deleting to his right child
            if (!node.left ) {
                [node.key, node.left, node.right] = [node.right.key, node.right.left, node.right.right];
                return;
            }
            //if left child doesn't have it's own right child 
            else if (node.left && !node.left.right) {
    
                [node.key, node.left] = [node.left.key, node.left.left];
                return;
    
            } else {
    
                let temp = node.left;
                
                //do while last right child is not reached
                if(temp.right && temp.right.right){
                    while (temp.right.right) {
                        temp = temp.right;
                    }
                }            
                
                //set node value which is meant to be deleted to value of last right child. 
                node.key = temp.right.key;
                //set reference of last right child to last right child's left child
                temp.right = temp.right.left;
                
                
                return;
            }
        }
    
    
    
        deleteNode(val, node) {
    
            if (node.key == val) {
    
                if (!this.checkIfChildren(node)) {
                    node.key = null;
                    return
                }
                
                this.findChildForSwap( node)
            }
            else{
                if(val < node.key) this.deleteNode(val, node.left)
                else  this.deleteNode(val, node.right)
            }
            
        }
    
    
    
    }
    
    let bst = new BinarySearchTree(70);
    
    bst.insertNode(100, bst.root)
    bst.insertNode(50, bst.root)
    bst.insertNode(10, bst.root)
    bst.insertNode(60, bst.root)
    bst.insertNode(55, bst.root)
    bst.insertNode(65, bst.root)
    console.log("Before deleting: ", bst)
    bst.deleteNode(60, bst.root)
    console.log("After deleting: ", bst)
    
})()