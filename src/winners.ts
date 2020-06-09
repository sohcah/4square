var winners: [
  [number, number],
  [number, number],
  [number, number],
  [number, number]
][] = [];

for (var i = 1; i <= 5; i++) {
  for (var x = 0; x < 7 - i; x++) {
    for (var y = 0; y < 6 - i; y++) {
      for (var o = 0; o < i; o++) {
        winners.push([
          [x + o, y],
          [x + i, y + o],
          [x, y + i - o],
          [x + i - o, y + i],
        ]);
      }
    }
  }
}

export default winners;
