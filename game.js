class PieceCoords {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class Piece {
  constructor(pos, coords, value, availableMoves = []) {
    this.pos = pos;
    this.coords = coords;
    this.value = value;
    this.availableMoves = availableMoves;
  }
}

class State {
  constructor(stateValues = [], dm = 0) {
    this.state = stateValues.map((val, idx) => new Piece(idx, this.pieceCoords[idx], val, this.PieceAvailableMoves[idx]));
    this.selected = false;
    this.dm = dm;
  }

  getPiece(idx) {
    return this.state[idx];
  }

  get pieceCoords() {
    return [
      new PieceCoords(1, 1),
      new PieceCoords(1, 2),
      new PieceCoords(1, 3),
      new PieceCoords(2, 1),
      new PieceCoords(2, 2),
      new PieceCoords(2, 3),
      new PieceCoords(3, 1),
      new PieceCoords(3, 2),
      new PieceCoords(3, 3)
    ];
  }

  get PieceAvailableMoves() {
    return [
      ["RIGHT", "DOWN"],
      ["LEFT", "RIGHT", "DOWN"],
      ["LEFT", "DOWN"],
      ["UP", "RIGHT", "DOWN"],
      ["UP", "RIGHT", "DOWN", "LEFT"],
      ["UP", "DOWN", "LEFT"],
      ["UP", "RIGHT"],
      ["LEFT", "UP", "RIGHT"],
      ["UP", "LEFT"]
    ];
  }

  calcularManhDist(goalState) {
    let dm = 0;

    goalState.state.forEach(gs => {
      let idx = this.state.findIndex(s => s.value === gs.value);
      if (this.state[idx].value !== -1) {
        let dmi = Math.abs(gs.coords.x - this.state[idx].coords.x) + Math.abs(gs.coords.y - this.state[idx].coords.y);
        dm += dmi;
      }
    });

    this.dm = dm;

    return dm;
  }

  get stateValues() {
    return this.state.map(st => st.value);
  }
}

class Game {
  constructor (initialState, goalState, emptyPiecePos = 8) {
    this.state = initialState;
    this.goalState = goalState;
    this.emptyPiece = this.state.getPiece(emptyPiecePos-1);
    this.exploredPaths = [];

    let stateHash = this.hashPath(this.state.stateValues);
    this.addPath(stateHash);
  }

  get Moves() {
    return {
      "UP": -3,
      "RIGHT": 1,
      "DOWN": 3,
      "LEFT": -1
    }
  }

  generarSiguientesEstados() {
    let nextStates = [];
    let manhDists = [];

    const emptyPieceAvailMoves = this.emptyPiece.availableMoves;
    const gs = this.goalState;

    let moveOffset;
    const emptyPiecePos = this.emptyPiece.pos;

    emptyPieceAvailMoves.forEach((_, moveIdx) => {
      let newState = new State(this.state.stateValues);
      
      moveOffset = this.Moves[emptyPieceAvailMoves[moveIdx]];
      
      newState.getPiece(emptyPiecePos).value = newState.getPiece(emptyPiecePos + moveOffset).value;
      newState.getPiece(emptyPiecePos + moveOffset).value = -1;

      const stateHash = this.hashPath(newState.stateValues);

      this.addPath(stateHash);
      nextStates.push(newState);
      manhDists.push({ idx: manhDists.length, value: newState.calcularManhDist(gs) });
    });

    const minDm = Math.min(...manhDists.map(dm => dm.value));

    const dmIdxs = manhDists.filter(dm => dm.value === minDm).map(dm => dm.idx);

    nextStates.forEach((st, idx) => {
      if (dmIdxs.includes(idx)) {
        st.selected = true;
      }
    });

    console.log(nextStates)

    return nextStates;
  }

  setEmptyPiece() {
    const idx = this.state.stateValues.findIndex(value => value === -1);
    return this.state.getPiece(idx);
  }

  async hashPath(stateValues) {
    const msgUint8 = new TextEncoder().encode(stateValues.toString());   // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);  // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));            // convert buffer to byte array
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  }

  async addPath(path) {
    const _path = await path;
    this.exploredPaths.push(_path);
  }
}

export {
  Game,
  State
}