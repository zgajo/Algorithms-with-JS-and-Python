( ()=>{

    function insSort(arr){

        for(let i = 1; i < arr.length; i++){

            let key = arr[i];
            let currIndex = i;

            while(currIndex > 0 && arr[currIndex - 1] > key ){

                arr[currIndex] = arr[currIndex - 1];
                currIndex -= 1;

            }

            arr[currIndex] = key;

        }

        console.log(arr);

    }

    let arr = [5,2,4,6,1,3];

    insSort(arr);

} )()