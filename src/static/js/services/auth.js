
export default class AuthService {
    constructor() {
    this.isAuthenticated = false;
    console.log('AuthService constructor');
    this.isAuthenticated = true;

    const params = new URLSearchParams(window.location.search);

    const code = params.get('code');

    if(code){
      fetch("/user/getToken/?code="+code).then(res => res.json()
       ).then((res) => {
          localStorage.setItem("token",res.token);
          console.log(res);

          fetch("/user/getinfo/", {
            headers: {
              Authorization: "Bearer " + res.token,
            },
          }).then(res => res.json())
            .then((res) => {
              console.log("The user information is: ");
              console.log(res);
          }); 

      });    

    }

    }
   
    checkAuthentication() {
        console.log('AuthService constructor');
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