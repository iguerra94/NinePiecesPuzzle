import { Game, State } from './game.js';

const simpleGameInitialState = new State([2, 8, 3, 1, 6, 4, 7, -1, 5]);
const simpleGameGoalState = new State([1, 2, 3, 8, -1, 4, 7, 6, 5]);

simpleGameInitialState.dm = simpleGameInitialState.calcularManhDist(simpleGameGoalState);
simpleGameInitialState.depthLevel = 1;
simpleGameInitialState.lastSelected = true;

simpleGameGoalState.dm = simpleGameGoalState.calcularManhDist(simpleGameGoalState);

let customGameInitialState;
let customGameGoalState;

const $btnNextAction = window.btnNextAction;

const $btnChooseSimpleResolutionProblem = window["btn-choose-simple-resolution-problem"];
const $btnChooseCustomProblem = window["btn-choose-custom-problem"];
const $btnChooseProblem = window["btn-choose-problem"];

const $btnChooseFirstBetterResMethod = window["btn-choose-first-better-res-method"];
const $btnChooseAAstheriskResMethod = window["btn-choose-a-astherisk-res-method"];
const $btnBackToChooseProblem = window["btn-back-to-choose-problem"];
const $btnChooseResolutionMethod = window["btn-choose-resolution-method"];

const $btnCustomProblemSetInitialState = window["btn-custom-problem-set-initial-state"];
const $btnCustomProblemSetGoalState = window["btn-custom-problem-set-goal-state"];
const $btnBackToChooseResolutionMethod = window["btn-back-to-choose-resolution-method"];
const $btnStartGameCustomProblem = window["btn-start-game-custom-problem"];

const $btnShowListModal = window["btn-show__list-modal"];
const $btnCloseListModal = window["btn-close__list-modal"];

$btnChooseSimpleResolutionProblem.addEventListener('click', () => {
  localStorage.setItem('problemChosen', "simple");
  $btnChooseSimpleResolutionProblem.style.backgroundColor = "#ccc";
  $btnChooseCustomProblem.style.backgroundColor = "#efefef";
});

$btnChooseCustomProblem.addEventListener('click', () => {
  localStorage.setItem('problemChosen', "custom");
  $btnChooseCustomProblem.style.backgroundColor = "#ccc";
  $btnChooseSimpleResolutionProblem.style.backgroundColor = "#efefef";
});

$btnChooseProblem.addEventListener('click', () => {
  if (!localStorage.getItem('problemChosen')) {
    alert("Se debe elegir un problema antes de continuar");
    return;
  } 
  window["game-setup__first-step"].style.display = "none";
  window["game-setup__second-step"].style.display = "flex";

  if (localStorage.getItem('problemChosen') === "simple") {
    $btnChooseResolutionMethod.textContent = "Iniciar juego"
  }

  if (localStorage.getItem('problemChosen') === "custom") {
    $btnChooseResolutionMethod.textContent = "Siguiente"
  }
});

$btnChooseFirstBetterResMethod.addEventListener('click', () => {
  localStorage.setItem('resMethod', "firstBetter");
  $btnChooseFirstBetterResMethod.style.backgroundColor = "#ccc";
  $btnChooseAAstheriskResMethod.style.backgroundColor = "#efefef";
});

$btnChooseAAstheriskResMethod.addEventListener('click', () => {
  localStorage.setItem('resMethod', "aAstherisk");
  $btnChooseAAstheriskResMethod.style.backgroundColor = "#ccc";
  $btnChooseFirstBetterResMethod.style.backgroundColor = "#efefef";
});

$btnBackToChooseProblem.addEventListener('click', () => {
  window["game-setup__second-step"].style.display = "none";
  window["game-setup__first-step"].style.display = "flex";
  localStorage.removeItem('resMethod');
  $btnChooseAAstheriskResMethod.style.backgroundColor = "#efefef"
  $btnChooseFirstBetterResMethod.style.backgroundColor = "#efefef";
});

