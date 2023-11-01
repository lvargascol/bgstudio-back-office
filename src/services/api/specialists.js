import axios from 'axios';
import endPoints from '@services/api';

const createSpecialist = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.specialists.createSpecialist, body, config);
  return response.data;
};

const addService = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.specialists.addServiceToSpecialist, body, config);
  return response.data;
};

const addServiceByCategory = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.specialists.addServiceByCategoryToSpecialist, body, config);
  return response.data;
};

// const getOneSpecialist = async (id) => {
//   const response = await axios.get(endPoints.specialists.getOneSpecialist(id));
//   return response.data;
// };

const removeService = async (id) => {
  const response = await axios.delete(endPoints.specialists.removeServiceToSpecialist(id));
  return response.data;
};

const deleteSpecialist = async (id) => {
  const response = await axios.delete(endPoints.specialists.deleteSpecialist(id));
  return response.data;
};

const updateSpecialist = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.specialists.updateSpecialist(id), body, config);
  return response.data;
};

export { createSpecialist, updateSpecialist, deleteSpecialist, addService, addServiceByCategory, removeService };
