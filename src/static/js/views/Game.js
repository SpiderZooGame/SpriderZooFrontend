import AbstractView from "./AbstractView.js";

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

export default class Game extends AbstractView {
    constructor(params) {
        params.viewName = "Game";
        super(params);

        this.selected = [];
        this.tileToPicMapping = {};
    }

    onTileClicked(e) {
        this.selected.push(Number(e.target.id.split("-")[1]));

        e.target.classList.add("clicked")

        if (this.selected.length < 2) return;

        setTimeout(() => {
            if (this.tileToPicMapping[this.selected[0]] === this.tileToPicMapping[this.selected[1]]) {
                this.toggleClass("hidden");
                this.selected = [];
                return;
            }

            this.toggleClass("clicked");

            this.selected = [];
        }, 500);
    }

    toggleClass(className) {
        for (const id of this.selected) {
            document.querySelector(`#tile-${id}`).classList.toggle(className);
        }
    }

    onDoneClicked(e) {
        const rows = document.querySelector("#num-rows").value;
        const cols = document.querySelector("#num-cols").value;

        this.setupGrid(rows, cols);
    }
    
    genAssignment(pics, numOfTiles) {
        let indices = Array.apply(null, {length: numOfTiles}).map((_, index) => index);
        
        for (const pic of pics) {
            const firstIndex = indices.random()
            this.tileToPicMapping[firstIndex] = pic;
            indices = indices.filter((index) => index != firstIndex);

            if (indices.length > 0) {
                const secondIndex = indices.random()
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

        front.classList.add("front");
        back.classList.add("back");

        back.append(textElemWithVal);
        tile.append(front);
        tile.append(back);

        tile.classList.add("tile");
        tile.id = "tile-" + key;

        tile.addEventListener("click", this.onTileClicked.bind(this));

        return tile;
    }

    onPlay(e) {
        e.preventDefault();
        
        document.querySelector("#info").classList.add("none");
        document.querySelector("#badges").classList.add("none");
        document.querySelector("#play").classList.add("none");

        this.setupGrid(4, 4);
    }

    setupGrid(rows, cols) {
        document.documentElement.style.setProperty("--grid-cols", cols);
        document.documentElement.style.setProperty("--grid-rows", rows);

        const grid = document.createElement("section");

        this.genAssignment(
            Array.apply(null, {length: Math.ceil((rows * cols)/2)}).map((_, index) => index),
            rows * cols
        )

        console.log(this.tileToPicMapping);

        for(const [key, value] of Object.entries(this.tileToPicMapping)) {
            grid.appendChild(this.constructTile(key, value));
        }

        grid.classList.add("game_grid");

        document.querySelector("#game").replaceChildren(grid);

        this.tileToPicMapping = {}
    }

    onMounted() {
        document.querySelector("#play").addEventListener("click", this.onPlay.bind(this))
    }
}
