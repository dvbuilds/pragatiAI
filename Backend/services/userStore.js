const crypto = require("crypto");

// In-memory store — replace with MongoDB later. Data resets on server restart.
const users = []; // { id, email, passwordHash }
let refreshTokens = new Set(); // valid refresh tokens

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

function createUser(email, password) {
  const user = { id: Date.now().toString(), email, passwordHash: hashPassword(password) };
  users.push(user);
  return user;
}

function verifyPassword(user, password) {
  return user.passwordHash === hashPassword(password);
}

module.exports = { users, refreshTokens, findUserByEmail, createUser, verifyPassword };
