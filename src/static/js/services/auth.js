export default class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.isAuthenticated = true;

    this.toggleIcons();

    let link = document.getElementById("logout_icon");
    if (link) {
      document.getElementById("logout_icon").addEventListener("click", (e) => {
        e.preventDefault();
        let sessiontoken = localStorage.getItem("token");
        if (sessiontoken) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("usedauthcode");
          this.userLoggedOut();
          window.location.href = "/";
        }
      });
    }

    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    let usedauthcode = localStorage.getItem("usedauthcode");

    if (code && !usedauthcode) {
      localStorage.setItem("usedauthcode", code);

      fetch("/user/getToken/?code=" + code)
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("token", res.token);

          fetch("/user/getinfo/", {
            headers: {
              Authorization: "Bearer " + res.token,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              this.userLoggedIn();
              localStorage.setItem("user", res.data.user);
              localStorage.setItem("email", res.data.email);
            });
        });
    }

    fetch("/api/v1/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("user"),
        email: "meeeee@rt.com",
      }),
    });
  }

  userLoggedIn() {
    localStorage.setItem("showicon", "true");
    this.toggleIcons();
  }

  userLoggedOut() {
    localStorage.setItem("showicon", "false");
    this.toggleIcons();
  }

  toggleIcons() {
    let personIcon = document.getElementById("person_icon");
    let logoutIcon = document.getElementById("logout_icon");

    if (personIcon) {
      let showIcon = localStorage.getItem("showicon");
      if (showIcon === "true") {
        personIcon.style.display = "none";
      } else {
        personIcon.style.display = "block";
      }
    }

    if (logoutIcon) {
      let showIcon = localStorage.getItem("showicon");
      if (showIcon === "true") {
        logoutIcon.style.display = "block";
      } else {
        logoutIcon.style.display = "none";
      }
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
