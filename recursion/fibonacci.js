
(function(){
    function fibonacci(n) {
        if(n < 2) return n;
        return fibonacci(n-1) + fibonacci(n-2)
    }
    //https://technobeans.com/2012/04/16/5-ways-of-fibonacci-in-python/
    console.log(fibonacci(10))
    
}())