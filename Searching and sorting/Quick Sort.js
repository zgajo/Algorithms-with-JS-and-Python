( () =>{

    // my solution  
    let quick_sort = function(arr, first, last){

        if(first < last){

            console.log( "new entry: ", first, last, arr)

            let split_pivot = part(arr, first, last);

            quick_sort(arr, first, split_pivot - 1 );
            quick_sort(arr, split_pivot + 1 , last );

        }
    }

    let part = function(arr, first, last){

        console.log("-----  pivot: " , last , " -------")

        let pivot = last;

        let i = first - 1;

        for(let j = first; j < last; j++){

            console.log(arr[j] , arr[pivot])

            if(arr[pivot] > arr[j]){
                
                i += 1;

                if(i != j){ // Don't change indexes numbers

                    console.log("swap: ", arr[i] , arr[j])

                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;

                }

            }
        }

        let temp = arr[i + 1];
        console.log("Changing: ",  arr[i + 1], arr[last])
        arr[i + 1] = arr[last];
        arr[last] = temp;

        console.log("-----  return: " , i+1 , " -------")
        
        return i + 1;

    }


    let qa = [10, 80, 30, 90, 40, 50, 70];
    quick_sort(qa, 0 , qa.length - 1);
    console.log("My solution: ", qa)



/**
 * *************************************************************************************
 */


    // course solution
   // O(n^2) 
    let q_sort = function(arr){

        q_sort_helper(arr, 0, arr.length - 1 )

        console.log("Course solution: ", arr)

    }

    let q_sort_helper = function(arr, first, last){

        if(first < last){

            let splitpoint = partition(arr, first, last);

            q_sort_helper(arr, first, splitpoint - 1)
            q_sort_helper(arr, splitpoint +1, last)

        }

    }

    let partition = function(arr, first, last){

        let pivotvalue = arr[first];

        let leftmark = first +1;
        let rightmark = last;

        let done = false;

        while(!done){
            while(leftmark <= rightmark && arr[leftmark] <= pivotvalue ){
                leftmark += 1;
            }
            while(leftmark <= rightmark && arr[rightmark] >= pivotvalue ){
                rightmark -= 1;
            }

            if(rightmark < leftmark){
                done = true;
            }
            else{
                let temp = arr[leftmark];
                arr[leftmark] = arr[rightmark];
                arr[rightmark] = temp;
            }

        }

        let temp = arr[first];
        arr[first] = arr[rightmark];
        arr[rightmark] = temp;

        return  rightmark;
    }

    q_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])


} )()