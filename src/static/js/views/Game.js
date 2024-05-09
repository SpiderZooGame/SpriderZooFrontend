import AbstractView from "./AbstractView.js";

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const INITIAL_DELAY = 500;
const SHOW_DELAY = 1500;
const DURATION = 60 * 1;
const MAX_ROUNDS = 2;

export default class Game extends AbstractView {
  constructor(params) {
    params.viewName = "Game";
    super(params);

    this.selected = [];
    this.tileToPicMapping = {};
    this.gameContainer = null;
    this.hasFlipped = false;
    this.rounds = MAX_ROUNDS;

    this.canClick = false;
    this.evaluating = false;
    this.score = 0;
    this.timer = DURATION;
    this.cleared = 0;

    this.nextRoundEvent = new CustomEvent("next-round");
    this.startTimer = new CustomEvent("start-timer");
    this.stopTimer = new CustomEvent("stop-timer");

    this.clickCount = 0;
    this.setIntervalExec = null;

    this.rows = 4;
    this.cols = 4;
  }

  startTimerCb(e) {
    const timerElement = document.querySelector("#timer");
    let minutes, seconds;

    this.setIntervalExec = setInterval(
      function () {
        minutes = parseInt(this.timer / 60, 10);
        seconds = parseInt(this.timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.textContent = minutes + ":" + seconds;

        if (--this.timer < 0) {
          document.dispatchEvent(
            new CustomEvent("game-over", { detail: { result: 0 } })
          );
        }
      }.bind(this),
      1000
    );
  }

  evaluate() {
    this.evaluating = true;
    setTimeout(() => {
      if (
        this.tileToPicMapping[this.selected[0]] ===
        this.tileToPicMapping[this.selected[1]]
      ) {
        this.toggleClass("hidden");
        this.selected = [];
        this.evaluating = false;

        this.score += 1;
        document.querySelector("#score").textContent = this.score;
        this.cleared += 2;

        if (this.cleared === this.rows * this.cols) {
          this.rounds--;
          document.dispatchEvent(this.nextRoundEvent);
          this.evaluating = false;
        }
        return;
      }

      this.toggleFrontBackSelected();

      this.selected = [];

      this.evaluating = false;
    }, 1000);
  }

  onTileClicked(e) {
    if (!this.canClick || this.evaluating) return;

    this.clickCount += 1;

    if (this.clickCount == 1) document.dispatchEvent(this.startTimer);

    const tile = e.currentTarget;
    const tileId = tile.id.split("-")[1];

    if (!this.selected.includes(Number(tileId))) {
      this.selected.push(Number(tileId));
    } else {
      const index = this.selected.indexOf(Number(tileId));
      this.selected.splice(index, 1);
    }

    this.toggleFrontBack(tile);

    if (this.selected.length < 2) return;

    this.evaluate();
  }

  toggleClass(className) {
    for (const id of this.selected) {
      const tile = this.gameContainer.querySelector(`#tile-${id}`);
      tile.classList.toggle(className);
    }
  }

  toggleFrontBackSelected() {
    for (const id of this.selected) {
      const tile = this.gameContainer.querySelector(`#tile-${id}`);
      this.toggleFrontBack(tile);
    }
  }

  genAssignment(pics, numOfTiles) {
    let indices = Array.apply(null, { length: numOfTiles }).map(
      (_, index) => index
    );

    for (const pic of pics) {
      if (indices.length > 0) {
        const firstIndex = indices.random();
        this.tileToPicMapping[firstIndex] = pic;
        indices = indices.filter((index) => index != firstIndex);

        const secondIndex = indices.random();
        this.tileToPicMapping[secondIndex] = pic;
        indices = indices.filter((index) => index != secondIndex);
      }
    }
  }

  constructTile(key, value) {
    let tile = document.createElement("div");
    let front = document.createElement("div");
    let back = document.createElement("div");

    let textElemWithVal = document.createElement("p");
    textElemWithVal.textContent = value;

    front.classList.add("front_face", "front");
    back.classList.add("back_face", "back");

    back.append(textElemWithVal);
    tile.append(front);
    tile.append(back);

    tile.classList.add("tile");
    tile.id = "tile-" + key;

    return tile;
  }

  setupGrid() {
    document.documentElement.style.setProperty("--grid-cols", this.cols);
    document.documentElement.style.setProperty("--grid-rows", this.rows);

    const gridQuery = document.querySelector(".game_grid");
    const grid = gridQuery
      ? document.querySelector(".game_grid")
      : document.createElement("section");

    grid.replaceChildren();

    this.genAssignment(
      Array.apply(null, { length: this.rows * this.cols }).map(
        (_, index) => index
      ),
      this.rows * this.cols
    );

    for (const [key, value] of Object.entries(this.tileToPicMapping)) {
      grid.appendChild(this.constructTile(key, value));
    }

    if (!grid.classList.contains("game_grid")) grid.classList.add("game_grid");

    if (!gridQuery) this.gameContainer.append(grid);

    document.querySelectorAll(".tile").forEach((tile) => {
      tile.addEventListener("click", this.onTileClicked.bind(this));
    });
  }

  toggleFrontBack(tile) {
    if (tile.classList.contains("front-to-back")) {
      tile.classList.remove("front-to-back");
      tile.classList.add("back-to-front");
    } else {
      tile.classList.add("front-to-back");
      tile.classList.remove("back-to-front");
    }
  }

  startRound(e) {
    this.cleared = 0;
    this.clickCount = 0;

    if (this.setIntervalExec) document.dispatchEvent(this.stopTimer);

    if (this.rounds < 1) {
      document.dispatchEvent(
        new CustomEvent("game-over", { detail: { result: 1 } })
      );

      return;
    }

    this.canClick = true;

    document.querySelector("#round").textContent = `Round ${
      MAX_ROUNDS - this.rounds + 1
    }`;

    this.setupGrid();
  }

  startGame() {
    document.addEventListener("game-over", (e) => {
      // send results to the backend

      window.clearInterval(this.setIntervalExec);

      this.canClick = false;

      document.querySelectorAll(".tile").forEach((tile) => {
        if (tile.classList.length > 1) this.toggleFrontBack(tile);
      });

      // window.location.href = "/";
      return;
    });

    document.addEventListener("start-timer", this.startTimerCb.bind(this));

    document.addEventListener("stop-timer", () => {
      window.clearInterval(this.setIntervalExec);
    });

    document.addEventListener("next-round", this.startRound.bind(this));

    document.dispatchEvent(this.nextRoundEvent);
  }

  onMounted() {
    this.gameContainer = document.querySelector("#game_container");

    this.startGame();
  }
}
