( ()=>{

    let shell_sort = function(arr){

        let sublist_count = Math.floor(arr.length / 2);

        while(sublist_count > 0){

            // This is for every every
            for(let start = 0;  start < sublist_count; start++){

                gap_insertion_sort(arr, start, sublist_count);

            }

            console.log("After increments of: ", sublist_count)
            console.log("The list is: ", arr)

            sublist_count = Math.floor(sublist_count / 2);

        }

        console.log(arr)

    }


    let gap_insertion_sort = function(arr, start, gap){

        console.log(arr, start, gap)

        for(let i = start + gap; i < arr.length; i += gap){

            let currentVal = arr[i];
            let position = i;

            //console.log("position >= gap: ", position, gap);
            //console.log("arr[position - gap] > currentVal", arr[position - gap], currentVal)

            while(position >= gap && arr[position - gap] > currentVal){

                console.log(arr[position], arr[position - gap])
                
                arr[position] = arr[position - gap];
                position = position - gap;

                console.log(arr)

            }

            console.log("Current value: ", currentVal, "position: ", position)

            arr[position] = currentVal;

        }

    }

    shell_sort([45, 67, 23, 45, 21, 24, 7, 2 , 6 ,4 , 90])

} )();