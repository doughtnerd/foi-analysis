chunk :: [a] -> Int -> [[a]]
chunk array sizeOfChunks = [mapChunk x | x <- [0 .. numberOfChunks - 1]]
  where
    numberOfElements = length array
    numberOfChunks = ceiling $ fromIntegral numberOfElements / fromIntegral sizeOfChunks
    mapChunk val =
      let startingIndex = val * sizeOfChunks
          endingIndex = startingIndex + sizeOfChunks
       in slice startingIndex endingIndex array

slice :: Int -> Int -> [a] -> [a]
slice from to xs = take (to - from) (drop from xs)

chunk' :: [a] -> Int -> [[a]]
chunk' array sizeOfChunks
  | sizeOfChunks <= 0 || null array = []
  | otherwise =
      let group' = take sizeOfChunks array
          rest' = drop sizeOfChunks array
       in group' : chunk' rest' sizeOfChunks

-- >>> chunk' [1,2,3,4,5,6] 2
-- [[1,2],[3,4],[5,6]]

-- >>> chunk [1,2,3,4] 3
-- [[1,2,3],[4]]
