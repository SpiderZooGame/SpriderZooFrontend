import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        params.viewName = "Dashboard";
        super(params);
    }

    async getAccessToken(params) {
        // console.log(params);
        // const query = window.location.search.substring(1);
        // const token = query.split("access_token=")[1];
        // console.log(token);
      
        // fetch("/user/getuser", {
        //   headers: {
        //     // Include the token in the Authorization header
        //     Authorization: "token " + token,
        //   },
        // })
        //   .then((res) => res.json())
        //   .then((res) => {
        //     // Once we get the response (which has many fields)
        //     // Documented here: https://developer.github.com/v3/users/#get-the-authenticated-user
        //     // Write "Welcome <user name>" to the documents body
        //     const nameNode = document.createTextNode(`Welcome, ${res.name}`);
        //     document.body.appendChild(nameNode);
        //   });
    }
}