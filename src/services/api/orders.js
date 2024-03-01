import axios from 'axios';
import endPoints from '@services/api';

const createOrder = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.orders.createOrder, body, config);
  return response.data;
};

const deleteOrder = async (id) => {
  const response = await axios.delete(endPoints.orders.deleteOrder(id));
  return response.data;
};

const updateOrder = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.orders.updateOrder(id), body, config);
  return response.data;
};

export { createOrder, updateOrder, deleteOrder };
