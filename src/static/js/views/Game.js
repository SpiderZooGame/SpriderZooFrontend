import AbstractView from "./AbstractView.js";

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function () {
  let currentIndex = this.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [this[currentIndex], this[randomIndex]] = [
      this[randomIndex],
      this[currentIndex],
    ];
  }
};

const DURATION = 20;
const ROUNDS = 2;
const SCORE_INCREMENT = 2;
const INITIAL_SCORE = 10;

export default class Game extends AbstractView {
  constructor(params) {
    params.viewName = "Game";
    super(params);

    this.selected = [];
    this.tileToPicMapping = {};
    this.gameContainer = null;
    this.hasFlipped = false;
    this.round = 1;

    this.canClick = false;
    this.evaluating = false;
    this.score = INITIAL_SCORE;
    this.timer = DURATION;
    this.cleared = 0;
    this.roundScore = 0;

    this.startTimer = new CustomEvent("start-timer");
    this.stopTimer = new CustomEvent("stop-timer");
    this.gameOver = new CustomEvent("game-over");

    this.clickCount = 0;
    this.setIntervalExec = null;

    this.rows = 2;
    this.cols = 2;

    this.colors = [
      "#F216B7",
      "#16CAFD",
      "#41F24D",
      "#D92938",
      "#30CFF2",
      "#A31CA6",
      "#48D904",
      "#591D07",
      "#62612A",
      "#142A22",
      "#FF9F34",
    ];
  }

  castToTimer(timeInSeconds) {
    let minutes = parseInt(timeInSeconds / 60, 10);
    let seconds = parseInt(timeInSeconds % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  }

  resetTimer() {
    document.dispatchEvent(this.stopTimer);
    document.querySelector("#timer").textContent = this.castToTimer(DURATION);
    this.timer = DURATION;
  }

  startTimerCb(e) {
    this.setIntervalExec = setInterval(
      function () {
        document.querySelector("#timer").textContent = this.castToTimer(
          this.timer
        );

        if (--this.timer < 0) {
          this.round++;
          document.dispatchEvent(this.stopTimer);
          document.dispatchEvent(
            new CustomEvent("next-round", {
              detail: { result: false },
            })
          );
          return;
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

        this.cleared += 2;

        this.roundScore += SCORE_INCREMENT;
        document.querySelector("#score").textContent =
          this.score + this.roundScore;

        if (this.cleared === this.rows * this.cols) {
          this.round++;
          document.dispatchEvent(
            new CustomEvent("next-round", {
              detail: { result: true },
            })
          );
          this.evaluating = false;
        }
        return;
      }

      if (this.roundScore > 0) this.roundScore--;
      else if (this.score > 0) {
        this.score--;
      }

      document.querySelector("#score").textContent =
        this.score + this.roundScore;

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

  genAssignment() {
    let indices = Array.apply(null, { length: this.rows * this.cols }).map(
      (_, index) => index
    );

    this.colors.shuffle();

    for (const color of this.colors) {
      if (indices.length > 0) {
        const firstIndex = indices.random();
        this.tileToPicMapping[firstIndex] = color;
        indices = indices.filter((index) => index != firstIndex);

        const secondIndex = indices.random();
        this.tileToPicMapping[secondIndex] = color;
        indices = indices.filter((index) => index != secondIndex);
      }
    }
  }

  constructTile(key, value) {
    const tile = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    const svgTemplate = document.querySelector("#svgTemplate");
    const svg = svgTemplate.content.cloneNode(true);
    const svgElement = svg.querySelector("svg");

    front.classList.add("front_face", "front");
    back.classList.add("back_face", "back");

    svgElement.querySelector("path").setAttribute("fill", value);
    svgElement.querySelector("path").setAttribute("stroke", "#000000");
    svgElement.querySelector("path").setAttribute("stroke-width", "2%");

    back.append(svg);
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

    this.genAssignment();

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
    this.canClick = false;
    this.cleared = 0;
    this.clickCount = 0;
    this.selected = [];

    if (e.detail) {
      if (e.detail.result) {
        if (this.round <= ROUNDS)
          alert("Congrats!! We're moving you to the next round");
      } else {
        if (this.round <= ROUNDS) alert("Oops!! Try again in the next round");
      }

      this.score += this.roundScore;
      this.roundScore = 0;
    }

    this.resetTimer();

    if (this.round > ROUNDS) {
      document.dispatchEvent(this.gameOver);
      return;
    }

    document.querySelector("#round").textContent = `Round ${this.round}`;

    this.setupGrid();

    this.canClick = true;
  }

  startGame() {
    document.addEventListener("game-over", (e) => {
      const token = localStorage.getItem("token");

      fetch("/api/v1/scores", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: this.score,
        }),
      });

      document.dispatchEvent(this.stopTimer);

      this.canClick = false;

      alert("Your score: " + this.score);

      window.location.href = "/";
      return;
    });

    document.addEventListener("start-timer", this.startTimerCb.bind(this));

    document.addEventListener(
      "stop-timer",
      function () {
        if (this.setIntervalExec) window.clearInterval(this.setIntervalExec);
      }.bind(this)
    );

    document.addEventListener("next-round", this.startRound.bind(this));

    document.dispatchEvent(
      new CustomEvent("next-round", {
        detail: null,
      })
    );
  }

  onMounted() {
    this.gameContainer = document.querySelector("#game_container");
    this.startGame();

    document.querySelector("#round").textContent = `Round ${this.round}`;
    document.querySelector("#timer").textContent = this.castToTimer(DURATION);
    document.querySelector("#score").textContent = INITIAL_SCORE;
  }
}
