(function(global){

	const LargestContinous = function(arr){

		if(arr.length < 2 ){
			return arr[0];
		}

		let current = max = arr[0];

		for(let i = 1; i < arr.length; i++){

			if(current + arr[i] < arr[i])
			{
				current = max = arr[i];
			}
			else{
				current += arr[i];
				if(current > max){
					max = current;
				}
			}
		}

		return max

	}


	global.LargestContinous = LargestContinous
})(window)

console.log('\n ------------------------  \n')

console.log('* Sum largest contiuous *')
console.log(LargestContinous([1,2,-1,3,4,10,10,-10,-1]))