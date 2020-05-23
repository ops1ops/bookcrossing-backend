export default (fields) => ({ body }, res, next) => {
  const invalidField = fields.find((field) => !body[field]);

  if (invalidField) {
    return res.status(422).send({ reason: `${invalidField} is required field` });
  }

  next();
};
