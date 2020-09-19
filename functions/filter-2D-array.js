
// filter 2D array
function filterByPosition(array, number, position) {
    return array.filter(innerArray => innerArray[position] !== number);
}

/****
use:

arr2D = [[0,1],
        [2,3],
        [4,5]];

unwantedElement = [2,3];

filteredArr = filterByPosition(arr2D, unwantedElement[0], 0);

console.log(filteredArr);

//--> [[0,1],
      [4,5]]

****/