$btnChooseResolutionMethod.addEventListener('click', () => {
  if (!localStorage.getItem('resMethod')) {
    alert("Se debe elegir un método de resolución antes de continuar");
    return;
  }
  window["game-setup__second-step"].style.display = "none";

  if (localStorage.getItem('problemChosen') === "custom") {
    window["game-setup__third-step"].style.display = "flex";
  }

  if (localStorage.getItem('problemChosen') === "simple") {
    if (localStorage.getItem('resMethod') === "firstBetter") {
      simpleGameInitialState.f = simpleGameInitialState.dm;
    }
    if (localStorage.getItem('resMethod') === "aAstherisk") {
      simpleGameInitialState.f = simpleGameInitialState.depthLevel + simpleGameInitialState.dm;
    }

    game = new Game(
      localStorage.getItem('problemChosen'),
      localStorage.getItem('resMethod'),
      simpleGameInitialState,
      simpleGameGoalState
    );
      
    localStorage.setItem("gameStarted", true);
    localStorage.setItem("gameFinished", false);

    window["game-setup__first-step"].style.display = "none";
    window["game-setup__second-step"].style.display = "none";
    window["game-setup__third-step"].style.display = "none";
    window["game-setup"].style.display = "none";
    window["game-container"].style.display = "flex";

    dibujarEstadoInicial(simpleGameInitialState);
    establecerValorInicialDelInputUltimoEnIngresarAListaAbierta();
    establecerValorInicialDelInputUltimoEnIngresarAListaCerrada();
  }
});

$btnCustomProblemSetInitialState.addEventListener('click', () => {
  setCustomProblemInitialState(window["custom-problem-initial-state"].value);
});

$btnCustomProblemSetGoalState.addEventListener('click', () => {
  setCustomProblemGoalState(window["custom-problem-goal-state"].value);
});

$btnBackToChooseResolutionMethod.addEventListener('click', () => {
  window["game-setup__third-step"].style.display = "none";
  window["game-setup__second-step"].style.display = "flex";
});

$btnStartGameCustomProblem.addEventListener('click', () => {
  const initialState = window["custom-problem-initial-state"].value;
  const goalState = window["custom-problem-goal-state"].value;

  const initialStateIsSet = localStorage.getItem('customProblemIS') && localStorage.getItem('customProblemIS').length > 0;
  const goalStateIsSet = localStorage.getItem('customProblemGS') && localStorage.getItem('customProblemGS').length > 0;

  if (!initialStateIsSet || !goalStateIsSet) {
    alert("El estado inicial o el estado objetivo deben ser establecidos antes de iniciar el juego.");
    return;
  }

  const estadosIguales = verificarIgualdadEntreEstados(
    initialState.split(",").map(value => Number(value)),
    goalState.split(",").map(value => Number(value)),
  );

  if (estadosIguales) {
    alert("Los estados iniciales y objetivos deben ser distintos");
    return;
  }

  customGameInitialState = new State(
    initialState.split(",").map(value => Number(value))
  );
  customGameGoalState = new State(
    goalState.split(",").map(value => Number(value))
  );

  customGameInitialState.dm = customGameInitialState.calcularManhDist(customGameGoalState);
  customGameInitialState.depthLevel = 1;
  customGameInitialState.lastSelected = true;
  
  customGameGoalState.dm = customGameGoalState.calcularManhDist(customGameGoalState);

  if (localStorage.getItem('resMethod') === "firstBetter") {
    customGameInitialState.f = customGameInitialState.dm;
  }
  if (localStorage.getItem('resMethod') === "aAstherisk") {
    customGameInitialState.f = customGameInitialState.depthLevel + customGameInitialState.dm;
  }

  game = new Game(
    localStorage.getItem('problemChosen'),
    localStorage.getItem('resMethod'),
    customGameInitialState,
    customGameGoalState
  );

  localStorage.setItem("gameStarted", true);
  localStorage.setItem("gameFinished", false);

  window["game-setup__first-step"].style.display = "none";
  window["game-setup__second-step"].style.display = "none";
  window["game-setup__third-step"].style.display = "none";
  window["game-setup"].style.display = "none";
  window["game-container"].style.display = "flex";

  localStorage.removeItem('customProblemIS');
  localStorage.removeItem('customProblemGS');

  dibujarEstadoInicial(customGameInitialState);
  establecerValorInicialDelInputUltimoEnIngresarAListaAbierta();
  establecerValorInicialDelInputUltimoEnIngresarAListaCerrada();
});

