class RenderHTML {
  constructor(game) {
    this.board = this.$("board");
    this.game = game;

    // constants
    this.flatness = 1.15;
    this.viewPortPercent = 95;
    this.scale = 0.92;
    this.imgScaling = 1.3;
    this.transition = 200;

    // layers & elements
    this.backLayer = null;
    this.backCells = [];

    this.mainLayer = null;
    this.mainCells = [];

    this.imageLayer = [];
    this.images = [];

    this.invisLayer = null;
    this.invisCells = [];

    // unique cells
    this.floating = null;
    this.selected = null;
    this.hovering = null;

    this.init();
  }

  $ = (id) => document.getElementById(id);
  $$ = (q) => document.querySelector(q);
  $$$ = (q) => document.querySelectorAll(q);

  init() {
    this.calculateSize();
    this.setCSSProperties();
    this.createBackLayer();
    this.createMainLayer();
    this.createImageLayer();
    this.createInvisLayer();
    this.setScale();
    this.makeVisible();
  }

  calculateSize() {
    this.bound = (4 - Math.sqrt(7)) / 6;

    const windowAspectRatio = innerWidth / innerHeight;
    const boardAspectRatio =
      (this.flatness * (6 + 5 * (1 - 2 * this.bound))) / 11;

    if (windowAspectRatio > boardAspectRatio) {
      const pixelSize = (innerHeight * this.viewPortPercent) / 100;
      this.size = (pixelSize * this.flatness) / 11;
      this.boardTop = (innerHeight - pixelSize) / 2;
    } else if (windowAspectRatio <= boardAspectRatio) {
      const pixelSize = (innerWidth * this.viewPortPercent) / 100;
      this.size = (pixelSize * this.flatness) / boardAspectRatio / 11;
      this.boardTop = (innerHeight - pixelSize / boardAspectRatio) / 2;
    }

    this.imgSize = this.size * this.imgScaling * (1 - 2 * this.bound);
  }

  setProperty(property, value) {
    document.documentElement.style.setProperty(property, value);
  }

  setCSSProperties() {
    this.setProperty("--board-top", `${this.boardTop}px`);
    this.setProperty("--bound", this.bound);
    this.setProperty("--size", `${this.size}px`);
    this.setProperty("--flatness", this.flatness);
    this.setProperty("--scale", this.scale);
    this.setProperty("--img-scaling", this.imgScaling);
    this.setProperty("--img-size", `${this.imgSize}px`);
  }

  createBackLayer() {
    // number of cells in each row
    const num = [1, 2, 3, 4, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 4, 3, 2, 1];

    this.backLayer = document.createElement("div");
    this.board.append(this.backLayer);
    this.backLayer.id = "back-layer";

    let top = 0;
    for (let i = 0; i < 21; i++) {
      const Row = document.createElement("div");
      this.backLayer.append(Row);
      Row.classList.add("row");
      Row.style.top = `${top}px`;
      this.backCells.push([]);

      for (let j = 0; j < num[i]; j++) {
        const Cell = document.createElement("div");
        Row.append(Cell);
        Cell.classList.add("cell");
        this.backCells[i].push(Cell);
        Cell.setAttribute("color", (i % 3) + 1);
        Cell.setAttribute("possible-move", 0);
        Cell.setAttribute("capture", 0);
      }

      top += (this.size * 0.5) / this.flatness;
    }
  }

  createMainLayer() {
    this.mainLayer = document.createElement("div");
    this.mainLayer.id = "main-layer";
    this.board.append(this.mainLayer);

    const boardRect = this.board.getBoundingClientRect();
    for (let i = 0; i < this.backCells.length; i++) {
      this.mainCells.push([]);
      for (let j = 0; j < this.backCells[i].length; j++) {
        const Cell = document.createElement("div");
        Cell.classList.add("cell");
        this.mainLayer.append(Cell);
        this.mainCells[i].push(Cell);

        const rect = this.backCells[i][j].getBoundingClientRect();
        const x = rect.x - boardRect.x;
        const y = rect.y - boardRect.y;
        Cell.style.left = `${x}px`;
        Cell.style.top = `${y}px`;
        Cell.setAttribute("selected", 0);
        Cell.setAttribute("hover", 0);
        Cell.setAttribute("grab", 0);
        Cell.setAttribute("moved", 0);
      }
    }
  }

