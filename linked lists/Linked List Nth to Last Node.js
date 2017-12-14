class NodeNth{
    constructor(val){
        this.val = val;
        this.nextNode = null;
    }
}

const findNth = function(n, Node){
    var right = Node;
    var left = Node;

    for(let i = 0; i < n-1; i++){
        if(!right.nextNode) return "Error: n is larger than linked list";
        right = right.nextNode;
    }

    while(right.nextNode){
        left = left.nextNode;
        right = right.nextNode;
    }
    return left.val
}

const a = new NodeNth(1);
const b = new NodeNth(2);
const c = new NodeNth(3);
const d = new NodeNth(4);

a.nextNode = b;
b.nextNode = c;
c.nextNode = d;

console.log(findNth(3, a))