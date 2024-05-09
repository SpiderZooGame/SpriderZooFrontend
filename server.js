const express = require("express");
const path = require("path");
const userRoutes = require("./src/api/routes/userRoutes");
const secrets = require("./globalconfigs/constants");
const {
  getTokenData,
  generateSignedToken,
  githubValidateUser,
  apicall,
} = require("./oauth/authorization");

const app = express();

app.use(express.json());

const auth = (req, res, next) => {
  if (!req.headers["authorization"]) {
    res.sendStatus(401);
  } else {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
      getTokenData(token);
      next();
    } catch (error) {
      res.sendStatus(401);
    }
  }
};

app.get("/oauth/login", async (req, res) => {
  res.redirect(secrets.GITHUB_AUTHCODE_REQUEST);
});

app.get("/user/getToken/", async (req, res) => {
  const accessTokenUrl = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`;

  const accessTokenResponse = apicall(accessTokenUrl, null);

  accessTokenResponse
    .then((token) => {
      const accessToken = new URLSearchParams(token.toString()).get(
        "access_token"
      );
      const signedToken = generateSignedToken({ token: accessToken });
      res.json({ token: signedToken });
    })
    .catch((error) => {
      res.sendStatus(404);
    });
});

app.get("/user/getinfo/", auth, async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  let tokenData;
  try {
    tokenData = getTokenData(token);

    githubValidateUser(tokenData.token).then((data) => {
      const userLogin = JSON.parse(data.toString()).login;
      res.json({ result: "Successful", data: { user: userLogin } });
    });
  } catch (error) {
    res.sendStatus(401);
  }
});

app.use("/static", express.static(path.resolve(__dirname, "src", "static")));

app.get("/views/game", auth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/static/html", `Game.html`));
});

app.get("/views/dashboard", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/static/html", `Dashboard.html`));
});

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src", "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
