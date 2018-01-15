

(()=>{
	let StringCompress = function(str){
	
		let compressed = "";
	
		let i = 1;
		let size = 1;
	
		while(i < str.length){
	
			if( str[i-1] == str[i]  ){
				++size;
			}
			else{
				compressed = compressed + str[i-1] + size;
				size = 1;
			}
	
			if(i == str.length - 1) {
				compressed = compressed + str[i-1] + size;
			}
	
			++i;
	
		}
	
		return compressed;
	
	}
	
	
	console.log(StringCompress("AAAAABBBBCCCC"))
	console.log(StringCompress("AAaBBCC"))
})()