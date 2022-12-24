In programming, there are 3 questions that are chief in my mind when evaluating a new language:

1. How many concepts do I need to do a 'thing' (i.e. how many concepts do I have to combine in order to write a meaningful function/program/etc.)?

2. How much work do I need to do to represent a 'concept' (i.e. what do I need to type in order to represent a concept, how easy is it to remember, type, etc.)?

3. How easy is it to read a piece of code and clearly identify the 'concepts' in use to do a 'thing' (i.e. when I review someone's code, how quickly can I grok it or at the very least, distinguish individual concepts from one another)?


# Analysis

To begin, I reviewed a few of the JS / Foi comparison examples. I began by taking a couple of the comparisons, writing them out, trying to write an 'optimal' version of the code, then adding writing a Haskell version, just to see how everything contrasted. 

I used the questions listed above of as the framing for how I analyzed Foi and my feedback mostly concerns some aspect of where I feel Foi failed (or succeeded) in meeting my standards.

# Comparison 1 - Chunked Array

## Original Foi
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

The original is fiarly readable I think, until you get to the comprehension part. At first glance, having range generation share similar syntax to slicing (the `..`) is a bit odd. Having `~` in front of map seems a bit odd too, as it leads me to wonder if `~` could be prefixed to any function and have that function be used in list comprehension or if `~` prefixed functions are a special class of functions. Lastly, the declaration of the `(index) {..body}` bit also seems odd. It doesn't follow what I thought would be the syntax for declaring a function and it doesn't follow the rules of return values (using `^`).

The only other thing I would say is that I think a Haskell-like list comprehension would be nice here and perhaps add some clarity but overall, it's not bad.

## Revised Foi

```foi
defn chunk(array, sizeOfChunks) {
  ?[length(array) ?= 0 ?or sizeOfChunks ?< 0]: ^[];
  def group: array.[0..sizeOfChunks);
  def rest: array.[sizeOfChunks..];
  ^concat([group], chunk(rest, sizeOfChunks));
}
```

Without truly understanding how to use the language, this is what I boiled the function down to. Mostly for funsies, to see if I could understand it and make it a bit more terse, functional, and safer. There are gaps however; for example, I didn't quite understand how to slice an array starting at `sizeOfChunks` to the end of the array, so I made an assumption of writing the expression as `array.[sizeOfChunks..]`. If I could have written the conditional logic closer to something like `if length(array) ?= 0 ?or sizeOfChunks ?< 0 then ^[];`, then I'd say that this code is much more readable. If I was able to follow syntax of more conventional languages and write `if length(array) == 0 || sizeOfChunks < 0 then ^[];` I'd feel a lot more comfortable. The only way in my opinion that this could be improved further is if I could follow Haskell-like guard clauses but I'm not sure how I'd fit that into a language like Foi.

## Original JS Comparison and Revised JS version

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
  return [group].concat(chunk(rest, sizeOfChunks))
}
```

I translated both the original Foi and revised Foi into JS code. Yes, I know JS doesn't support tail-call recursion but honestly, I'd say the both JS versions are both much easier to write and to understand than the Foi version, though I do claim some bias here. Mostly because of the confusions pointed to in the above sections.

## Haskell Version of Original

```hs
chunk :: [a] -> Int -> [[a]]
chunk array sizeOfChunks = [mapChunk x | x <- [0 .. numberOfChunks - 1]]
  where
    numberOfElements = length array
    numberOfChunks = ceiling $ fromIntegral numberOfElements / fromIntegral sizeOfChunks
    mapChunk val =
      let startingIndex = val * sizeOfChunks
          endingIndex = startingIndex + sizeOfChunks
       in slice startingIndex endingIndex array
