import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const { headers: { ['x-access-token']: token } } = req;

  if (token) {
    try {
      // eslint-disable-next-line prefer-destructuring

      req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (error) {
      res.status(401).json({ reason: 'Failed to authenticate token. Probably token expired' });
    }
  } else {
    res.status(401).json({ error: 'No Token Provided!' });
  }

  next();
};