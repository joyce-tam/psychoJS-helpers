// arange
function arange (start, stop, step){
      step = step || 1;
      var arr = [];
      for (var i=start;i<stop;i+=step){
         arr.push(i);
      }
      return arr;
};

/****
use:

arr = arange(0,10,1);

console.log(arr)

//--> [0,1,2,3,4,5,6,7,8,9]

****/
