function word_split(phrase, words_array, output = null) {

    output = output || [];
    
    if(phrase.length > 0){

        words_array.forEach(element => {
            if(element == phrase.substring(0, element.length)){
                output.push(element);
                // removes first part of word and recursivly calls function
                return word_split(phrase.substring(element.length), words_array, output);
            }
        });

    }

    return output;   

}

console.log(word_split('themanran',['the','ran','man']))

console.log(word_split('ilovedogsJohn',['i','am','a','dogs','lover','love','John']))

console.log(word_split('themanran',['clown','ran','man']))