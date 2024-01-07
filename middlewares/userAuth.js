const userAuth = (req, res, next) => {
  const { username } = req.body;
  if (username.toLowerCase() !== "jishnu") {
    return res.status(400).send({ message: "Access Denied!!" });
  }
  next();
};

module.exports = {
  userAuth,
};
