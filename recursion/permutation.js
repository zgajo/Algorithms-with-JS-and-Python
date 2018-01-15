

(()=>{
    function permute(s) {
    
        let out = []
        if(s.length == 1){
            out = [s]
        }
        else{
    
            // For every letter in word
            for(let i = 0; i < s.length; i++){ 
    
                // Permute next word (ex. 1st is abc, we are sending bc into recursive call)
                // For every returned combination push into out array
                for(perm of permute( s.substring(0, i) + s.substring( i+1, s.length) )){
                    out.push(s[i] + perm)
                }
            }
    
        }
    
        return out
    
    }
    
    console.log(permute("abc"))
})()