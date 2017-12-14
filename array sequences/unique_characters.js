let UniqueChars = function(str){

	let seen = new Set();

	for(let i = 0; i < str.length; i++){
		if( seen.has(str[i]) ) return false;
		else{
			seen.add( str[i] )
		}
	}

	return true;

} 

console.log(UniqueChars(""))
console.log(UniqueChars("goo"))
console.log(UniqueChars("abcdefg"))