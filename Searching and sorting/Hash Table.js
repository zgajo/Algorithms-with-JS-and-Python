(()=>{

    class HashTable{

        constructor(size){
           
            this.size = size;
            //two empty arrays with empty values in it of length of size
            this.slots = Array.from(Array(this.size));  // to store keys
            this.data = Array.from(Array(this.size));   //to store data

        }

        put(key, data){

            let hash_value = this.hashFunction(key, this.slots.length);

            // if position is free, store key and data
            if(!this.slots[hash_value]){ 

                this.slots[hash_value] = key;
                this.data[hash_value] = data;

            } 
            else{

                // same key is already in that position, store data over it
                if(this.slots[hash_value] == key){

                    this.data[hash_value] = data;
                    
                }
                else {

                    // retrive next hash value 
                    let nextslot = this.rehash( hash_value, this.slots.length );

                    // find either empty slot in stored keys or same key in slots
                    while(this.slots[nextslot] && this.slots[nextslot] != key){

                        nextslot = this.rehash(nextslot, this.slots.length)

                    }

                    // if position is free, store key and data
                    if(!this.slots[nextslot]){

                        this.slots[nextslot] = key;
                        this.data[nextslot] = data;

                    }
                    else{
                        // same key is already in that position, store data over it
                        this.data[nextslot] = data;
                    }

                }

            }

        }

        hashFunction(key, size){

            return key % size;

        }

        rehash(oldhash_value, size){
            return (oldhash_value + 1 ) % size;
        }

        get(key){

            let startslot = this.hashFunction(key, this.slots.length),
                data = null,
                stop = false,
                found = false, 
                position = startslot;

            while(this.slots[position] && !found && !stop ){

                if(this.slots[position] == key){
                    found = true;
                    data = this.data[position];
                }
                else {
                    position= this.rehash(position, this.slots.length)

                    if(position == startslot){
                        stop = true;
                    }

                }

            }

            return data;            

        }



    }

    let h = new HashTable(5)
    h.put(0, "zero")
    h.put(1, "one")
    h.put(2, "two")
    h.put(3, "three")
    h.put(4, "four")
    h.put(6, "Hello")
    console.log(h)
    console.log(h.get(1))

})()