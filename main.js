Array.prototype.copy2d = function () {
  let copy = [];
  for (let i = 0; i < this.length; i++) {
    copy.push([]);
    for (const elem of this[i]) copy[i].push(elem);
  }
  return copy;
};

const GAME = new Game();

/*

TODO:

- promotion
- slide back & forth moves
- separate i,j (hex) & x,y (grid)

- grabbing cursor
- multiple styles (colors & pieces) (css variables for style)
- sound effect

*/
