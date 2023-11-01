import axios from 'axios';
import endPoints from '@services/api';

const createPromo = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.promos.createPromo, body, config);
  return response.data;
};

const addService = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.promos.addServiceToPromo, body, config);
  return response.data;
};

// const getOnePromo = async (id) => {
//   const response = await axios.get(endPoints.promos.getOnePromo(id));
//   return response.data;
// };

const removeService = async (id) => {
  const response = await axios.delete(endPoints.promos.removeServiceToPromo(id));
  return response.data;
};

const deletePromo = async (id) => {
  const response = await axios.delete(endPoints.promos.deletePromo(id));
  return response.data;
};

const updatePromo = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.promos.updatePromo(id), body, config);
  return response.data;
};

export { createPromo, updatePromo, deletePromo, addService, removeService };
