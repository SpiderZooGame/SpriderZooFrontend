
export default class AuthService {
  constructor() {
  this.isAuthenticated = false;
  console.log('AuthService constructor');
  this.isAuthenticated = true;
  
  let link = document.getElementById("logout");
  if(link){
    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault();
      let sessiontoken = localStorage.getItem("token");
      if(sessiontoken){
          localStorage.removeItem("token");
          console.log("Token removed, now redirecting user to home")
          window.location.href = "/";
      }
      
  });
  }


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