$btnShowListModal.addEventListener('click', () => {
  let listModalContentItemsElementHTML = "";
  const listModalContentItemsHeaderElementHTML = `
    <div class="list-modal__content-item-row list-header">
      <div class="list-modal__content-item-column column-header column-fixed-size">Paso #</div>
      <div class="list-modal__content-item-column column-header column-flex-1">Lista abierta</div>
      <div class="list-modal__content-item-column column-header column-flex-1">Lista cerrada</div>
    </div>
  `;

  let listModalContentItemsContentElementHTML = "";

  const listItemsKeys = Object.keys(game.openListStates);
  const openListItemsValues = Object.values(game.openListStates);
  const closedListItemsValues = Object.values(game.closedListStates);

  for (let i = 0; i < listItemsKeys.length; i++) {
    const listToTraverseByMaxLength = (openListItemsValues[i].length > closedListItemsValues[i].length) ? "open": "closed";

    if (listToTraverseByMaxLength === 'open') {
      openListItemsValues[i].forEach((item, idx) => {
        if (i % 2 === 0) {
          if (idx === openListItemsValues[i].length -1) {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="background-color: #ddd; border-bottom: 1px solid #333;">`;
          } else {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="background-color: #ddd;">`;
          }
        } else {
          if (idx === openListItemsValues[i].length -1) {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="border-bottom: 1px solid #333;">`;
          } else {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="">`;
          }
        }
        if (idx === 0) {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-fixed-size">${listItemsKeys[i].split('Step #')[1]}</div>`;
        } else {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-fixed-size"></div>`;
        }

        if (openListItemsValues[i].length > 0) {
          if (idx < openListItemsValues[i].length -1) {
            listModalContentItemsContentElementHTML += `
              <div class="list-modal__content-item-column column-flex-1" style="border-bottom: 1px solid #333;">
                <span style="font-size: .8rem;">uuid: ${item.uuid}</span>
                <span style="font-size: .8rem;">predec: ${(item.predecessor) ? item.predecessor : "-"}</span>
                <span style="font-size: .8rem;">f: ${item.f}</span> <br>
                ${(item.dm === 0) ? 
                    `<span style='color: #f33;'>[${item.stateValues}] => OBJETIVO` :
                    `<span>[${item.stateValues}]`
                }
              </div>
            `;
          } else {
            listModalContentItemsContentElementHTML += `
              <div class="list-modal__content-item-column column-flex-1">
                <span style="font-size: .8rem;">uuid: ${item.uuid}</span>
                <span style="font-size: .8rem;">predec: ${(item.predecessor) ? item.predecessor : "-"}</span>
                <span style="font-size: .8rem;">f: ${item.f}</span> <br>
              ${(item.dm === 0) ? 
                  `<span style='color: #f33;'>[${item.stateValues}] => OBJETIVO` :
                  `<span>[${item.stateValues}]`
                }
              </div>
            `;
          }
        } else {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1">-</div>`;
        }
  
        if (closedListItemsValues[i].length > 0) {
          if (idx < openListItemsValues[i].length -1) {
            if (closedListItemsValues[i][idx]) {
              listModalContentItemsContentElementHTML += `
                <div class="list-modal__content-item-column column-flex-1" style="border-bottom: 1px solid #333;">
                  <span style="font-size: .8rem;">uuid: ${closedListItemsValues[i][idx].uuid}</span>
                  <span style="font-size: .8rem;">predec: ${(closedListItemsValues[i][idx].predecessor) ? closedListItemsValues[i][idx].predecessor : "-"}</span>
                  <span style="font-size: .8rem;">f: ${closedListItemsValues[i][idx].f}</span> <br>
                  [${closedListItemsValues[i][idx].stateValues}]
                </div>
              `;  
            } else {
              listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1" style="border-bottom: 1px solid #333;"></div>`;
            }
          } else {
            if (closedListItemsValues[i][idx]) {
              listModalContentItemsContentElementHTML += `
                <div class="list-modal__content-item-column column-flex-1">
                  <span style="font-size: .8rem;">uuid: ${closedListItemsValues[i][idx].uuid}</span>
                  <span style="font-size: .8rem;">predec: ${(closedListItemsValues[i][idx].predecessor) ? closedListItemsValues[i][idx].predecessor : "-"}</span>
                  <span style="font-size: .8rem;">f: ${closedListItemsValues[i][idx].f}</span> <br>
                  [${closedListItemsValues[i][idx].stateValues}]
                </div>
              `;  
            } else {
              listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1"></div>`;
            }
          }
        } else {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1">-</div>`;
        }

        listModalContentItemsContentElementHTML += `</div>`;
      })
    }

    if (listToTraverseByMaxLength === 'closed') {
      closedListItemsValues[i].forEach((item, idx) => {
        if (i % 2 === 0) {
          if (idx === closedListItemsValues[i].length -1) {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="background-color: #ddd; border-bottom: 1px solid #333;">`;
          } else {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="background-color: #ddd;">`;
          }
        } else {
          if (idx === closedListItemsValues[i].length -1) {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="border-bottom: 1px solid #333;">`;
          } else {
            listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-row" style="">`;
          }
        }
        if (idx === 0) {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-fixed-size">${listItemsKeys[i].split('Step #')[1]}</div>`;
        } else {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-fixed-size"></div>`;
        }

        if (openListItemsValues[i].length > 0) {
          if (idx < closedListItemsValues[i].length -1) {
            if (openListItemsValues[i][idx]) {
              listModalContentItemsContentElementHTML += `
                <div class="list-modal__content-item-column column-flex-1" style="border-bottom: 1px solid #333;">
                  <span style="font-size: .8rem;">uuid: ${openListItemsValues[i][idx].uuid}</span>
                  <span style="font-size: .8rem;">predec: ${(openListItemsValues[i][idx].predecessor) ? openListItemsValues[i][idx].predecessor : "-"}</span>
                  <span style="font-size: .8rem;">f: ${openListItemsValues[i][idx].f}</span> <br>
                  ${(openListItemsValues[i][idx].dm === 0) ?
                    `<span style='color: #f33;'>[${openListItemsValues[i][idx].stateValues}] => OBJETIVO` :
                    `<span>[${openListItemsValues[i][idx].stateValues}]`
                  }
                </div>
              `;  
            } else {
              listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1" style="border-bottom: 1px solid #333;"></div>`;
            }
          } else {
            if (openListItemsValues[i][idx]) {
              listModalContentItemsContentElementHTML += `
                <div class="list-modal__content-item-column column-flex-1">
                  <span style="font-size: .8rem;">uuid: ${openListItemsValues[i][idx].uuid}</span>
                  <span style="font-size: .8rem;">predec: ${(openListItemsValues[i][idx].predecessor) ? openListItemsValues[i][idx].predecessor : "-"}</span>
                  <span style="font-size: .8rem;">f: ${openListItemsValues[i][idx].f}</span> <br>
                  ${(openListItemsValues[i][idx].dm === 0) ?
                    `<span style='color: #f33;'>[${openListItemsValues[i][idx].stateValues}] => OBJETIVO` :
                    `<span>[${openListItemsValues[i][idx].stateValues}]`
                  }
                </div>
              `;  
            } else {
              listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1"></div>`;
            }
          }
        } else {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1">-</div>`;
        }
  
        if (closedListItemsValues[i].length > 0) {
          if (idx < closedListItemsValues[i].length -1) {
            listModalContentItemsContentElementHTML += `
              <div class="list-modal__content-item-column column-flex-1" style="border-bottom: 1px solid #333;">
              <span style="font-size: .8rem;">uuid: ${item.uuid}</span>
              <span style="font-size: .8rem;">predec: ${(item.predecessor) ? item.predecessor : "-"}</span>
              <span style="font-size: .8rem;">f: ${item.f}</span> <br>
              [${item.stateValues}]
              </div>
            `;
          } else {
            listModalContentItemsContentElementHTML += `
              <div class="list-modal__content-item-column column-flex-1">
                <span style="font-size: .8rem;">uuid: ${item.uuid}</span>
                <span style="font-size: .8rem;">predec: ${(item.predecessor) ? item.predecessor : "-"}</span>
                <span style="font-size: .8rem;">f: ${item.f}</span> <br>
                [${item.stateValues}]
              </div>
            `;
          }
        } else {
          listModalContentItemsContentElementHTML += `<div class="list-modal__content-item-column column-flex-1">-</div>`;
        }

        listModalContentItemsContentElementHTML += `</div>`;
      })
    }
  }

  listModalContentItemsElementHTML = `
    ${listModalContentItemsHeaderElementHTML}
    ${listModalContentItemsContentElementHTML}
  `;

  window["list-modal__content-items"].innerHTML = listModalContentItemsElementHTML;
  window["list-modal__wrapper"].style.display = "flex";
});

