const https = require("https");
const jwt = require("jsonwebtoken");

const apicall = function (url, headers = {}) {
  if (headers != null) {
    headers["User-Agent"] = "SpiderZoo";
  }

  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (result) => {
      let data = [];

      result.on("data", (chunk) => {
        data.push(chunk);
      });

      result.on("end", () => {
        if (result.statusCode != 200) {
          reject(result.statusCode);
        } else {
          resolve(Buffer.concat(data));
        }
      });

      result.on("error", (err) => {
        reject(err);
      });
    });
  });
};

const githubValidateUser = (tokenstring) => {
  const accessTokenUrl = `https://api.github.com/user`;

  const userInfoResponse = apicall(accessTokenUrl, {
    Authorization: "Bearer " + tokenstring,
  });

  return userInfoResponse;
};

const getUserEmail = () => {
  return "dummy@gmail.com";
};

const auth = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    res.sendStatus(401);
  } else {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
      const githubToken = getTokenData(token);
      const githubUser = await githubValidateUser(githubToken.token);

      if (githubUser) {
        next();
      }
    } catch (error) {
      res.sendStatus(401);
    }
  }
};

const generateSignedToken = (githubtoken) => {
  return jwt.sign(githubtoken, process.env.ACCESS_TOKEN_SECRET);
};

const getTokenData = (tokenToCheck) => {
  return jwt.verify(tokenToCheck, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = {
  getTokenData,
  generateSignedToken,
  githubValidateUser,
  getUserEmail,
  apicall,
  auth,
};
