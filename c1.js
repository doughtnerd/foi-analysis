function chunk(array, sizeOfChunks) {
  const numberOfElements = array.length;
  const numberOfChunks = Math.ceil(numberOfElements / sizeOfChunks);
  const arrayOfChunks = [...new Array(numberOfChunks)].map((_,index) => {
    const startingIndex = index * sizeOfChunks;
    const endingIndex = startingIndex + sizeOfChunks;
    return array.slice(startingIndex,endingIndex);
  });

  return arrayOfChunks;
}

function chunk2(array, sizeOfChunks) {
  if (!array | array.length === 0 || sizeOfChunks <= 0) return [];
  const group = array.slice(0, sizeOfChunks);
  const rest = array.slice(sizeOfChunks);
  return [group].concat(chunk2(rest, sizeOfChunks))
}

console.log(chunk2([1,2,3,4,5,6], 3));