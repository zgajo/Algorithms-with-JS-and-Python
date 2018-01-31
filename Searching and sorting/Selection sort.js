( ()=>{

    // O(n^2)
    let selection_sort = function(arr){

        let arrLength = arr.length - 1 ;

        for(let i = 0; i < arrLength; --arrLength){
            
            let positionOfMax = 0;

            for(let j = 1; j < arrLength + 1 ; j++){
                
                if( arr[positionOfMax] < arr[j] ){
                    positionOfMax = j;
                }
            }


            /**
             * Change positions of current max and max found in array 
             */
            let temp = arr[arrLength];

            arr[arrLength] = arr[positionOfMax];

            arr[positionOfMax] = temp;

        }

        console.log(arr)

    }

    selection_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])

} )()