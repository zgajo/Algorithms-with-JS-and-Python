function Tree(val){
    return [val, null, null]
}

function insertLeftChild(root, val){
    if(root[1]){
        root[1] = [val, root[1], null]
    }
    else{
        root[1] = [val, null, null]
    }
}

function insertRightChild(root, val){
    if(root[2]){
        root[2] = [val, null, root[2]] 
    }
    else{
        root[2] = [val, null, null]
    }
}

function getRightChild(root){
    return root[2]
}

function getLeftChild(root){
    return root[1]
}

function setNewRoot(root, newVal){
    root[0] = newVal
} 

function getRootVal(root){
    return root[0]
}



let tree = Tree(1)

insertLeftChild(tree, 2)
insertLeftChild(tree, 4)
insertRightChild(tree, 3)

console.log("Whole tree:", tree)
console.log("left child: ",getLeftChild(tree))
console.log("left child of left child: ", getLeftChild(getLeftChild(tree)))
console.log("right child: ", getRightChild(tree))

console.log("root value: ", getRootVal(tree))