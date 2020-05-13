export default (fields) => ({ body }, res, next) => {
  const invalidField = fields.find((field) => !body[field]);

  if (invalidField) {
    return res.status(400).send(`${invalidField} is required field`);
  }

  next();
}