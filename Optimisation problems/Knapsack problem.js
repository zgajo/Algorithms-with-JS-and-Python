( ()=>{

    let knapsack = function(capacity, size, value, n){

        if(n == 0|| capacity == 0){
            return 0;
        }

        if(size[n-1] > capacity){
            return knapsack(capacity, size, value, n-1);
        }

        else{
            return Math.max(value[n-1] + knapsack(capacity - size[n-1], size, value, n-1 ), knapsack(capacity, size, value, n-1 ) )   
        }
 
    }

    let value = [4,5,10,11,13],
        size = [3,4,7,8,9], // 7 + 9 give us capacity of 16, their values are 10 + 13
        capacity = 16,
        n = 5;
    
    console.log(knapsack(capacity, size, value, n))

} )();

// Dynamic solution
( ()=>{

    let dyn_knapsack = function(capacity, size, value, n){

        let K = [];

        for(let i = 0; i <= capacity+1; i++){
            K[i] = [];
        }

        for(let i = 0; i <= n; i++){

            let str = "";

            for(let curr_weight = 0; curr_weight <= capacity; curr_weight++){

                if(i == 0 || curr_weight==0){
                    console.log("if: ", i,curr_weight)
                    str += " " + 0;
                    K[i][curr_weight] = 0;
                }
                // if current size can be set in current weight
                else if(size[i-1] <= curr_weight){
                    console.log("else if: ", i,curr_weight)
                    console.log("i, curr_weight: ", i, curr_weight, " - size[i-1] <= curr_weight :  ", size[i-1] + "<=" + curr_weight)
                                                // value of current size - value of previus row and column (weight size which is left when substracting  curent weight and current weight size)
                    K[i][curr_weight] = Math.max(value[i - 1] + K[i-1][curr_weight-size[i-1]], K[i-1][curr_weight]);
                    str += " " +K[i][curr_weight];

                }
                // else value of last row
                else{
                    console.log("else: ", i,curr_weight)
                    K[i][curr_weight] = K[i-1][curr_weight];
                    str += " " +K[i][curr_weight];

                }

                

            }
            console.log(str + " ");

        }

        return K[n][capacity];

    }

    let value = [4,5,10,11,13],
        size = [3,4,7,8,9], // 7 + 9 give us capacity of 16, their values are 10 + 13
        capacity = 16,
        n = 5;
    
    console.log(dyn_knapsack(capacity, size, value, n))

} )();