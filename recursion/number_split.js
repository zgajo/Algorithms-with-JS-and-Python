
(()=>{
    function number_sum(num) {

        num = parseInt(num);
        
        let n = num % 10;       // get last number
        
        let numStr = num.toString();  // number to string, so it could read length
        if(numStr.length == 1) return num;
    
        
        let firstn = numStr.substring(0, numStr.length - 1 ); // get all numbers except last one
        return n + number_sum(firstn);
    
    }
    
    console.log(number_sum(4321))
    
})()