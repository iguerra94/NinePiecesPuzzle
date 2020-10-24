import { Game, State } from './game.js';

const initialState = new State([2, 8, 3, 1, 6, 4, 7, -1, 5])
const goalState = new State([1, 2, 3, 8, -1, 4, 7, 6, 5])

initialState.dm = initialState.calcularManhDist(goalState);
goalState.dm = goalState.calcularManhDist(goalState);

const $btnNextAction = window.btnNextAction;

let game, gameFinished;

reiniciarJuego();
limpiarSiguientesEstados();
dibujarEstadoInicial();


$btnNextAction.addEventListener('click', () => {
  if (!gameFinished) {
    generarSiguientesEstados();
    return;
  }

  establecerTextoDelBoton("Siguiente acción");
  reiniciarJuego();

  limpiarSiguientesEstados();
  dibujarEstadoInicial();
});

function generarSiguientesEstados() {
  const nextStates = game.generarSiguientesEstados();

  dibujarPosiblesSiguientesEstados(nextStates);
  determinarEstadoDelJuego();
}

function dibujarPosiblesSiguientesEstados(nextStates) {
  let nextState;

  let nsHTML = ``;
  nextStates.forEach((ns) => {
    let nsValuesHTML = ``;
    ns.stateValues.forEach((value) => nsValuesHTML += (value !== -1) ? `<div class="pieza">${value}</div>` : `<div class="pieza"></div>`);

    if (ns.selected) {
      nextState = ns;
      nsHTML += `
        <div class="puzzle selected">
          ${nsValuesHTML}
          <p class="dm-top">DM = ${ns.dm}</p>
          <div class="selected__text">
            seleccionado
          </div>
        </div>
      `;
    } else {
      nsHTML += `
        <div class="puzzle">
          ${nsValuesHTML}
          <p class="dm-top">DM = ${ns.dm}</p>
        </div>
      `;
    }
  });

  window.possibleNextStates.innerHTML = `
      <div class="possible-next-states__text">
        Siguientes estados posibles
      </div>

      ${nsHTML}
    `;

  dibujarSiguienteEstado(nextState);
  establecerEstadoActual(nextState);
}

function dibujarSiguienteEstado(nextState) {
  let nsValuesHTML = ``;
  nextState.stateValues.forEach((value) => nsValuesHTML += (value !== -1) ? `<div class="pieza">${value}</div>` : `<div class="pieza"></div>`);

  window.curstatePuzzle.innerHTML = `
    ${nsValuesHTML}

    <p class="dm-right">DM = ${nextState.dm}</p>
  `;
}

function establecerEstadoActual(nextState) {
  game.state = nextState;
  game.emptyPiece = game.setEmptyPiece();
}

function determinarEstadoDelJuego() {
  const curstateDm = game.state.calcularManhDist(goalState);
  if (curstateDm === 0) {
    finalizarJuego();
    establecerTextoDelBoton("Reiniciar juego");

    window.setTimeout(() => {
      alert("¡¡Juego Terminado exitosamente!!")
    }, 100);
  }
}

function limpiarSiguientesEstados() {
  window.possibleNextStates.innerHTML = `
    <div class="possible-next-states__text">
      Siguientes estados posibles
    </div>
  `;
}

function finalizarJuego() {
  gameFinished = true;
}

function reiniciarJuego() {
  gameFinished = false;

  game = new Game(initialState, goalState);
}

function dibujarEstadoInicial() {
  window.curstatePuzzle.innerHTML = `
    <div class="pieza">2</div>
    <div class="pieza">8</div>
    <div class="pieza">3</div>
    <div class="pieza">1</div>
    <div class="pieza">6</div>
    <div class="pieza">4</div>
    <div class="pieza">7</div>
    <div class="pieza"></div>
    <div class="pieza">5</div>

    <p class="dm-right">DM = 5</p>
  `;
}

function establecerTextoDelBoton(texto) {
  $btnNextAction.textContent = texto;
}