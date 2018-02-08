
( ()=>{


    let binary_search_rec = function(arr, num){

        if(arr.length < 1) {
            return false
        }
    
        let middle = Math.floor(arr.length / 2);
    
    
        if(arr[middle] == num) return true;
    
        if(num > arr[middle]){
            return binary_search_rec(arr.splice(middle), num);
        }
        else{
            return binary_search_rec(arr.splice(0,middle), num);
        }
    
    
    }
    
    let binary_search = function(arr, num){
    
        if(arr.length < 1) {
            return false
        }
    
        let first = 0,
            last = arr.length;
        let found = false;
    
        while(first <= last && !found){
    
            let middle = Math.floor((first + last) / 2);
    
            if(arr[middle] == num) found = true;
            else{
                    
                if(num > arr[middle]){
                    first = middle + 1;
                }
                else{
                    last = middle - 1;
                }
            }
    
        }
    
        return found;
        
    }
    
    let a = [1,2,3,4,5,6,7,8,9,10]
    
    console.log(binary_search(a, 11));
    

} )();


( ()=>{

    let bubble_sort = function(arr){

        for(let last = arr.length - 1; last > 0; last --){
            
            let i = 0;

            while( i != last){
                if(arr[i] > arr[i+1]){
                    const temp = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = temp;
                }
                ++i;
            }

        }

        console.log("Bubble sort: ",arr)

    }

    bubble_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])

} )();


( ()=>{

    let selection_sort = function(arr){

        for(let last = arr.length - 1; last > 0; last --){
            
            let max = 0;

            for(let i = 0; i < last; i++){

                if(arr[i] > arr[max]){
                    max = i;
                }

            }

            if(arr[max] > arr[last]){

                const temp = arr[max];
                arr[max] = arr[last];
                arr[last] = temp;

            }
            

        }

        console.log("Selection sort: ", arr)


    }

    selection_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])

} )();

( ()=>{

    let insertion_sort = function(arr){

        for(let i = 1; i < arr.length; i++){
            
            if(arr[i] < arr[i - 1]){

                let j = i;

                do{

                    const temp = arr[j];
                    arr[j] = arr[j-1];
                    arr[j-1] = temp;

                    --j;

                }while(arr[j] < arr[j - 1])

            }

        }

        console.log("Insertion sort: ",arr);

    }

    insertion_sort([4,2,1, 3, 10, 5, 8, 6, 7, 9])

} )();

( ()=>{

    let merge_sort = function(arr){

        let gap = Math.floor(arr.length / 2);

        while(gap > 0){

            for(let i = 0; i < gap; i++){

                shell_ins_sort(arr, i + gap, gap)

            }

            gap = Math.floor(gap / 2);

        }

        console.log("Shell sort: ", arr)

    };


    let shell_ins_sort = (arr, start, gap)=>{

        for(start; start < arr.length; start += gap){

            let position = start;

            while( position >= gap && arr[position - gap] > arr[position]){

                let temp = arr[position];

                arr[position] = arr[position - gap];
                arr[position - gap] = temp;

                position = position - gap;

            }
        }


    }

    merge_sort([45, 67, 23, 45, 21, 24, 7, 2 , 6 ,4 , 90])

} )();

( ()=>{

    let merge_sort = function(arr){

        if(arr.length > 1){

            let middle = Math.floor(arr.length / 2);
            let left = arr.slice(0, middle);
            let right = arr.slice(middle);
            merge_sort( left );
            merge_sort( right );

            let i = 0,
                j = 0,
                k = 0;

            while(i < left.length && j < right.length ){

                if(left[i] < right[j]){

                    arr[k] = left[i];
                    ++i;

                }
                else{

                    arr[k] = right[j];
                    ++j;

                }

                ++k;

            }

            if( i < left.length ){

                while(i < left.length){

                    arr[k] = left[i];
                    ++i;
                    ++k;

                }
                
            }
            else{

                while(j < right.length){

                    arr[k] = right[j];
                    ++j;
                    ++k;

                }

            }


        }

        


    };

    let arr = [45, 67, 23, 45, 21, 24, 7, 2 , 6 ,4 , 90];
    merge_sort(arr)

    console.log("Merge sort: ", arr)

} )();




( ()=>{

    let quick_sort = function(arr, first, last){

        if(last > first){

            let pivot = merge(arr, first, last);

            quick_sort(arr, first, pivot - 1);
            quick_sort(arr, pivot + 1, last);

        }

    }

    let merge = function(arr, first, last){

        let pivot = last;
        let i = first - 1;

        for(let j = first; j  < last; j++){

            if(arr[pivot] > arr[j]){

                ++i;

                if(i != j){

                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;

                }

            }

        }

        let temp = arr[i + 1];
        arr[i + 1] = arr[last];
        arr[last] = temp;

        return i + 1;

    }

    let arr = [45, 67, 23, 45, 21, 24, 7, 2 , 6 ,4 , 90];
    quick_sort(arr, 0 , arr.length - 1);
    console.log("Quick sort: ", arr)

} )();



( ()=>{

    class HashTable{

        constructor(size){
            this.size = size;
            this.values = Array.from(Array(size));
            this.keys = Array.from(Array(size));
        }

        getHashCode(key){

            return key % this.size;

        }

        rehash(old_hash){
            return (old_hash + 1 ) % this.size;
        }

        set(key, value){

            let hashIndex = this.getHashCode(key);

           

            if(!this.keys[hashIndex]){
                this.keys[hashIndex] = key;
                this.values[hashIndex] = value
            }
            else{

                if(this.keys[hashIndex] == key){
                    this.values[hashIndex] = value
                }
                else{

                    let nextSlot = this.rehash(hashIndex);

                    while(this.keys[nextSlot] && this.keys[nextSlot] != key){
                        
                        nextSlot = this.rehash(nextSlot);
                        if(key == 6) console.log(nextSlot)

                    }

                    if(key == 6) console.log("izvan witcha", nextSlot)


                    if(!this.keys[nextSlot]){
                        this.keys[nextSlot] = key;
                        this.values[nextSlot] = value
                    }
                    else{
                        this.values[nextSlot] = value
                    }

                }

            }


        }

        get(key){

            let hashIndex = this.getHashCode(key);

            console.log(this.keys[hashIndex] == key)

            if(this.keys[hashIndex] == key){
                console.log(`key: ${this.keys[hashIndex]}, value: ${this.values[hashIndex]}`)
            }

            console.log(this.keys)

        }

        


    }



    let h = new HashTable(5)
    h.set(0, "zero")
    h.set(1, "one")
    h.set(2, "two")
    h.set(3, "three")
    h.set(4, "four")
    console.log(h)
    h.set(6, "Hello")
    h.get(6)

} )();