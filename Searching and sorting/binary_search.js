// Uses divide & conquer
// O(logn)

(()=>{

    let binary_search = function( arr, el ){
        
        let first = 0, 
            last = arr.length - 1,
            found = false;

        while(first <= last && !found){

            let mid = parseInt((first + last) / 2);

            if( arr[mid] == el ){
                found = true; 
            }
            else{
                if(el < arr[mid]){  // in lower half of array
                    last = mid - 1;
                }
                else{               // in upper half of array
                    first = mid + 1;
                }
            }

        }

        return found;

    }


    let recursive_binary_search = (arr, el)=>{

        if(arr.length == 0) return false;

        else{
            let mid = parseInt(arr.length / 2);

            if(arr[mid] == el) return true;
            else {
                if(el < arr[mid]){  // in lower half of array
                    return recursive_binary_search( arr.splice(0, mid), el );
                }
                else{               // in upper half of array
                    return recursive_binary_search( arr.splice(mid + 1, arr.length), el);
                }
            }
        }

    }

    const arr = [1,2,3,4,5,6,7,8,9];

    console.log(binary_search(arr, 10))

    console.log(recursive_binary_search(arr, 1))

})()

