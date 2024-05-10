const express = require("express");
const path = require("path");
const v1Routes = require("./src/api/routes/v1Routes");
const secrets = require("./globalconfigs/constants");
const {
  getTokenData,
  generateSignedToken,
  githubValidateUser,
  getUserEmail,
  apicall,
  auth,
} = require("./oauth/authorization");

const app = express();

app.use(express.json());

app.use("/api/v1", v1Routes);

app.get("/oauth/login", async (req, res) => {
  res.redirect(secrets.GITHUB_AUTHCODE_REQUEST);
});

app.get("/user/getToken/", async (req, res) => {
  const accessTokenUrl = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`;

  let accessTokenResponse;
  try {
    accessTokenResponse = await apicall(accessTokenUrl, null);
    const accessToken = new URLSearchParams(accessTokenResponse.toString()).get(
      "access_token"
    );
    const signedToken = generateSignedToken({ token: accessToken });
    res.json({ token: signedToken });
  } catch (error) {
    res.sendStatus(404);
  }
});

app.get("/user/getinfo/", auth, async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  let tokenData;
  try {
    tokenData = getTokenData(token);

    const userObject = await githubValidateUser(tokenData.token);
    const userEmail = await getUserEmail(tokenData.token);

    res.json({
      result: "Successful",
      data: {
        user: JSON.parse(userObject.toString()).login,
        email: userEmail[0].email,
      },
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
