class Game {
  constructor() {
    this.initTables();
    this.initBoard();
    this.html = new RenderHTML(this);
    this.toMove = 1;
    this.enPassant = false;
    this.moves = [];
    this.nextMoves = this.getNextMoves(this.board.grid, this.toMove);
  }

  initTables() {
    this.initGrid();
    this.initHex();
    this.initPieceValues();
    this.initPieceMovements();
    this.initStartBoard();
  }

  initBoard() {
    this.board = {
      hex: this.startboard.hex.copy2d(),
      grid: this.startboard.grid.copy2d(),
    };
  }

  initGrid() {
    this.grid = [
      [-1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, 0, -1, 1, -1, -1, -1, -1],
      [-1, -1, -1, 0, -1, 1, -1, 2, -1, -1, -1],
      [-1, -1, 0, -1, 1, -1, 2, -1, 3, -1, -1],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 5],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 5],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 5],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 5],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 5],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 5],
      [-1, 0, -1, 1, -1, 2, -1, 3, -1, 4, -1],
      [-1, -1, 0, -1, 1, -1, 2, -1, 3, -1, -1],
      [-1, -1, -1, 0, -1, 1, -1, 2, -1, -1, -1],
      [-1, -1, -1, -1, 0, -1, 1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1],
    ];
  }

  initHex() {
    this.hex = [
      [5],
      [4, 6],
      [3, 5, 7],
      [2, 4, 6, 8],
      [1, 3, 5, 7, 9],
      [0, 2, 4, 6, 8, 10],
      [1, 3, 5, 7, 9],
      [0, 2, 4, 6, 8, 10],
      [1, 3, 5, 7, 9],
      [0, 2, 4, 6, 8, 10],
      [1, 3, 5, 7, 9],
      [0, 2, 4, 6, 8, 10],
      [1, 3, 5, 7, 9],
      [0, 2, 4, 6, 8, 10],
      [1, 3, 5, 7, 9],
      [0, 2, 4, 6, 8, 10],
      [1, 3, 5, 7, 9],
      [2, 4, 6, 8],
      [3, 5, 7],
      [4, 6],
      [5],
    ];
  }

  initPieceValues() {
    this.pieces = {
      o: 0,
      P: 1,
      N: 2,
      B: 3,
      R: 4,
      Q: 5,
      K: 6,
      p: -1,
      n: -2,
      b: -3,
      r: -4,
      q: -5,
      k: -6,
    };
  }

  initPieceMovements() {
    this.pieceMovements = {
      p: [
        { i: -2, j: 0 },
        { i: -4, j: 0 },
        { i: -1, j: -1 },
        { i: -1, j: 1 },
      ],
      n: [
        { i: 5, j: 1 },
        { i: 4, j: 2 },
        { i: 1, j: 3 },
      ],
      b: [
        { i: 0, j: -2 },
        { i: 0, j: 2 },
        { i: -3, j: -1 },
        { i: -3, j: 1 },
        { i: 3, j: -1 },
        { i: 3, j: 1 },
      ],
      r: [
        { i: -2, j: 0 },
        { i: 2, j: 0 },
        { i: -1, j: -1 },
        { i: -1, j: 1 },
        { i: 1, j: -1 },
        { i: 1, j: 1 },
      ],
    };
  }

  initStartBoard() {
    const o = this.pieces.o;
    const p = this.pieces.p;
    const P = this.pieces.P;
    const n = this.pieces.n;
    const N = this.pieces.N;
    const b = this.pieces.b;
    const B = this.pieces.B;
    const r = this.pieces.r;
    const R = this.pieces.R;
    const q = this.pieces.q;
    const Q = this.pieces.Q;
    const k = this.pieces.k;
    const K = this.pieces.K;

    this.startboard = {
      hex: [],
      grid: [],
    };

    this.startboard.hex = [
      [b],
      [q, k],
      [n, b, n],
      [r, o, o, r],
      [p, o, b, o, p],
      [o, p, o, o, p, o],
      [o, p, o, p, o],
      [o, o, p, p, o, o],
      [o, o, p, o, o],
      [o, o, o, o, o, o],
      [o, o, o, o, o],
      [o, o, o, o, o, o],
      [o, o, P, o, o],
      [o, o, P, P, o, o],
      [o, P, o, P, o],
      [o, P, o, o, P, o],
      [P, o, B, o, P],
      [R, o, o, R],
      [N, B, N],
      [Q, K],
      [B],
    ];

    this.startboard.grid = this.gridBoard(this.startboard.hex);
  }

  gridBoard(hexBoard) {
    let gridBoard = [];
    for (let i = 0; i < hexBoard.length; i++) {
      gridBoard.push(new Array(11).fill(0));
      for (let j = 0; j < hexBoard[i].length; j++)
        gridBoard[i][this.hex[i][j]] = hexBoard[i][j];
    }
    return gridBoard;
  }

  move(from, to) {
    if (from.i == to.i && from.j == to.j) return;

    const piece = this.board.hex[from.i][from.j];
    this.updateBoard(piece, from, to);
    this.updateMoves(from, to);
    this.enPassant = this.checkEnPassant(piece, from, to);
    this.check = this.checkCheck(this.board.grid, -this.toMove);
    this.nextMoves = this.getNextMoves(this.board.grid, this.toMove);

    if (this.check) this.showCheck();
    if (this.nextMoves.length == 0 && this.check) this.checkMate();
    if (this.nextMoves.length == 0 && !this.check) this.staleMate();
  }

  checkPromotion(piece, to) {
    if (Math.abs(piece) != 1) return false;
    if (this.isLastRank(to.i, this.hex[to.i][to.j], piece))
      return this.promotion(piece, to);
  }

  promotion(piece) {
    return piece * this.pieces.Q;
  }

  checkCheck(board, toMove, enPassant = this.enPassant) {
    const king = this.getPieceCoords(board, this.pieces.K * -toMove);
    const nextMoves = this.getNextMoves(board, toMove, false, enPassant);
    for (const nextMove of nextMoves)
      if (nextMove.to.i == king.i && nextMove.to.j == king.j) return true;
    return false;
  }

  showCheck() {
    console.log("check!");
    // TODO: highlight king
  }

  checkMate() {
    console.log("mate");
  }

  staleMate() {
    console.log("stale");
  }

  updateBoard(piece, from, to) {
    this.board.hex[from.i][from.j] = this.pieces.o;
    const promotion = this.checkPromotion(piece, to);
    this.board.hex[to.i][to.j] = promotion ? promotion : piece;
    if (promotion)
      this.html
        .imageAt(from.i, from.j)
        .html.setAttribute("piece", this.html.pieceNames(promotion));

    this.handleEnPassant(piece, to);

    this.board.grid = this.gridBoard(this.board.hex);
  }

  updateMoves(from, to) {
    this.moves.push({ from, to });
    this.toMove *= -1;
  }

  handleEnPassant(piece, to) {
    if (
      (piece == this.pieces.p || piece == this.pieces.P) &&
      this.enPassant.i == to.i &&
      this.enPassant.j == this.hex[to.i][to.j]
    ) {
      this.board.hex[to.i + 2 * piece][to.j] = 0;
      this.html.removeImage(to.i + 2 * piece, to.j);
    }
  }

  checkEnPassant(piece, from, to) {
    return Math.abs(piece) == this.pieces.P && Math.abs(to.i - from.i) == 4
      ? { i: to.i + piece * 2, j: this.hex[to.i + piece * 2][to.j] }
      : false;
  }

  legalMove(from, to) {
    for (const move of this.nextMoves)
      if (
        move.from.i == from.i &&
        move.from.j == this.hex[from.i][from.j] &&
        move.to.i == to.i &&
        move.to.j == this.hex[to.i][to.j]
      )
        return true;
    return false;
  }

  filterIllegalMoves(board, piece, moves) {
    const legal = [];
    for (const move of moves)
      if (!this.suicidalMove(board.copy2d(), piece, move)) legal.push(move);
    return legal;
  }

  suicidalMove(board, piece, move) {
    return this.checkCheck(
      this.boardAfterMove(board, piece, move),
      -Math.sign(piece),
      this.checkEnPassant(piece, move.from, move.to)
    );
  }

  boardAfterMove(board, piece, move) {
    board[move.from.i][move.from.j] = this.pieces.o;
    board[move.to.i][move.to.j] = piece;
    if (move.enPassant) board[move.to.i + piece * 2][move.to.j] = this.pieces.o;
    return board;
  }

  getPieceCoords(board, piece) {
    for (let i = 0; i < board.length; i++)
      for (let j = 0; j < board[i].length; j++)
        if (board[i][j] == piece) return { i, j };
  }

  getNextMoves(board, toMove, checkCheck = true, enPassant = this.enPassant) {
    let nextMoves = [];
    for (let i = 0; i < board.length; i++)
      for (let j = 0; j < board[i].length; j++)
        if (toMove * board[i][j] > 0)
          nextMoves = nextMoves.concat(
            this.getMovesFrom(board, i, j, checkCheck, enPassant)
          );
    return nextMoves;
  }

  getNextMovesFrom(i, j) {
    const moves = [];
    for (const move of this.nextMoves)
      if (move.from.i == i && move.from.j == j) moves.push(move);
    return moves;
  }

  getMovesFrom(board, i, j, checkCheck, enPassant) {
    const piece = board[i][j];
    if (piece == 0) return [];

    let moves = [];

    switch (Math.abs(piece)) {
      case this.pieces.P:
        moves = this.getPawnMoves(board, i, j, Math.sign(piece), enPassant);
        break;
      case this.pieces.N:
        moves = this.getKnightMoves(board, i, j, Math.sign(piece));
        break;
      case this.pieces.B:
        moves = this.getBishopMoves(board, i, j, Math.sign(piece));
        break;
      case this.pieces.R:
        moves = this.getRookMoves(board, i, j, Math.sign(piece));
        break;
      case this.pieces.Q:
        moves = this.getQueenMoves(board, i, j, Math.sign(piece));
        break;
      case this.pieces.K:
        moves = this.getKingMoves(board, i, j, Math.sign(piece));
        break;
    }

    if (checkCheck) moves = this.filterIllegalMoves(board, piece, moves);

    return moves;
  }

  isLastRank(i, j, clr) {
    return (
      i - 2 * clr < 0 ||
      i - 2 * clr >= this.grid.length ||
      this.grid[i - 2 * clr][j] == -1
    );
  }

  getPawnMoves(board, i, j, toMove, enPassant) {
    const moves = [];
    const m = this.pieceMovements.p;

    // forward
    if (board[i + toMove * m[0].i][j + m[0].j] == 0) {
      moves.push({
        from: { i, j },
        to: { i: i + toMove * m[0].i, j: j + m[0].j },
        capture: false,
      });

      if (
        this.startboard.grid[i][j] == toMove &&
        board[i + toMove * m[1].i][j + m[1].j] == 0
      )
        moves.push({
          from: { i, j },
          to: { i: i + toMove * m[1].i, j: j + m[1].j },
          capture: false,
        });
    }

    // takes
    for (let k = 2; k <= 3; k++) {
      if (Math.sign(board[i + toMove * m[k].i][j + m[k].j]) == -toMove)
        moves.push({
          from: { i, j },
          to: { i: i + toMove * m[k].i, j: j + m[k].j },
          capture: true,
        });

      if (
        enPassant &&
        enPassant.i == i + toMove * m[k].i &&
        enPassant.j == j + m[k].j
      )
        moves.push({
          from: { i, j },
          to: { i: i + toMove * m[k].i, j: j + m[k].j },
          capture: true,
          enPassant: true,
        });
    }

    return moves;
  }

  getKnightMoves(board, i, j, toMove) {
    const moves = [];
    const m = this.pieceMovements.n;

    for (const move of m) {
      for (let iMult = -1; iMult <= 1; iMult += 2) {
        for (let jMult = -1; jMult <= 1; jMult += 2) {
          const coords = { i: i + move.i * iMult, j: j + move.j * jMult };
          if (this.validCoords(coords.i, coords.j)) {
            const piece = board[coords.i][coords.j];
            if (Math.sign(piece) != toMove)
              moves.push({
                from: { i, j },
                to: { i: coords.i, j: coords.j },
                capture: piece != 0,
              });
          }
        }
      }
    }

    return moves;
  }

  getBishopMoves(board, i, j, toMove) {
    return this.getSlideMoves(board, i, j, toMove, this.pieceMovements.b);
  }

  getRookMoves(board, i, j, toMove) {
    return this.getSlideMoves(board, i, j, toMove, this.pieceMovements.r);
  }

  getQueenMoves(board, i, j, toMove) {
    return this.getSlideMoves(
      board,
      i,
      j,
      toMove,
      this.pieceMovements.b.concat(this.pieceMovements.r)
    );
  }

  getKingMoves(board, i, j, toMove) {
    return this.getSlideMoves(
      board,
      i,
      j,
      toMove,
      this.pieceMovements.b.concat(this.pieceMovements.r),
      true
    );
  }

  getSlideMoves(board, i, j, toMove, directions, limit = false) {
    const moves = [];

    for (const move of directions) {
      let coords = { i, j };
      let hitOppPiece, hitOwnPiece;

      do {
        coords.i += move.i;
        coords.j += move.j;

        if (!this.validCoords(coords.i, coords.j)) break;

        hitOwnPiece = Math.sign(board[coords.i][coords.j]) == toMove;
        if (hitOppPiece || hitOwnPiece) break;
        hitOppPiece = Math.sign(board[coords.i][coords.j]) == -toMove;

        moves.push({
          from: { i, j },
          to: { i: coords.i, j: coords.j },
          capture: hitOppPiece,
        });
      } while (!limit);
    }

    return moves;
  }

  validCoords(i, j) {
    return i >= 0 && i < 21 && j >= 0 && j < 11 && this.grid[i][j] != -1;
  }
}
