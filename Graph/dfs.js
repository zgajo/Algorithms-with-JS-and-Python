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

            this.vertex[v].push(w);
            this.vertex[w].push(v);
            ++this.edges;

        }


        showGraph(){

            for(let i = 0; i < this.vertices; i++){
                let str = i + " -> ";

                for(let j = 0; j < this.vertices; j++){
                    if(typeof this.vertex[i][j] != "undefined"){
                        str+= this.vertex[i][j] + " ";
                    }
            
                }

                console.log(str);
            }

        }

        // Depth First search
        dfs(v){

            this.visited[v] = true;

            if(this.vertex[v] != undefined){
                console.log("Visited vertex: " + v)
            }

            this.vertex[v].forEach(w => {
                if(!this.visited[w]){
                    this.dfs(w);
                }
            })

        }

    }

    let g = new graph(5);
    g.addEdge(0, 1);
    g.addEdge(0,2);
    g.addEdge(1,3);
    g.addEdge(2,4);
    g.showGraph();

    g.dfs(0);
} )()