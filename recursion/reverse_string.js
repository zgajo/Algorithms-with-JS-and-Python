function reverse_string(s) {
    if(s < 2) {
        return s;
    } 
    return reverse_string(s.substring(1, s.length)) + s.substring(0, 1);
}

console.log(reverse_string('hello world'))