const jwt = require("jsonwebtoken");

exports.createToken = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
};

exports.checkToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return false;
  }
};
