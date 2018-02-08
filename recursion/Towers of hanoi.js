( ()=>{

    function printMove(n, fr, to){

        console.log("move disk " +n+ " from " + fr + " to " + to);

    }
/*
   function towers(n, fr, to, spare){

        if(n == 1) printMove(n, fr, to);
        else{
            console.log( "towers(n-1, fr, spare, to)" , n-1, fr, spare, to)
            towers(n-1, fr, spare, to);
            printMove(n, fr, to);
            console.log( "towers(n-1, spare, to, fr)" , n-1, spare, to, fr)
            towers(n-1, spare, to, fr);
        }

    }*/

    function towers(n, fr, sp, to){

        if(n == 1) printMove(n, fr, to);
        else{

            towers(n-1, fr, to, sp);
            printMove(n, fr, to);
            towers(n-1, sp, fr, to);

        }

    }

    towers(3, "A", "B", "C")


} )();