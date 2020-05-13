const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default ({ body: { email } }, res, next) => {
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).send({ reason: 'Email is not valid' });
  }

  next();
};
