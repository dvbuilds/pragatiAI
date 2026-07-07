const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser, verifyPassword, refreshTokens } = require("../services/userStore");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "civicai_access_dev_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "civicai_refresh_dev_secret";

function signAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: "7d" });
}

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (findUserByEmail(email)) return res.status(409).json({ error: "User already exists" });

  const user = createUser(email, password);
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  refreshTokens.add(refreshToken);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({ accessToken, user: { id: user.id, email: user.email } });
}

function login(req, res) {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(user, password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  refreshTokens.add(refreshToken);
  setRefreshCookie(res, refreshToken);

  res.json({ accessToken, user: { id: user.id, email: user.email } });
}

function refresh(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    // Rotate refresh token
    refreshTokens.delete(token);
    const newRefreshToken = signRefreshToken(payload);
    refreshTokens.add(newRefreshToken);
    setRefreshCookie(res, newRefreshToken);

    const accessToken = signAccessToken(payload);
    res.json({ accessToken });
  } catch (e) {
    refreshTokens.delete(token);
    res.status(401).json({ error: "Refresh token expired" });
  }
}

function logout(req, res) {
  const token = req.cookies?.refreshToken;
  if (token) refreshTokens.delete(token);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, refresh, logout, me, ACCESS_SECRET };
