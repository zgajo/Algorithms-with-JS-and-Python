let memo = {}

function fibo(n) {
    if(n < 2){
        return n
    }    
    else if(!memo[n]){
        memo[n] = fibo(n-1) + fibo(n-2)
    }
    return memo[n]

}

console.log(fibo(10))