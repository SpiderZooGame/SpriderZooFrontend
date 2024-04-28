import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.gameId = params.id;
        this.setTitle("Viewing Games");
    }

    async getHtml() {
        return `
            <h1>Game</h1>
            <p>You are viewing game page #${this.gameId}.</p>
        `;
    }
}
