import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
        window.location.href = "http://www.w3schools.com";
    }

    async getHtml() {
        return ``;
    }
}