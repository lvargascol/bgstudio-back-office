import { useState, useEffect, useRef } from 'react';
import { Switch } from '@headlessui/react';
import useFetch from '@hooks/useFetch';
import axios from 'axios';
import { updatePromo, deletePromo, addService, removeService } from '@services/api/promos';
import endPoints from '@services/api';
export default function FormProduct({ setOpen, setAlert, id }) {
  const formRef = useRef(null);
  const [promo, setPromo] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState([]);
  const deleteMessage = `Esta acción es irreversible ¿Estás seguro de eliminar esta promoción? De ser así, escriba "${promo?.name}" para confirmar`;
  const categories = useFetch(endPoints.categories.getAllCategory);
  const services = useFetch(endPoints.services.getAllService);
  useEffect(() => {
    async function loadPromo() {
      const response = await axios.get(endPoints.promos.getOnePromo(id));
      setPromo(response.data);
      setSelected(response.data.services);
      setEnabled(response.data.active);
    }
    try {
      loadPromo();
    } catch (error) {
      console.log(error);
    }
  }, [alert]);
  const handleSelect = () => {
    const selectedId = parseInt(new FormData(formRef.current).get('service'));
    const found = selected.find((item) => item.id === selectedId);
    if (!found) {
      services.map((service) => (service.id === selectedId ? setSelected([...selected, service]) : selectedId));
    }
  };
  const handleRemove = (service) => {
    setSelected(selected.filter((item) => item.id != service.id));
  };
  const handleEnable = () => {
    setEnabled(!enabled);
  };
  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };
  const subtractArray = (array1, array2) => {
    array1.forEach((item1) => {
      array2 = array2.filter((item2) => item2.id != item1.id);
    });
    return array2;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseInt(formData.get('price')),
      minutes: selected.reduce((acum, current) => acum + current.minutes, 0),
      active: enabled,
    };
    if (confirmDelete) {
      deletePromo(promo.id)
        .then(() => {
          setAlert({
            active: true,
            message: 'Promo eliminada correctamente',
            type: 'success',
            autoClose: false,
          });
          setOpen(false);
        })
        .catch((err) => {
          setAlert({
            active: true,
            message: err.response.data.message,
            type: 'error',
            autoClose: false,
          });
        });
    } else {
      updatePromo(promo.id, data)
        .then(() => {
          setAlert({
            active: true,
            message: 'Promo actualizada correctamente',
            type: 'success',
            autoClose: false,
          });
          const toAddServices = subtractArray(promo.services, selected).map((item) => item.id);
          toAddServices.map((toAddService) => {
            addService({
              promoId: id,
              serviceId: toAddService,
            });
          });
          const toRemoveServices = subtractArray(selected, promo.services);
          toRemoveServices.map((toRemoveService) => {
            removeService(toRemoveService.PromoService.id);
          });
          setOpen(false);
        })
        .catch((err) => {
          setAlert({
            active: true,
            message: err.response.data.message,
            type: 'error',
            autoClose: false,
          });
        });
    }
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="overflow-hidden">
        <p className="text-sm pb-2 font-bold text-gray-900">Editar promo</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            <div className="col-span-4 sm:col-span-5">
              <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                Nombres
              </label>
              <input
                defaultValue={promo?.name}
                type="text"
                name="name"
                id="name"
                placeholder="Nombre"
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            {/* 
            <div className="col-span-2 sm:col-span-2">
              <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                Categoría
              </label>
              <select
                name="category"
                id="category"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    disabled={category.unavailable}
                    selected={(category.name === promo?.category?.name)}
                  >
                    <p className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">{category.name}</p>
                  </option>))}
              </select>
            </div> */}
            <div className="col-span-2 sm:col-span-3">
              <label htmlFor="price" className="block text-xs font-medium text-gray-700">
                Precio ($)
              </label>
              <div className="inline-flex items-center justify-center gap-x-2 mt-1">
                <input
                  defaultValue={promo?.price}
                  type="number"
                  name="price"
                  id="price"
                  required="required"
                  min="1000"
                  step="500"
                  className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="col-span-5 sm:col-span-7">
              <label htmlFor="service" className="block text-xs font-medium text-gray-700">
                Servicios
              </label>
              <select
                name="service"
                id="service"
                onChange={handleSelect}
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              >
                <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                  Selecione los servicios
                </option>
                {categories?.map((category) => (
                  <optgroup key={category.id} value={category.id} disabled={category.unavailable} label={category.name} className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                    {category?.services.map((service) => (
                      <option key={service.id} value={service.id} disabled={service.unavailable} className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                        {service.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selected.length != 0 && (
                <ul className="inline-flex items-center justify-center gap-x-2 gap-y-1 mt-1 flex-wrap">
                  {selected.map((item) => (
                    <li key={item.id} className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-500">
                      <p className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md">{item.name}</p>
                      <button type="button" onClick={() => handleRemove(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pl-1 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-span-1 sm:col-span-1">
              <label htmlFor="startedAt" className="block text-xs font-medium text-gray-700">
                Status
              </label>
              <div className="py-2">
                <Switch
                  checked={enabled}
                  onChange={handleEnable}
                  inputProps={{ 'aria-label': 'controlled' }}
                  className={`${enabled ? 'bg-green-900' : 'bg-red-700'}
      relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
      pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-8">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                defaultValue={promo?.description}
                name="description"
                id="description"
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
        {!confirmDelete && (
          <div className="flex justify-between">
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={toggleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Actualizar
              </button>
            </div>
          </div>
        )}
        {confirmDelete && (
          <div className="flex flex-col w-full max-w-[264.5px] sm:max-w-none">
            <div className="bg-red-300 p-4 rounded mb-8 sm:p-5">
              <div className="grid grid-cols-6 gap-2 ">
                <div className="grid col-span-6 sm:col-span-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="justify-self-center w-6 h-6 text-red-700">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <label htmlFor="confirmMessage" className="block break-words w-full text-sm font-medium text-red-700 pt-2">
                    {deleteMessage}
                  </label>
                  <input
                    type="text"
                    name="confirmMessage"
                    id="confirmMessage"
                    required="required"
                    className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                  />
                  <div className="flex justify-between">
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={toggleConfirmDelete}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
