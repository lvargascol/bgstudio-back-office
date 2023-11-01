import axios from 'axios';
import endPoints from '@services/api';

const createUser = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.users.createUser, body, config);
  return response.data;
};

// const getOneUser = async (id) => {
//   const response = await axios.get(endPoints.users.getOneUser(id));
//   return response.data;
// };

const deleteUser = async (id) => {
  const response = await axios.delete(endPoints.users.deleteUser(id));
  return response.data;
};

const updateUser = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.users.updateUser(id), body, config);
  return response.data;
};

export { createUser, updateUser, deleteUser };
