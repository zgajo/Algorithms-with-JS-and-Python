class Tree{

    constructor(key){
        this.key = key;
        this.left = null;
        this.right = null;
    }

    get getRight(){
        return this.right
    }

    get getRoot(){
        return this.key
    }

    get getLeft(){
        return this.left
    }

    changeRoot(key){
        this.key = key;
    }

    insertLeft(key){
        if(this.left){
            let temp = new Tree(key)
            temp.left = this.left;
            this.left = temp
        }
        else{
            this.left = new Tree(key)
        }
    }

    insertRight(key){
        if(this.right){
            let temp = new Tree(key)
            temp.right = this.right 
            this.right = temp 
        }
        else{
            this.right = new Tree(key)
        }
    } 

    preorder(){
        if(this){
            console.log(this.key)

            if(this.left) this.left.preorder()
            if(this.right) this.right.preorder()
        }
    }

    postorder(){
        if(this){

            if(this.left) this.left.postorder()
            if(this.right) this.right.postorder()
                        
            console.log(this.key)
        }
    }

    inorder(){
        if(this){

            if(this.left) this.left.inorder()
            console.log(this.key)
            if(this.right) this.right.inorder()                        
            
        }
    }

}


let t = new Tree('a')
console.log(t.getRoot)
console.log(t.getLeft)
console.log(t.getRight)

console.log("\n ---------------- \n")

t.insertLeft('b')

console.log(t.getRoot)
console.log(t.getLeft)
console.log(t.getRight)

console.log("\n ---------------- \n")


t.insertRight('c')

console.log(t.getRoot)
console.log(t.getLeft)
console.log(t.getRight)

console.log("\n ---------------- \n")


t.insertLeft('d')

console.log(t.getRoot)
console.log(t.getLeft)
console.log(t.getRight)

console.log("\n ---------------- \n")

console.log("Preorder: ")
t.preorder()

console.log("\n ---------------- \n")

console.log("Postorder: ")
t.postorder()

console.log("\n ---------------- \n")

console.log("Inorder: ")
t.inorder()