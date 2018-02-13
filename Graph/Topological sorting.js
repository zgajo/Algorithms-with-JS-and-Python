( ()=>{

    class graph{

        constructor(vnums){

            this.vertices = vnums; // broj vrhova
            this.edges = 0;     // povezani vrhovi (putevi)
            this.vertex = [];    // vrhovi 

            this.visited = []; // to track dfs search

            this.edgeTo = [];

            this.initializeGraph();            

        }

        // Postavlja dvodimenzionalnu matricu i postavlja u nju povezane vrhove 
        initializeGraph(){

            for(let i = 0; i < this.vertices; i++){

                this.vertex[i] = [];
                this.visited[i] = false;

            }

        }

        addEdge(v, w){

            // directed graph
            this.vertex[v].push(w);
            ++this.edges;

        }


        showGraph(){

            for(let i = 0; i < this.vertices; i++){
                let str = this.vertexList[i] + " -> ";

                for(let j = 0; j < this.vertices; j++){
                    if(this.vertex[i][j] != undefined){
                        str+= this.vertexList[this.vertex[i][j]] + " ";
                    }
            
                }

                console.log(str);
            }

        }

        topSort(){
            let stack = [],
                visited = [];

            for(let i = 0; i < this.vertices; i++){
                visited[i] = false;
            }

            for(let i = 0; i < this.vertices; i++){
                if(!visited[i]){
                    this.topSortHelper(i, visited, stack);
                }
            }

            let str ="";

            for(let i = 0; i < stack.length; i++){
                if(stack[i] != undefined  && stack[i] > -1 ){
                    str += this.vertexList[stack[i]] + " ";
                }
            }


            console.log(str)
        }

        topSortHelper(v, visited, stack){

            visited[v] = true;

            this.vertex[v].forEach(w => {
                if(!visited[w]){
                    this.topSortHelper(w, visited, stack);
                }
            });


            stack.push(v);

        }

    }

    let g = new graph(7);
    g.addEdge(0,2);
    g.addEdge(1,2);
    g.addEdge(1,4);
    g.addEdge(2,3);
    g.addEdge(3,5);
    g.addEdge(4,5);
    g.addEdge(5,6);


    g.vertexList = ["A", "B", "C", "D", "E", "F", "G"]
    g.showGraph();
    g.topSort();

    let g2 = new graph(8);
    g2.addEdge(0,1);
    g2.addEdge(0,3);
    g2.addEdge(1,6);
    g2.addEdge(3,5);
    g2.addEdge(5,7);
    g2.addEdge(6,7);
    g2.addEdge(2,4);
    g2.addEdge(4,6);
    g2.addEdge(4,7);


    g2.vertexList = [0, 1, 2, 3, 4, 5, 6, 7]
    g2.showGraph();
    g2.topSort();

    
} )()