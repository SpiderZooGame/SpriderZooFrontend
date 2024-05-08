const getUsers = "SELECT * FROM users";
const getUserByEmail = "SELECT * FROM users WHERE email = $1";

module.exports = {
  getUsers,
  getUserByEmail,
};
