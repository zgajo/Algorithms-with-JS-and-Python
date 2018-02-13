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


        //Breadth first search
        bfs(s){

            let queue = [];
            queue.push(s);

            this.visited[s] = true;

            while(queue.length > 0){

                let v = queue.shift();

                if(v != undefined) console.log("Visited vertex: ", v);

                this.vertex[v].forEach(w => {

                    if(!this.visited[w]){

                        console.log("edgeTo["+w+"] = " + v)
                        this.edgeTo[w] = v;
                        this.visited[w] = true;
                        queue.push(w)

                    }

                })

                console.log("queue: ", queue)

            }


        }



        // Shortest path, using bfs to set up path to nodes before reading shortest path
        pathTo(v){

            let source = 0;
            if(!this.hasPathTo(v)) return undefined;

            let path = [];

            for(let i = v; i != source; i = this.edgeTo[i]){
                path.push(i)
            }

            path.push(source)

            return path;

        }

        hasPathTo(v){
            return this.visited[v];
        }

    }

    let g = new graph(5);
    g.addEdge(0, 1);
    g.addEdge(0,2);
    g.addEdge(1,3);
    g.addEdge(2,4);
    g.showGraph();

    g.bfs(0);

    let vertex = 4,
        paths = g.pathTo(vertex);

    console.log(paths)
    let str = "";
    while(paths.length > 0){

        if(paths.length > 0) str += paths.pop() + " - " ;

        else paths.pop();
        
    }
    console.log(str)

    console.log(g.edgeTo)

} )()