const express = require("express");
const path = require("path");
const userRoutes = require("./src/api/routes/userRoutes");
const secrets = require("./globalconfigs/constants");
const { getTokenData, generateSignedToken, githubValidateUser, apicall } = require("./oauth/authorization");

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);

app.use("/static", express.static(path.resolve(__dirname, "src", "static")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src", "index.html"));
});

app.get("/views/Dashboard", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/static/html", "Dashboard.html"));
});

app.get("/oauth/login", async (req, res) => {
  res.redirect(secrets.GITHUB_AUTHCODE_REQUEST);
});

app.get("/user/getToken/", async (req, res) => {
    const accessTokenUrl = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`;

    const accessTokenResponse = apicall(accessTokenUrl, null);

    accessTokenResponse.then(token => {
      const accessToken = new URLSearchParams(token.toString()).get('access_token');
      const signedToken = generateSignedToken({token: accessToken});
      res.json({token: signedToken});     
    }).catch(error => {
      res.sendStatus(404); 
    });
    
});

app.use((req, res, next) => {

  const protectedRoutes = ['/game', '/api/v1/users', '/settings'];

  if (protectedRoutes.includes(req.path) && !req.headers['authorization']) {
    res.sendStatus(401);
  } else if(req.headers['authorization']){
    
    const token = req.headers['authorization'].split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try{
      getTokenData(token);

      next();
    }catch(error){
      res.sendStatus(401)
    }

  }else{
    next();
  }
  
});

app.get("/user/getinfo/", async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];

    let tokenData = getTokenData(token);

    githubValidateUser(tokenData.token).then(data => {
      const userLogin = JSON.parse(data.toString()).login;
      res.json({result: "Successful", data: {user: userLogin}});
    }).catch(error => res.json({result: "Failed", data: {status: error}}));
    
});

app.use("/api/v1/users", userRoutes);

app.get("/views/:viewName", (req, res) => {
  const viewName = req.params.viewName;
  res.sendFile(path.resolve(__dirname, "src/static/html", `${viewName}.html`));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