  createImageLayer() {
    this.imageLayer = document.createElement("div");
    this.imageLayer.id = "image-layer";
    this.board.append(this.imageLayer);

    const boardRect = this.board.getBoundingClientRect();
    for (let i = 0; i < this.backCells.length; i++) {
      for (let j = 0; j < this.backCells[i].length; j++) {
        const piece = this.game.board.hex[i][j];
        if (piece == 0) continue;

        const Image = document.createElement("div");
        Image.classList.add("image");
        this.imageLayer.append(Image);
        this.images.push({
          html: Image,
          i: i,
          j: j,
        });

        const rect = this.backCells[i][j].getBoundingClientRect();
        const x = rect.x + rect.width / 2 - boardRect.x;
        const y = rect.y + rect.height / 2 - boardRect.y;
        Image.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        Image.setAttribute("piece", this.pieceNames(piece));
      }
    }
  }

  createInvisLayer() {
    this.invisLayer = document.createElement("div");
    this.invisLayer.id = "invis-layer";
    this.board.append(this.invisLayer);

    const boardRect = this.board.getBoundingClientRect();
    for (let i = 0; i < this.backCells.length; i++) {
      this.invisCells.push([]);
      for (let j = 0; j < this.backCells[i].length; j++) {
        const Cell = document.createElement("div");
        Cell.classList.add("cell");
        this.invisLayer.append(Cell);
        this.invisCells[i].push(Cell);

        const rect = this.backCells[i][j].getBoundingClientRect();
        const x = rect.x - boardRect.x;
        const y = rect.y - boardRect.y;
        Cell.style.left = `${x}px`;
        Cell.style.top = `${y}px`;

        Cell.addEventListener("mousedown", (e) => {
          e.preventDefault();
          this.mouseDown(i, j, e.clientX, e.clientY);
        });

        Cell.addEventListener("mouseenter", () =>
          this.updateHoverHighlight(i, j)
        );
        Cell.addEventListener("mouseenter", () => this.updateFloating(i, j));
        Cell.addEventListener("mouseleave", () =>
          this.removeHoverHighlight(i, j)
        );
      }
    }
  }

  setScale() {
    for (let i = 0; i < this.backCells.length; i++) {
      for (let j = 0; j < this.backCells[i].length; j++) {
        this.backCells[i][j].classList.add("scale");
        this.mainCells[i][j].classList.add("scale");
      }
    }
  }

  makeVisible() {
    this.setProperty("--visibility", "visible");
  }

  imageAt(i, j) {
    for (const image of this.images)
      if (image.i == i && image.j == j) return image;
  }

  removeImage(i, j) {
    for (let k = 0; k < this.images.length; k++) {
      if (this.images[k].i == i && this.images[k].j == j) {
        this.images[k].html.remove();
        this.images.splice(k, 1);
      }
    }
  }

  pieceNames(piece) {
    return [
      "bk",
      "bq",
      "br",
      "bb",
      "bn",
      "bp",
      "empty",
      "wp",
      "wn",
      "wb",
      "wr",
      "wq",
      "wk",
    ][piece + 6];
  }

  updateHoverHighlight(i, j) {
    this.mainCells[i][j].setAttribute("hover", 1);
    if (this.game.board.hex[i][j] != 0)
      this.invisCells[i][j].setAttribute("grab", 1);
  }

  removeHoverHighlight(i, j) {
    this.mainCells[i][j].setAttribute("hover", 0);
    this.invisCells[i][j].setAttribute("grab", 0);
  }

  updateFloating(i, j) {
    if (this.floating == null) return;
    this.floating.to = { i, j };
  }

