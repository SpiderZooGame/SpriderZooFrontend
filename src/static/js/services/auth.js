export default class AuthService {
  constructor() {
    this.isAuthenticated = false;
    console.log("AuthService constructor");
  }

  checkAuthentication() {
    console.log("AuthService constructor");
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
