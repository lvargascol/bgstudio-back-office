import axios from 'axios';
import endPoints from '@services/api';
const createBooking = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.bookings.createBooking, body, config);
  return response.data;
};
const addService = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.bookings.addServiceToBooking, body, config);
  return response.data;
};
const addPromo = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.bookings.addPromoToBooking, body, config);
  return response.data;
};
const removeService = async (id) => {
  const response = await axios.delete(endPoints.bookings.removeServiceToBooking(id));
  return response.data;
};
const removePromo = async (id) => {
  const response = await axios.delete(endPoints.bookings.removePromoToBooking(id));
  return response.data;
};
const deleteBooking = async (id) => {
  const response = await axios.delete(endPoints.bookings.deleteBooking(id));
  return response.data;
};
const updateBooking = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.bookings.updateBooking(id), body, config);
  return response.data;
};
export { createBooking, updateBooking, deleteBooking, addService, removeService, addPromo, removePromo };
