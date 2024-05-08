export default class {
  constructor(params) {
    this.params = params;
    document.title = `SpiderZoo - ${params.viewName}`;
  }

  async getHtml() {
    return fetch(`/views/${this.params.viewName}`)
      .then((response) => {
        if (!response.ok) {
          return this.errorView();
        }
        return response.text();
      })
      .then((html) => {
        return html;
      })
      .catch((error) => {
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
}
