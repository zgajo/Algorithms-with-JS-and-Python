// O(n)

(()=>{

    let seq_search = function(arr, el){

        let pos = 0, found = false;

        while(pos < arr.length && !found){

            if(arr[pos] == el) found = true;
            else pos += 1;

        }

        return found;

    }

    let ordered_seq_search = function(sorted_arr, el){

        let pos = 0, 
            found = false;

        while(pos < sorted_arr.length && !found){

            if(el < sorted_arr[pos]){
                break;
            }

            if(sorted_arr[pos] == el) found = true;
            else pos += 1;

        }

        return found;

    }

    const arr =  [3,4,5, 1,2];
    const sorted_arr =  [1,2,3,4,5,8,9];

    console.log(seq_search(arr, 5))
    console.log(ordered_seq_search(sorted_arr, 7))

})()