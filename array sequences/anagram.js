(function(global){

	const anagram = function(str1, str2){

		// removes all whitespaces
		str1 = str1.replace(/\s/g, '');
		str2 = str2.replace(/\s/g, '');

		// All lettters from string into array
		let strArray1 = str1.split("");
		let strArray2 = str2.split("");

		// if words are not same letter length
		if(strArray1.length != strArray2.length)
		{
			return "Not anagram";
		}

		// Variable to store letters in it
		let strMap = new Map();

		strArray1.forEach(letter => {
			// Counting letters and setting them into map
			if(strMap.has(letter))
			{
				strMap.set(letter, strMap.get(letter) + 1);
			}
			else
			{
				strMap.set(letter, 1);
			}
		});

		try{ // using try - catch block, to stop executing foreach block

			strArray2.forEach(letter => {
				// Checking second string with letters from first string
				// removing letters
				if(strMap.has(letter))
				{
					strMap.set(letter, strMap.get(letter) - 1);
				}
				else
				{
					throw "Not anagram, letter not found";
				}
			});
		
			strMap.forEach( value => {
				// Checking if there are some letters left in map
				if(value != 0) throw "Not anagram, too many letters";
			});

		}

		catch(e){
			return e;
		}
		

		return "It is anagram truly my friend";

	}

	global.anagram = anagram;

})(global)


console.log('\n ------------------------  \n')

console.log('* Anagram check *')

console.log(anagram('dog','god'))
console.log(anagram('clint eastwood','old west action'))
console.log(anagram('clint','eastwood'))