  showMoves(moves) {
    for (const move of moves) {
      const hexJ = this.game.grid[move.to.i][move.to.j];
      this.backCells[move.to.i][hexJ].setAttribute("possible-move", 1);
      this.backCells[move.to.i][hexJ].setAttribute("capture", move.capture * 1);
    }
  }

  unshowMoves() {
    for (const row of this.backCells)
      for (const cell of row) cell.setAttribute("possible-move", 0);
  }

  clickHighlight(i, j) {
    this.removeClickHighlight();
    this.mainCells[i][j].setAttribute("selected", 1);
  }

  removeClickHighlight() {
    for (const row of this.mainCells)
      for (const cell of row) cell.setAttribute("selected", 0);
  }

  removeMoveHighlight() {
    for (const row of this.mainCells)
      for (const cell of row) cell.setAttribute("moved", 0);
  }

  removeAllHighlights() {
    for (const row of this.mainCells)
      for (const cell of row) cell.setAttribute("selected", 0);

    for (const row of this.backCells)
      for (const cell of row) cell.setAttribute("possible-move", 0);
  }

  setTransition() {
    this.setProperty("--transition", `${this.transition}ms`);
  }

  unsetTransition() {
    setTimeout(() => this.setProperty("--transition", "0ms"), this.transition);
  }

  removeFloatingClass() {
    for (const image of this.images) image.html.classList.remove("floating");
  }

  mouseDown(i, j, x, y) {
    if (this.backCells[i][j].getAttribute("possible-move") == "1") {
      this.floating = {
        from: { i: this.selected.i, j: this.selected.j },
        to: { i, j },
        html: null,
      };
      this.setTransition();
      return this.mouseUp();
    }

    const piece = this.game.board.hex[i][j];
    if (piece == 0 || Math.sign(piece) != this.game.toMove)
      return this.removeAllHighlights();

    this.selected = { i, j };

    this.unshowMoves();
    this.clickHighlight(i, j);

    const moves = this.game.getNextMovesFrom(i, this.game.hex[i][j]);
    if (moves.length == 0) return;

    this.showMoves(moves);

    this.floating = {
      html: this.imageAt(i, j).html,
      from: { i, j },
      to: { i, j },
    };

    const boardRect = this.board.getBoundingClientRect();
    x -= boardRect.x;
    y -= boardRect.y;

    this.removeFloatingClass();
    this.floating.html.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    this.floating.html.classList.add("floating");

    document.addEventListener("mousemove", (e) => this.mouseMove(e));
    document.addEventListener("mouseup", () => this.mouseUp());
  }

  mouseMove(e) {
    if (this.floating == null) return;
    const boardRect = this.board.getBoundingClientRect();
    const x = e.clientX - boardRect.x;
    const y = e.clientY - boardRect.y;
    this.floating.html.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  }

  mouseUp() {
    const f = this.floating;
    if (f === null) return;
    if (!this.game.legalMove(f.from, f.to)) return this.cancelMove();

    this.game.move(f.from, f.to);
    this.removeMoveHighlight();

    let isCapture = this.imageAt(f.to.i, f.to.j) !== undefined;
    if (isCapture) this.removeImage(f.to.i, f.to.j);

    this.placeImage(f.from, f.to);
    this.mainCells[f.from.i][f.from.j].setAttribute("moved", 1);
    this.mainCells[f.to.i][f.to.j].setAttribute("moved", 1);

    this.floating = null;
    this.selected = null;

    this.unshowMoves();
    this.removeClickHighlight();
    this.removeFloatingClass();
    this.unsetTransition();
  }

  placeImage(from, to) {
    const boardRect = this.board.getBoundingClientRect();
    const rect = this.backCells[to.i][to.j].getBoundingClientRect();
    const x = rect.x + rect.width / 2 - boardRect.x;
    const y = rect.y + rect.height / 2 - boardRect.y;
    const image = this.imageAt(from.i, from.j);
    image.html.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    image.i = to.i;
    image.j = to.j;
  }

  cancelMove() {
    this.placeImage(this.floating.from, this.floating.from);
    this.unsetTransition();
    this.floating = null;
  }
}
