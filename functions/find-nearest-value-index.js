// find nearest value
function nearest(num, arr) {
  curr = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (Math.abs(num - arr[i]) < Math.abs(num - curr)) {
      curr = arr[i];
    }
  }
  return arr.indexOf(curr);
}

/****
use:

existingArr = [2,4,6,8,10];

tarNum = 5.6;

idx = nearest(tarNum,existingArr);

console.log(idx);

// --> 2 (index of value 6 in array existingArr)

****/
