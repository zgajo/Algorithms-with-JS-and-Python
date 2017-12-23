class MaxBinaryHeap{
    constructor(){
        this.heap = [null];
    }

    insert(node){
        this.heap.push(node)
        this.percUp(this.heap.length - 1 )
    }

    deleteRoot(){
        this.heap[1] = this.heap[this.heap.length - 1]
        this.heap.pop();
        this.percDown(1)
    }

    biggerChild(i){
        //if right child is bigger then return index of right child
        if(this.heap[ i * 2 + 1 ] > this.heap[ i * 2 ]){
            return i*2 + 1
        }        
        //if right is not bigger, return index of left child
        else return i * 2
    }

    percDown(i){
        //get bigger of tho children... 
        let j = this.biggerChild(i)

        if(this.heap[i] < this.heap[ j ]){
            let temp = this.heap[i];
            this.heap[i] = this.heap[j];
            this.heap[j] = temp;
            this.percDown(j)
        }

    }

    percUp(i){
        //if parent is larger then last added node

        if(i > 2){

            let parent = parseInt(i / 2);

            if(this.heap[ parseInt( parent) ] < this.heap[ i ] ){
                let temp = this.heap[parent];
                this.heap[parent] = this.heap[i];
                this.heap[i] = temp;
                this.percUp(parent)
            }

        }
        else if(i == 2){
            if(this.heap[ 1 ] < this.heap[ i ] ){
                let temp = this.heap[1];
                this.heap[1] = this.heap[i];
                this.heap[i] = temp;
            }
        }
    }


}

let heap = new MaxBinaryHeap();

heap.insert(12)
heap.insert(7)
heap.insert(10)
heap.insert(8)
heap.insert(20)
heap.insert(6)

console.log(heap)

heap.deleteRoot()

console.log("deleted root: ", heap)