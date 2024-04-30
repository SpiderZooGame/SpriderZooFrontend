import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        params.viewName = "Game";
        super(params);
        this.getData();
    }

    async getData() {
        console.log("getData");
        fetch("/api/test", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("get")
                .appendChild(
                    document.createTextNode(data.message)
                );
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}
