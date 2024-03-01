import { useState, useRef } from 'react';
import useFetch from '@hooks/useFetch';
import { createSpecialist, addService } from '@services/api/specialists';
import endPoints from '@services/api';
export default function AddMember({ setOpen, setAlert }) {
  const formRef = useRef(null);
  const categories = useFetch(endPoints.categories.getAllCategory);
  const [selected, setSelected] = useState([]);
  const handleSelect = () => {
    const selectedId = parseInt(new FormData(formRef.current).get('category'));
    const found = selected.find((item) => item.id === selectedId);
    if (!found) {
      categories.map((category) => (category.id === selectedId ? setSelected([...selected, category]) : selectedId));
    }
    selected.forEach((category) => {
      category.services.forEach((service) => {
        console.log(service);
      });
    });
  };
  const handleRemove = (category) => {
    setSelected(selected.filter((item) => item.id != category.id));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      position: formData.get('position'),
      startedAt: Date.parse(formData.get('startedAt')),
      birthday: Date.parse(formData.get('birthday')),
      user: {
        email: formData.get('email'),
        password: 'password',
        role: 'specialist',
      },
    };
    createSpecialist(data)
      .then((response) => {
        setAlert({
          active: true,
          message: 'Especialista creado correctamente',
          type: 'success',
          autoClose: false,
        });
        selected.forEach((category) => {
          category.services.forEach((service) => {
            const toAddService = {
              specialistId: response.id,
              serviceId: service.id,
            };
            console.log(toAddService);
            addService(toAddService);
          });
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
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="overflow-hidden">
        <p className="text-sm pb-2 font-bold text-gray-900">Añadir miembro</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                Nombres
              </label>
              <input
                // defaultValue={product?.title}
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Nombre"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                Apellidos
              </label>
              <input
                // defaultValue={product?.title}
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Apellido"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="birthday" className="block text-xs font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <input
                // defaultValue={product?.title}
                type="date"
                name="birthday"
                id="birthday"
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="phone" className="block text-xs font-medium text-gray-700">
                Teléfono
              </label>
              <div className="inline-flex items-center justify-center gap-x-2 mt-1">
                <p className="text-xs font-medium text-gray-700">+56</p>
                <input
                  // defaultValue={product?.title}
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="9 XXXX XXXX"
                  required="required"
                  pattern="[0-9]{9}"
                  className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                // defaultValue={product?.title}
                type="email"
                name="email"
                id="email"
                placeholder="correo@mail.com"
                required="required"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="position" className="block text-xs font-medium text-gray-700">
                Cargo / Ocupación
              </label>
              <input
                // defaultValue={product?.title}
                type="text"
                name="position"
                id="position"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                placeholder="Cargo"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="startedAt" className="block text-xs font-medium text-gray-700">
                Inicio de Actividades
              </label>
              <input
                // defaultValue={product?.title}
                type="date"
                name="startedAt"
                id="startedAt"
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-6">
              <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                Categoría de servicios
              </label>
              <select
                name="category"
                id="category"
                onChange={handleSelect}
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              >
                <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                  Selecione los servicios
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id} disabled={category.unavailable} label={category.name} className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap"></option>
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
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Añadir
          </button>
        </div>
      </div>
    </form>
  );
}
