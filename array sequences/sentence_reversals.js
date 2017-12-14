class Reversal{
	
	constructor(str){
		this.str = str.trim();
		this.str_array = [];
		this.word = [];
	}

	reversedSentence(){
		let reversedWord = [];

		for(let i = this.str_array.length - 1; i >=0; i-- )
		{
			reversedWord.push(this.str_array[i])
		}

		return reversedWord.join(" ")
	}

	reverseFor(){
		this.str_array = [];
		for(let i = 0; i < this.str.length; i++)
		{
			if(this.str[i] == " "){
				if(this.word.length) {
					this.str_array.push(this.word.join(""));
				}
				this.word = [];
			}
			else{
				this.word.push(this.str[i])
			}

		}

		if(this.word.length) {
			this.str_array.push(this.word.join(""));
		}
		this.word = [];

		return this.reversedSentence();

	}

	reverseWhile(){
		this.str_array = [];
		let i = 0;
		let length = this.str.length

		while(i < length){

			let wordsIndexes = [];
			
			while( i < length && this.str[i] != " " ){
				wordsIndexes.push(this.str[i]);
				i += 1;
			}

			if(wordsIndexes.length){
				this.str_array.push(wordsIndexes.join(""));
			}

			i += 1;

		}

		return this.reversedSentence();

	}

}