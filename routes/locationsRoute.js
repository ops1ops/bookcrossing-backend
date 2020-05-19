import express from 'express';
import { addLocation, getLocation, getLocations } from '../controllers/location';
import validateRequiredFields from '../middlewares/validators/validateRequiredFields';
import verifyUser from '../middlewares/verifyUser';

const router = express.Router();
const ADD_LOCATION_FIELDS = ['name', 'address', 'description', 'lat', 'lon', 'addedBy'];

router.post('/location/add', validateRequiredFields(ADD_LOCATION_FIELDS), verifyUser, addLocation);
router.get('/location/:id', getLocation);
router.get('/locations', getLocations);

export default router;