( ()=>{

    // O(n^2)
    let exchange_sort = function(arr){

        for(let i = arr.length - 1 ; i > 0; --i){

            for(let j = 0; j < i; j++){
                
                if( arr[i] < arr[j] ){

                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;

                }
            }

        }

        console.log(arr)

    }

    exchange_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])

} )()