$btnCloseListModal.addEventListener('click', () => {
  window["list-modal__wrapper"].style.display = "none";
  window["list-modal__content-items"].innerHTML = "";
});

function verificarIgualdadEntreEstados(initialState, goalState) {
  return initialState.every((value, index) => value === goalState[index]);
}

let game;

$btnNextAction.addEventListener('click', () => {
  if (JSON.parse(localStorage.getItem("gameStarted")) && !JSON.parse(localStorage.getItem("gameFinished"))) {
    generarSiguientesEstados();
    return;
  }

  establecerTextoDelBoton("Siguiente acción");
  reiniciarJuego();

  limpiarSiguientesEstados();

  localStorage.removeItem('problemChosen');
  localStorage.removeItem('resMethod');

  establecerValorInicialDelInputUltimoEnIngresarAListaAbierta();
  establecerValorInicialDelInputUltimoEnIngresarAListaCerrada();

  window["game-setup__first-step"].style.display = "flex";

  $btnChooseSimpleResolutionProblem.style.backgroundColor = "#efefef";
  $btnChooseCustomProblem.style.backgroundColor = "#efefef";
  $btnChooseFirstBetterResMethod.style.backgroundColor = "#efefef";
  $btnChooseAAstheriskResMethod.style.backgroundColor = "#efefef";

  window["custom-problem-initial-state"].value = "";
  let puzzleISHtml = '';
  [1,2,3,4,5,6,7,8,9].forEach((_) => puzzleISHtml += `<div class="pieza-small"></div>`)
  window.customProblemInitialStatePuzzle.innerHTML = puzzleISHtml;

  window["custom-problem-goal-state"].value = "";
  let puzzleGSHtml = '';
  [1,2,3,4,5,6,7,8,9].forEach((_) => puzzleGSHtml += `<div class="pieza-small"></div>`)
  window.customProblemGoalStatePuzzle.innerHTML = puzzleGSHtml;

  window["game-setup"].style.display = "flex";
  window["game-container"].style.display = "none";
});

