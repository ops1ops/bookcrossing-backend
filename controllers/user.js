import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../db';

const { User } = db;

const EXPIRATION_TIME = 60 * 60 * 60;
const SALT = 10;

export const registerUser = async ({ body: { email, login, password, repeatedPassword } }, res) => {
  if (password !== repeatedPassword) {
    return res.status(400).send({ reason: 'Passwords dont match' });
  }

  try {
    const { id } = await User.create({ login, email, password: bcrypt.hashSync(password, SALT) });
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: EXPIRATION_TIME });

    return res.send({ id, login, email, token });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ reason: 'Could not create user' });
  }
};

export const loginUser = async ({ body: { email, password } }, res) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ reason: 'User not found' });
    }

    const { id, password: encryptedPassword, login } = user;
    const isPasswordValid = bcrypt.compareSync(password, encryptedPassword);

    if (!isPasswordValid) {
      res.status(401).send({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: EXPIRATION_TIME });

    return res.send({ id, email, login, token });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ reason: 'Could not login user' });
  }
};