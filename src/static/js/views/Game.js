import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
        this.getData();
    }

    async getHtml() {
        return `
            <h1>Game</h1>
            <p id="perm">You are viewing the Game Page! c</p>
        `;
    }

    async getData() {
        fetch("http://localhost:3001/test", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("perm").innerHTML = data.message;
            });
    }
}
