import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        params.viewName = "Settings";
        super(params);
    }
}