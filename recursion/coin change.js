
(()=>{
    function coin_change(target, coins, currentCoin) {

        if(target < 0){
            console.log("\n ---  --- \n")
            return 0;
        }
        if(target == 0){
            console.log("\n --- +1 --- \n")
            return 1
        }
    
        let out = 0;
    
        for(let coin = currentCoin; coin < coins.length; ++coin){
            console.log("target: ", target)
            console.log("coin: ", coins[coin])
            out += coin_change(target - coins[coin], coins, coin)
        }
    
        return out
        
    }
    
    console.log(coin_change(63,[1,5,10,25], 0))
    
})()