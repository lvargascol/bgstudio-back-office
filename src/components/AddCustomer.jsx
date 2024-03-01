import { useRef } from 'react';
import { createCustomer } from '@services/api/customers';
export default function AddCustomer({ setOpen, setAlert }) {
  const formRef = useRef(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      user: {
        email: formData.get('email'),
      },
    };
    createCustomer(data)
      .then(() => {
        setAlert({
          active: true,
          message: 'Nuevo cliente creado correctamente',
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
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="overflow-hidden">
        <p className="text-sm pb-2 font-bold text-gray-900">Añadir miembro</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                Nombres
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Nombre"
                required="required"
                // pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                Apellidos
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Apellido"
                required="required"
                // pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
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
                type="email"
                name="email"
                id="email"
                placeholder="correo@mail.com"
                required="required"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
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
