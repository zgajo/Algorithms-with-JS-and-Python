class Missing {

	constructor(arr1, arr2){
		this.arr1 = arr1;
		this.arr2 = arr2;
		this.mappedArray = new Map();
	}

	get findMissing(){
		this.arrayIntoMap();

		for( let i = 0; i < this.arr1.length; i++)
		{
			let num = this.arr1[i];

			if(this.mappedArray.get(num))	// if number key has a value higher than 0
			{
				this.mappedArray.set( num, this.mappedArray.get(num) - 1 );
			}
			else
			{							// else  missing is found
				return num;
			}
		}
	}

	// Setting second array into map
	arrayIntoMap(){

		this.arr2.forEach( num => {

			if(this.mappedArray.has( num ))
			{
				this.mappedArray.set( num, this.mappedArray.get(num) + 1 );
			}
			else
			{
				this.mappedArray.set( num, 1 );
			}

		})

	}


}

console.log('\n ------------------------  \n')

console.log('* Find missing element *')

let arr1 = [1,2,3,4,5,6,7], arr2 = [3,7,2,1,4,6];
let missing = new Missing(arr1, arr2)
console.log(`Array 1: ${arr1}`)
console.log(`Array 2: ${arr2}`)
console.log('Missing number in second array is: ' + missing.findMissing)


arr1 = [5,5,7,7], arr2 = [5, 5, 7]
let missing2 = new Missing(arr1, arr2)
console.log(`Array 1: ${arr1}`)
console.log(`Array 2: ${arr2}`)
console.log('Missing number in second array is: ' + missing2.findMissing)