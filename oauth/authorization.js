const https = require("https");
const jwt = require('jsonwebtoken');

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
  
    const userInfoResponse = apicall(accessTokenUrl, {Authorization: "Bearer "+tokenstring});
  
    return userInfoResponse;
  
  }
  
  const generateSignedToken = (githubtoken) => {
    return jwt.sign(githubtoken, process.env.ACCESS_TOKEN_SECRET);
  }
  
  const getTokenData = (tokenToCheck) => {
    return jwt.verify(tokenToCheck, process.env.ACCESS_TOKEN_SECRET);
  }

  module.exports = {
    getTokenData,
    generateSignedToken,
    githubValidateUser,
    apicall
  }