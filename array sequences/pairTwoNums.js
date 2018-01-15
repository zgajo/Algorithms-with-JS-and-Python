(function(global){
	
	const Pair = function(arr, target){
		// Creating new object so we don't have to do it later in the browser
		return new Pair.init(arr, target);
	}

	// Setting all methods which will object use
	Pair.prototype = {

		getPairNumbersBySet: function(){

			this.checkArrayLength();

			this.arr.forEach( num => {
				if(this.seenNumsSet.has(this.target - num)){
					this.outputSet.add([num, this.target - num]);
				}
				else{
					this.seenNumsSet.add(num)
				}
			})

			return this.outputSet.values();
		},

		getPairNumbersByMap: function(){

			this.checkArrayLength();

			let pairArray = [];

			for(let i = 0; i< this.arr.length; i++)
			{
				if(this.seenNumsMap.has(this.target - this.arr[i] )){
					pairArray.push([ this.arr[i], this.target - this.arr[i] ]);
				}
				else{
					this.seenNumsMap.set(this.arr[i], i)
				}
			}

			return pairArray;

		},

		getIndexesOfPairs: function(){

			this.checkArrayLength();

			let pairArray = [];

			for(let i = 0; i< this.arr.length; i++)
			{
				if(this.seenNumsMap.has(this.target - this.arr[i] )){
					pairArray.push([ i, this.seenNumsMap.get(this.target - this.arr[i] ) ] );
				}
				else{
					this.seenNumsMap.set(this.arr[i], i)
				}
			}

			return pairArray;
		},

		checkArrayLength: function(){
			if(this.arr.length < 2) return "Array not long enough"
		}
	}

	Pair.init = function(arr, target) {
		this.arr = arr;
		this.target = target;
		// Have to set seen set
		this.seenNumsSet = new Set();
		this.outputSet = new Set();

		// Have to set seen map
		this.seenNumsMap = new Map();
		// have to set map for indexes

		this.arrIndexes = [];
	}

	Pair.init.prototype = Pair.prototype;

	global.PairTwo = Pair;

})(this);

console.log('\n ------------------------  \n')

console.log('* Pair two numbers *')

let t = this.PairTwo([2,3,1,2], 4);
console.log('Array: ', [2,3,1,2])
console.log('Indexes of pairs: ', t.getIndexesOfPairs())
t = this.PairTwo([2,3,1,2], 4);
console.log('Paired using Map: ', t.getPairNumbersByMap())
t = this.PairTwo([2,3,1,2], 4);
console.log('Paired using Set: ', t.getPairNumbersBySet())