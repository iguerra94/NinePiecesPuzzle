import { create_UUID } from './utils.js';
import { sha256 } from './crypto-utils.js';

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
  constructor(stateValues = []) {
    this.uuid = create_UUID();
    this.predecessor = "";
    this.state = stateValues.map((val, idx) => new Piece(idx, this.pieceCoords[idx], val, this.PieceAvailableMoves[idx]));
    this.selected = false;
    this.lastSelected = false;
    this.depthLevel = 0;
    this.dm = 0;
    this.f = 0;
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

  incrementarDepthLevel(depthLevel) {
    this.depthLevel = depthLevel +1;
  }

  setPredecessor(stateUUID) {
    this.predecessor = stateUUID;
  }

  calcularHeuristicFunction(method, goalState) {
    if (method === "firstBetter") {
      this.f = this.calcularManhDist(goalState);
    }
    if (method === "aAstherisk") {
      this.f = this.depthLevel + this.calcularManhDist(goalState);
    }
  }

  get stateValues() {
    return this.state.map(st => st.value);
  }
}

class Game {
  constructor (gameChosen, heuristicMethod, initialState, goalState) {
    this.gameChosen = gameChosen;
    this.heuristicMethod = heuristicMethod;
    this.state = initialState;
    this.goalState = goalState;
    this.emptyPiece = this.setEmptyPiece();
    this.openListStates = {};
    this.closedListStates = {};
    this.exploredPaths = [];
    window.game = this;

    let stateHash = this.hashPath(initialState.stateValues);
    this.addExploredPath(stateHash);
    this.initOpenListStates(initialState);
    this.initClosedListStates();
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
    return this.generarSiguientesEstadosByMethod(this.heuristicMethod);
  }

  generarSiguientesEstadosByMethod(heuristicMethod) {
    let nextStates = [];

    const emptyPieceAvailMoves = this.emptyPiece.availableMoves;
    const gs = this.goalState;

    let fValues = [];

    let moveOffset;
    const emptyPiecePos = this.emptyPiece.pos;

    emptyPieceAvailMoves.forEach((_, moveIdx) => {
      let newState = new State(this.state.stateValues);

      moveOffset = this.Moves[emptyPieceAvailMoves[moveIdx]];
      
      newState.getPiece(emptyPiecePos).value = newState.getPiece(emptyPiecePos + moveOffset).value;
      newState.getPiece(emptyPiecePos + moveOffset).value = -1;
      newState.incrementarDepthLevel(this.state.depthLevel);
      newState.calcularHeuristicFunction(heuristicMethod, gs);
      newState.setPredecessor(this.state.uuid);

      let stateHash = this.hashPath(newState.stateValues);

      if (!this.pathExists(stateHash)) {
        this.addExploredPath(stateHash);
        nextStates.push(newState);
        fValues.push({ idx: fValues.length, value: newState.f });
      }
    });

    const minFValue = Math.min(...fValues.map(f => f.value));

    const fValuesIdxs = fValues.filter(f => f.value === minFValue).map(f => f.idx);

    nextStates.forEach((st, idx) => {
      if (fValuesIdxs.includes(idx)) {
        st.selected = true;
        this.addStateToClosedList(st.depthLevel);
      }
    });

    this.addStatesToOpenList(nextStates[0].depthLevel, nextStates);

    return nextStates;
  }

  setEmptyPiece() {
    const idx = this.state.stateValues.findIndex(value => value === -1);
    return this.state.getPiece(idx);
  }

  hashPath(stateValues) {
    return sha256(stateValues);
  }

  addExploredPath(path) {
    this.exploredPaths.push(path);
  }

  pathExists(path) {
    return this.exploredPaths.includes(path);
  }

  initOpenListStates(initialState) {
    this.openListStates[`Step #1`] = [initialState];
  }

  initClosedListStates() {
    this.closedListStates[`Step #1`] = [];
  }

  addStatesToOpenList(step, states) {
    const filteredList = this.openListStates[`Step #${step-1}`].filter(state => !state.lastSelected);
    const newStatesUpdated = states.map((state) => {
      if (state.selected) {
        state.lastSelected = true;
      }
      return state;
    })
    this.openListStates[`Step #${step}`] = [...filteredList, ...newStatesUpdated];
  }

  addStateToClosedList(step) {
    const lastStateSelected = this.openListStates[`Step #${step-1}`].find(state => state.lastSelected);
    this.closedListStates[`Step #${step}`] = [...this.closedListStates[`Step #${step-1}`], lastStateSelected];
  }
}

export {
  Game,
  State
}