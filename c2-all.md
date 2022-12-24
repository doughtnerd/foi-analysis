```foi
defn binaryToDecimalConverter(binaryDigits) {
  def < :decimal >: (| ~fold
    binaryDigits,
    < decimal: 0, idx: 0 >,
    (< :decimal, :idx >, digit) {
      def power: size(binaryDigits) - idx - 1;
      decimal := decimal + (digit * pow(2, power));
      < :decimal, idx: |+ idx,1| >;
    }
  );
  ^decimal;
}
```

```foi
defn binaryToDecimalConverter(binaryDigits) {
  def < x, ..xs >: binaryDigits;
  ?[x ?= ''] ^0;
  ^convertBToI(x, length(xs)) + binaryToDecimalConverter(xs);
}

defn convertBToI(digit, idx) {
  ?(x){ 
    ?[?= '0']: ^0;
    ?[?= '1']: ^pow(2, idx);
    ?: throw "Input is not binary";
  };
}
```

```js
function binaryToDecimalConverter([x, ...xs]) {
  if(!x) return 0;
  return convertBToI(x, xs.length) + binaryToDecimalConverter(xs);
}

function convertBToI(digit, i) {
  switch (digit) {
    case '0':
      return 0;
    case '1':
      return Math.pow(2, i);
    default:
      throw new Error('Input is not binary')
  }
}
```


```hs
binaryToDecimalConverter :: String -> Int
binaryToDecimalConverter (x : xs) = convertBToI x (length xs) + binaryToDecimalConverter xs
binaryToDecimalConverter [] = 0

convertBToI :: Char -> Int -> Int
convertBToI '0' i = 0
convertBToI '1' i = 2 ^ i
convertBToI _ _ = error "Input is not binary"
```