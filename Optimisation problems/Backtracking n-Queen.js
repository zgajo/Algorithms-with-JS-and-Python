class Board{
    constructor(n){
        this.board = [];
        this.N = n;

        for(let i = 0; i < n; i++){
            this.board[i] = [];
            for(let j = 0; j < n; j++){
                this.board[i][j] = null;
            }
        }

    }

    isSafe(row, column){

        let diagonalRight = row + column,
            diagonalLeft = row - column;


        //check if this row and col is not under attack from any previous queen.
        for (let r = 0; r < row; r++) {
            if (this.board[r][column]) 
            {
                return false;
            }
        }

        let i = row - 1;

        // check all previus rows and it's columns
        while(i >= 0){
             
            for(let col = 0; col < this.N; col++){
                if(this.board[i][col] && (i+col == diagonalRight || i-col == diagonalLeft)){
                    return false;
                }
            }
            --i;
        }


        return true;

    }

    solveNQUtil(row){

        //  base case: If all queens are placed
        //  then return true
        if(row == this.N) return true;


        // # Consider this row and try placing
        // # this queen in all columns one by one
        for(let column = 0; column < this.N; column++){

            if(this.isSafe(row, column)){
                this.board[row][column] = "Q";

                /* recur to place rest of the queens */
                if ( this.solveNQUtil(row + 1) ) return true;
    
                /* If placing queen in board[i][column]
                doesn't lead to a solution, then
                remove queen from board[i][column] */
                this.board[row][column] = null; // BACKTRACK
            }

            

        }

        return false;

    }

    solveQ(){
        if(this.solveNQUtil(0) == false){
            console.log("Solution doesn't exists")
        }
        else{
            console.log(this.board)
        }
    }


}


let b = new Board(4);

b.solveQ()