```foi
defn chunk(array, sizeOfChunks) {
  def numberOfElements: size(array);
  def numberOfChunks: floor(numberOfElements / sizeOfChunks);
  def arrayOfChunks: 0..numberOfChunks ~map (index) {
    def startingIndex: index * sizeOfChunks;
    def endingIndex: startingIndex + sizeOfChunks;
    array.[startingIndex..(endingIndex - 1)];
  };

  ^arrayOfChunks;
}
```

```foi
defn chunk(array, sizeOfChunks) {
  ?[length(array) ?= 0 ?or sizeOfChunks ?< 0]: ^[];
  def group: array.[0..sizeOfChunks);
  def rest: array.[sizeOfChunks..];
  ^concat([group], chunk(rest, sizeOfChunks));
}
```

```js
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
```

```js
function chunk(array, sizeOfChunks) {
  if (array.length === 0 || sizeOfChunks <= 0) return [];
  const group = array.slice(0, sizeOfChunks);
  const rest = array.slice(sizeOfChunks);
  return [group].concat(chunk2(rest, sizeOfChunks))
}
```

```hs
chunk :: [a] -> Int -> [[a]]
chunk array sizeOfChunks
  | sizeOfChunks <= 0 || null array = []
  | otherwise =
      let group' = take sizeOfChunks array
          rest' = drop sizeOfChunks array
       in group' : chunk rest' sizeOfChunks
```