```

For funsies, I tried to write the original version of the Foi function in Haskell and big surprise, it's a little gross - which I say is a credit to Haskell. I've often found that when writing code in Haskell, if you're writing code in a way you probably shouldn't it's often *hard* code to write to begin with. Haskell is essentially *forcing* me to write it different, which lead to the below code.

## Haskell Version of Revised Code

```hs
chunk :: [a] -> Int -> [[a]]
chunk array sizeOfChunks
  | sizeOfChunks <= 0 || null array = []
  | otherwise =
      let group' = take sizeOfChunks array
          rest' = drop sizeOfChunks array
       in group' : chunk rest' sizeOfChunks
```

Code that's safe, terse, efficient, has type information, and is easy to read? Yes please and thank you Haskell.

# Comparison 2 - Binary to Decimal

## Original Foi 
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

Honestly, even though what this is doing is fairly simple, I found this code exceptionally hard to work with. There just doesn't seem to be good "landmarks" in the code for my eyes to pick out to help differentiate the concepts in use. It doesn't help that `:` is repeated so often and seemingly used for different concepts (at least I think it's used for different concepts?). But I digress, there just seems to be a lot going on and distinguishing the 'bits' from one another is cumbersome for my brain. 

For example, what is `(| ~fold` doing? It's a list comprehension, right? I'd expect list comprehension to remain as a consistent syntax and have a list preceed it, like the example from the other snippet. Looking at the docs, I'm guessing the `|` makes `~fold` some form of s-expression or prefix notation in it's use? What about the usage of `digit`, is it being coerced? If so, what safety is in place to guard against a bad input? I'm also very unsure about the `< :decimal >` syntax in the destructuring very... confusing. Why does `:` prefix the var name and would it make something like `< :decimal: |+ 1, idx| >` legal code? I would personally find that very annoying to read.

Lastly, is `decimal :=` indicating mutability of variables? Not quite sure how I feel about that in a functional language...

## Revised Foi

```foi
defn binaryToDecimalConverter(binaryDigits) {
  def < x, ..xs >: binaryDigits;
  ?[x ?= ""] ^0;
  ^convertBToI(x, length(xs)) + binaryToDecimalConverter(xs);
}

defn convertBToI(digit, idx) {
  ?[x ?< 0]: throw("Invalid position of binary digit");
  ?(x){ 
    ?[?= '0']: ^0;
    ?[?= '1']: ^pow(2, idx);
    ?: throw ("Input is not binary");
  };
}
```

Again, for funsies, tried to revise the code. Assuming it's syntactically correct, I find it to be an improvement though again, I take issue with the conditional logic. I just find it odd to read, annoying to type, and not terse enough to warrant diverging from traditional syntax.

## Original JS Example

```js
function binaryToDecimalConverter(binaryDigits) {
  var { decimal } = Array.from(binaryDigits).reduce(
    ({ decimal, idx }) => {
      var power = binaryDigits.length - idx - 1;
      decimal = decimal + (digit * Math.pow(2, power));
      return { decimal, idx: (idx + 1) };
    },
    { decimal: 0, idx: 0 }
  );
  return decimal;
}
```

Again, I find it a lot easier to work with than the original Foi.

```js
function binaryToDecimalConverter([x, ...xs]) {
  if(!x) return 0;
  return convertBToI(x, xs.length) + binaryToDecimalConverter(xs);
}

function convertBToI(digit, i) {
  if (i < 0) throw new Error('Invalid position of binary digit');
  switch (digit) {
    case '0': return 0;
    case '1': return Math.pow(2, i);
    default: throw new Error('Input is not binary')
  }
}
```

Terse, easy to read, and correct.

## Haskell Version of Revised Code

```hs
binaryToDecimalConverter :: String -> Int
binaryToDecimalConverter (x : xs) = convertBToI x (length xs) + binaryToDecimalConverter xs
binaryToDecimalConverter [] = 0

convertBToI :: Char -> Int -> Int
convertBToI _ i 
  | i < 0 = error "Invalid position of binary digit"
convertBToI '0' i = 0
convertBToI '1' i = 2 ^ i
convertBToI _ _ = error "Input is not binary"
```

Just for contrast, Haskell pattern matching and guard clause used in tandem to solve the problem.