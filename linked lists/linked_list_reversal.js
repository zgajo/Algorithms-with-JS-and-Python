

(()=>{
    const reverseLL = function(node){

        let current = node;
        let prev, next;
    
        while(current){
            next = current.nextnode;  // 1. next = b  2. next = c
            current.nextnode = prev;    // 1. current.nextnode = null  2. c = a
            prev = current;    // 1. prev = a       2. prev = b;
            current = next;     // 1. current = b  2. current = c;
        }
    
    }
    
    class ReversedLLNode{
        constructor(val){
            this.val = val;
            this.nextnode = null;
            this.prevnode = null;
        }
    }
    
    const a = new ReversedLLNode(1);
    const b = new ReversedLLNode(2);
    const c = new ReversedLLNode(3);
    const d = new ReversedLLNode(4);
    
    a.nextnode = b;
    b.nextnode = c;
    c.nextnode = d;
    
    console.log(a.nextnode.val);
    console.log(b.nextnode.val);
    console.log(c.nextnode.val);
    console.log("-------------- Reversing linked list -------------");
    reverseLL(a)
    
    console.log(d.nextnode.val);
    console.log(c.nextnode.val);
    console.log(b.nextnode.val);
})()