import axios from "axios";
import endPoints from "@services/api";

const createService = async (body) => {
  const config = {
    headers: {
      accept: "*/*",
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.services.createService, body, config);
  return response.data;
};

const deleteService = async (id) => {
  const response = await axios.delete(endPoints.services.deleteService(id));
  return response.data;
};

const updateService = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.services.updateService(id), body, config);
  return response.data;
};

export { createService, updateService, deleteService };