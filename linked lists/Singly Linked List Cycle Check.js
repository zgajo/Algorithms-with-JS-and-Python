class NodeSLL{
    constructor(val){
        this.val = val;
        this.nextNode = null;
    }
}

const cycleCheck = function(Node){
    var first = Node;
    var current = Node.nextNode;
    while(current){
        if(current == first) {
            return true;
        } 
        current = current.nextNode;
    }
    return false
}

const a = new NodeSLL(1);
const b = new NodeSLL(2);
const c = new NodeSLL(3);
const d = new NodeSLL(4);
a.nextNode = b;
b.nextNode = c;
c.nextNode = d;
d.nextNode = a;
console.log(cycleCheck(a))