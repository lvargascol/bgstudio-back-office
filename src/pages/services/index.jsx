import { useState, useEffect } from 'react';
import axios from 'axios';
import useAlert from '@hooks/useAlert';
import endPoints from '@services/api';
import Modal from '@common/Modal';
import Alert from '@common/Alert';
import AddService from '@components/AddService';
import EditService from '@components/EditService';
import ViewService from '@components/ViewService';
export default function Services() {
  const [services, setServices] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [id, setId] = useState(null);
  const { alert, setAlert, toggleAlert } = useAlert();
  useEffect(() => {
    async function loadServices() {
      const response = await axios.get(endPoints.services.getAllService);
      setServices(response.data);
    }
    try {
      loadServices();
    } catch (error) {
      console.log(error);
    }
  }, [alert]);
  const handleEdit = (id) => {
    setId(id);
    setOpenEdit(true);
  };
  const handleView = (id) => {
    setId(id);
    setOpenView(true);
  };
  return (
    <ul className="divide-y divide-gray-200">
      <Alert alert={alert} handleClose={toggleAlert} />
      <li className="py-2 px-2">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-10 sm:grid-cols-12 ">
            <div className="col-span-8 sm:col-span-11 grid grid-cols-10 sm:grid-cols-12 gap-x-1">
              <div className="col-span-6 sm:col-span-4 min-w-0">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Servicio</p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Precio ($)</p>
              </div>
              <div className="col-span-1 sm:col-span-2 min-w-0 text-center hidden sm:block">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Duración (min)</p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 hidden sm:block text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Categoría</p>
              </div>
              <div className="col-span-1 sm:col-span-1 min-w-0 sm:hidden text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Cat</p>
              </div>
              <div className="col-span-1 sm:col-span-2 min-w-0 hidden sm:block text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Disponible</p>
              </div>
              <div className="col-span-1 sm:col-span-1 min-w-0 sm:hidden text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">D</p>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-1 justify-between"></div>
          </div>
        </div>
      </li>
      {services.map((service) => (
        <li key={`service-${service.id}`} className="py-1 px-2">
          <div>
            <div className="grid grid-cols-10 sm:grid-cols-12 gap-x-1">
              <div className="col-span-8 sm:col-span-11 grid grid-cols-10 sm:grid-cols-12 gap-x-1">
                <div className="col-span-6 sm:col-span-4">
                  <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">{service.name}</p>
                </div>
                <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
                  <p className="text-xs leading-5 text-gray-900 py-0.5">{service.price}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 min-w-0 text-center hidden sm:block">
                  <p className="text-xs leading-5 text-gray-900 py-0.5">{service.minutes}</p>
                </div>
                <div className="col-span-2 sm:col-span-2 min-w-0 text-center hidden sm:block">
                  <p className="text-xs leading-5 text-gray-900 py-0.5 ">{service.category.name}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 min-w-0 text-center sm:hidden">
                  <p className="text-xs leading-5 text-gray-900 py-0.5 ">{service.category.name.slice(0, 2)}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 grid">
                  {service.active ? (
                    <div className="flex items-center gap-x-1.5 justify-self-center">
                      <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-1.5 justify-self-center">
                      <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                        <div className="h-2 w-2 rounded-full bg-red-700" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:grid-cols-2 gap-x-2">
                <div className="col-span-1 sm:col-span-1 grid">
                  <button type="button" className="flex gap-x-2 justify-self-end" onClick={() => handleEdit(service.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                </div>
                <div className="col-span-1 sm:col-span-1 grid">
                  <button type="button" className="flex gap-x-2 justify-self-end" onClick={() => handleView(service.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
      <li className="py-2 px-2">
        <button type="button" className="flex gap-x-2" onClick={() => setOpenAdd(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-gray-600	">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span className="text-xs leading-4 text-gray-600">Añadir nuevo servicio</span>
        </button>
      </li>
      <Modal open={openEdit} setOpen={setOpenEdit}>
        <EditService setOpen={setOpenEdit} setAlert={setAlert} id={id} />
      </Modal>
      <Modal open={openView} setOpen={setOpenView}>
        <ViewService setOpen={setOpenView} setAlert={setAlert} id={id} />
      </Modal>
      <Modal open={openAdd} setOpen={setOpenAdd}>
        <AddService setOpen={setOpenAdd} setAlert={setAlert} />
      </Modal>
    </ul>
  );
}
