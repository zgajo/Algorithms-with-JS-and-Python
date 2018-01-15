
(()=>{
    let memo = {}

    function fibo_dyn(n) {
        if(n < 2){
            return n
        }    
        else if(!memo[n]){
            memo[n] = fibo_dyn(n-1) + fibo_dyn(n-2)
        }
        return memo[n]
    
    }
    
    console.log(fibo_dyn(10))
    
})()