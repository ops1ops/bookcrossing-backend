import db from '../db';

const { Location } = db;

// TODO: get from body only validated fields

export const addLocation = async ({ body: { name, address, description, lat, lon } }, res) => {
  try {
    const { id } = await Location.create({ name, address, description, lat, lon });

    return res.send({ id });
  } catch (error) {
    return res.status(500).send({ reason: 'Something went wrong. Probably location is already exists' });
  }
};

export const getLocation = async ({ params: { id } }, res) => {
  try {
    const location = await Location.findOne({
      where: { id },
      include: [
        { association: 'books', attributes: ['id', 'isbn', 'name', 'imageUrl', 'ownerId'] }
      ]
  });

    if (!location) {
      return res.status(404).send({ reason: 'Location was not found' });
    }

    return res.send(location);
  } catch (error) {
    console.log(error);

    return res.status(500).send({ reason: 'Something went wrong' })
  }
};

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();

    return res.send(locations);
  } catch (error) {
    console.log(error);

    return res.send(500).send({ reason: 'Something went wrong' });
  }
};
