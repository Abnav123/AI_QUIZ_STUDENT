const auth = (req, res, next) => {
  try {
    const email = req.headers.email;

    if (!email) {
      return res.status(401).json({ message: 'Email header required' });
    }

    req.email = email;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
