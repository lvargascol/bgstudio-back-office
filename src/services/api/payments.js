import axios from 'axios';
import endPoints from '@services/api';

const createPayment = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.payments.createPayment, body, config);
  return response.data;
};

const deletePayment = async (id) => {
  const response = await axios.delete(endPoints.payments.deletePayment(id));
  return response.data;
};

const updatePayment = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.payments.updatePayment(id), body, config);
  return response.data;
};

export { createPayment, updatePayment, deletePayment };
