binaryToDecimalConverter :: String -> Int
binaryToDecimalConverter (x : xs) = convertBToI x (length xs) + binaryToDecimalConverter xs
binaryToDecimalConverter [] = 0

convertBToI :: Char -> Int -> Int
convertBToI _ i | i < 0 = error "Bad position"
convertBToI '0' i = 0
convertBToI '1' i = 2 ^ i
convertBToI _ _ = error "Input is not binary"
