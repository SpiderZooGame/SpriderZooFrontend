export default class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.isAuthenticated = true;

    let link = document.getElementById("logout");
    if (link) {
      document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();
        let sessiontoken = localStorage.getItem("token");
        if (sessiontoken) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      });
    }

    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    if (code) {
      fetch("/user/getToken/?code=" + code)
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("token", res.token);
          if (res.token != localStorage.getItem("token")) {
            fetch("/user/getinfo/", {
              headers: {
                Authorization: "Bearer " + res.token,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                localStorage.setItem("user", res.data.user);
              });
          }
        });
    }
  }

  checkAuthentication() {
    if (!this.isAuthenticated) {
      this.isAuthenticated = true;
    }

    return this.isAuthenticated;
  }

  receiveAuthenticationVerification(verification) {
    if (verification) {
      this.isAuthenticated = true;
    }
  }
}
