
(function(){
    function fibonacci(n) {
        if(n < 2) return n;
        return fibonacci(n-1) + fibonacci(n-2)
    }
    //https://technobeans.com/2012/04/16/5-ways-of-fibonacci-in-python/
    let start = new Date().getTime();
    console.log(fibonacci(20));
    let end = new Date().getTime();
    console.log(`Recursive solution took ${end - start} miliseconds`)
    
}());


// Dynamic programming solution

( ()=>{

    let dyn_fibo = function(n){

        if(n == 1 || n == 2) return 1;

        let val = Array.from(Array(n));

        val[0] = 0;
        val[1] = 1;       

        for(let i = 2; i < n; i++){

            val[i] = val[i-1] + val[i-2];

        }

        return val[n-1];        

    }

    let start = new Date().getTime();
    console.log(dyn_fibo(20))
    let end = new Date().getTime();
    console.log(`Recursive solution took ${end - start} miliseconds`)


} )();


( ()=>{

    let dyn_fibo = function(n){


        let next = 1, 
            last = 1, 
            result = 0;

        
        for(let i = 2; i < n; i++){

            result = next + last;
            next = last;
            last = result;

        }

        return result;        

    }

    let start = new Date().getTime();
    console.log(dyn_fibo(20))
    let end = new Date().getTime();
    console.log(`Recursive solution took ${end - start} miliseconds`)


} )();