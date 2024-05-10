const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const secrets = {
  CLIENT_ID: CLIENT_ID,
  CLIENT_SECRET: CLIENT_SECRET,
  GITHUB_AUTHCODE_REQUEST: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user,user:email`,
  ACCESS_TOKEN_REQUEST: `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&device_code=${REDIRECT_URL}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
};

module.exports = secrets;
