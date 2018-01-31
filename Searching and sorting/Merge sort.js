(() => {

    // O(nlogn)
    function mergeSort(A) {

        if (A.length > 1) {

            let mid = parseInt(A.length / 2),
                left = A.slice(0, mid),
                right = A.slice(mid);

            mergeSort(left);
            mergeSort(right);

            let i = 0; //for left half of array
            let j = 0; //for right half of array
            let k = 0; // for inserting into final array

            // Merging subarrays into array

            while (i < left.length && j < right.length) {

                if (left[i] < right[j]) {
                    A[k] = left[i];
                    i += 1
                } else {
                    A[k] = right[j];
                    j += 1;
                }

                k += 1;

            }

            while (i < left.length) {
                A[k] = left[i];
                i += 1;
                k += 1;
            }

            while (j < right.length) {
                A[k] = right[j];
                j += 1;
                k += 1;
            }

        }



        console.log(A)
    }



    let mergeSort2 = (A) => {

        if (A.length > 1) {

            let mid = Math.floor(A.length / 2),
                left = A.slice(0, mid),
                right = A.slice(mid);

            mergeSort2(left);
            mergeSort2(right);

            merge(A, left, right)
        }

    }

    let merge = (A, left, right) => {

        let i = j = k = 0;

        while (i < left.length && j < right.length) {

            if (left[i] < right[j]) {
                A[k] = left[i];
                i += 1;
            } else {
                A[k] = right[j];
                j += 1;
            }

            k += 1;

        }
        
        A.concat(left.slice(i)).concat(right.slice(j))
        

    }

    let arr = [2, 4, 5, 7, 1, 2, 3, 6];

    mergeSort(arr)
    console.log(arr);

})()