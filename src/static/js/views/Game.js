import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
    }

    async getHtml() {
        return `
            <h1>Game</h1>
            <p>You are viewing the Game Page!</p>
        `;
    }
}