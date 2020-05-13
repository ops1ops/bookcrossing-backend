import express from 'express';

import { registerUser, loginUser } from '../controllers/user';
import validateRequiredFields from '../middlewares/validators/validateRequiredFields';
import validateEmail from '../middlewares/validators/validateEmail';

const router = express.Router();

const REGISTER_FIELDS = ['email', 'login', 'password', 'repeatedPassword'];
const LOGIN_FIELDS = ['email', 'password'];

router.post('/user/register', validateRequiredFields(REGISTER_FIELDS), validateEmail, registerUser);
router.post('/user/login', validateRequiredFields(LOGIN_FIELDS), validateEmail, loginUser);

export default router;