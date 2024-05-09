export default class {
  constructor(params) {
    this.params = params;
    document.title = `SpiderZoo - ${params.viewName}`;
  }

  async getHtml() {
    return fetch(`/views/${this.params.viewName.toLowerCase()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "/oauth/login";
          return this.authView();
        } else if (!response.ok) {
          return this.errorView();
        }
        return response.text();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.errorView();
      });
  }

  errorView() {
    return `
            <div class="error-container"> 
                <h1> 404 </h1> 
                <p> 
                    Oops! The page you're 
                    looking for is not here. 
                </p> 
                <a href="/"> 
                    Go Back to Home 
                </a> 
            </div> 
        `;
  }

  authView() {
    return `
            <div class="error-container"> 
                <h1> 401 </h1> 
                <p> 
                    Oops! You are not logged in. Redirecting to login page. 
                </p> 
                <a href="/"> 
                    Go Back to Home 
                </a> 
            </div> 
        `;
  }
}