function generarSiguientesEstados() {
  const nextStates = game.generarSiguientesEstados();

  dibujarPosiblesSiguientesEstados(nextStates);

  establecerValorDelInputUltimoEnIngresarAListaAbierta();
  establecerValorDelInputUltimoEnIngresarAListaCerrada();

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
          <p class="hf-top">f = ${ns.f}</p>
          <div class="selected__text">
            seleccionado
          </div>
        </div>
      `;
    } else {
      nsHTML += `
        <div class="puzzle">
          ${nsValuesHTML}
          <p class="hf-top">f = ${ns.f}</p>
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

  const nextStateDm = nextState.dm;

  if (nextStateDm > 0) {
    window.curstatePuzzle.innerHTML = `
      ${nsValuesHTML}

      <p class="hf-right">f = ${nextState.f}</p>
    `;
  } else {
    window.curstatePuzzle.innerHTML = `
      <div class="game-finished"></div>
      <span class="game-finished__text">Resultado Final</span>

      ${nsValuesHTML}

      <p class="hf-right">f = ${nextState.f}</p>
    `;
  }
}

function establecerEstadoActual(nextState) {
  game.state = nextState;
  game.emptyPiece = game.setEmptyPiece();
}

function determinarEstadoDelJuego() {
  let curstateDm;
  if (localStorage.getItem('problemChosen') === "simple") {
    curstateDm = game.state.calcularManhDist(simpleGameGoalState);
  }
  if (localStorage.getItem('problemChosen') === "custom") {
    curstateDm = game.state.calcularManhDist(customGameGoalState);
  }

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
  localStorage.setItem("gameStarted", true);
  localStorage.setItem("gameFinished", true);
}

function reiniciarJuego() {
  localStorage.removeItem("gameStarted");
  localStorage.removeItem("gameFinished");

  // if (localStorage.getItem('problemChosen') === "simple") {
  //   game = new Game(
  //     localStorage.getItem('problemChosen'),
  //     localStorage.getItem('resMethod'),
  //     simpleGameInitialState,
  //     simpleGameGoalState
  //   );
  // }
  // if (localStorage.getItem('problemChosen') === "custom") {
  //   game = new Game(
  //     localStorage.getItem('problemChosen'),
  //     localStorage.getItem('resMethod'),
  //     customGameInitialState,
  //     customGameGoalState
  //   );
  // }
}

