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

function binaryToDecimalConverter2([x, ...xs]) {
  if(!x) return 0;
  return convertBToI(x, xs.length) + binaryToDecimalConverter2(xs);
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