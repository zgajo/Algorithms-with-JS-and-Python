( ()=>{

    // O(n^2)
    // best ccase is Ω(n), when we add checking, 
    //which will check if swap has been made inside inner loop,
    // if no swap has been made, then the array is already sorted
    let bubble_sort = function(arr){

        for(let i = arr.length - 1; i > 0; --i){

            for(let j = 0; j < i; j++){
                           
                if( arr[j] > arr[j+1] ){

                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j + 1] = temp;

                }
            }

        }

        console.log(arr)

    }

    bubble_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])

} )()