function dibujarEstadoInicial(state) {
  let puzzleHtml = '';
  state.stateValues.forEach((value) => puzzleHtml += `<div class="pieza">${(value !== -1) ? value: ""}</div>`);
  puzzleHtml += `<p class="hf-right">f = ${state.f}</p>`;
  window.curstatePuzzle.innerHTML = puzzleHtml;
}

function establecerValorInicialDelInputUltimoEnIngresarAListaAbierta() {
  window["open-list__last-state-entered"].value = `[${game.openListStates["Step #1"][0].stateValues}]`;
}

function establecerValorDelInputUltimoEnIngresarAListaAbierta() {
  const openListStatesLength = Object.keys(game.openListStates).length;
  const lastElementInOpenListStatesLength = Object.values(game.openListStates)[openListStatesLength-1].length;
  const lastStateEnteredInOpenListStates = Object.values(game.openListStates)[openListStatesLength-1][lastElementInOpenListStatesLength-1]
  window["open-list__last-state-entered"].value = `[${lastStateEnteredInOpenListStates.stateValues}]`;
}

function establecerValorInicialDelInputUltimoEnIngresarAListaCerrada() {
  window["closed-list__last-state-entered"].value = `-`;
}

function establecerValorDelInputUltimoEnIngresarAListaCerrada() {
  const closedListStatesLength = Object.keys(game.closedListStates).length;
  const lastElementInClosedListStatesLength = Object.values(game.closedListStates)[closedListStatesLength-1].length;
  const lastStateEnteredInClosedListStates = Object.values(game.closedListStates)[closedListStatesLength-1][lastElementInClosedListStatesLength-1]
  window["closed-list__last-state-entered"].value = `[${lastStateEnteredInClosedListStates.stateValues}]`;
}

function setCustomProblemInitialState(stateValuesString) {
  let stateValues = stateValuesString.split(',');
  const estadoValido = verificarCustomProblemState("inicial", stateValues);

  if (estadoValido) {
    let puzzleHtml = '';
    stateValues.forEach((value) => puzzleHtml += `<div class="pieza-small">${(Number(value) !== -1) ? value: ""}</div>`)
    window.customProblemInitialStatePuzzle.innerHTML = puzzleHtml;
    localStorage.setItem('customProblemIS', stateValuesString);
  } else {
    window["custom-problem-initial-state"].value = "";
    let puzzleHtml = '';
    [1,2,3,4,5,6,7,8,9].forEach((_) => puzzleHtml += `<div class="pieza-small"></div>`)
    window.customProblemInitialStatePuzzle.innerHTML = puzzleHtml;
    localStorage.removeItem('customProblemIS');
  }
}

function setCustomProblemGoalState(stateValuesString) {
  let stateValues = stateValuesString.split(',');
  const estadoValido = verificarCustomProblemState("objetivo", stateValues);

  if (estadoValido) {
    let puzzleHtml = '';
    stateValues.forEach((value) => puzzleHtml += `<div class="pieza-small">${(Number(value) !== -1) ? value: ""}</div>`)
    window.customProblemGoalStatePuzzle.innerHTML = puzzleHtml;
    localStorage.setItem('customProblemGS', stateValuesString);
  } else {
    window["custom-problem-goal-state"].value = "";
    let puzzleHtml = '';
    [1,2,3,4,5,6,7,8,9].forEach((_) => puzzleHtml += `<div class="pieza-small"></div>`)
    window.customProblemGoalStatePuzzle.innerHTML = puzzleHtml;
    localStorage.removeItem('customProblemGS');
  }
}

function verificarCustomProblemState(stateLabel, stateValues) {
  if (stateValues.length !== 9) {
    alert(`Hay un error en la longitud del estado ${stateLabel} ingresado.`);
    return false;
  }
  if (new Set(stateValues).size < 9) {
    alert(`No debe haber numeros repetidos en el estado ${stateLabel} ingresado.`);
    return false;
  }
  if (stateValues.some((value) => isNaN(value) || value.length === 0 )) {
    alert(`Algun numero ingresado en el estado ${stateLabel} no es un numero.`);
    return false;
  }
  if (!stateValues.every((value) => Number(value) === -1 || (Number(value) >= 1 && Number(value) <= 8))) {
    alert(`Los unicos valores numeros permitidos para el estado ${stateLabel} son los numeros del 1 al 8 y el -1.`);
    return false;
  }

  return true;
}

function establecerTextoDelBoton(texto) {
  $btnNextAction.textContent = texto;
}