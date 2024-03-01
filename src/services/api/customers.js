import axios from 'axios';
import endPoints from '@services/api';

const createCustomer = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.customers.createCustomer, body, config);
  return response.data;
};

const getAllCustomer = async () => {
  const response = await axios.get(endPoints.customers.getAllCustomer);
  return response.data;
};

const deleteCustomer = async (id) => {
  const response = await axios.delete(endPoints.customers.deleteCustomer(id));
  return response.data;
};

const updateCustomer = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.customers.updateCustomer(id), body, config);
  return response.data;
};

export { getAllCustomer, createCustomer, updateCustomer, deleteCustomer };
