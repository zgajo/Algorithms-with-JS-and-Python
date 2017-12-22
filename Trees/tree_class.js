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
