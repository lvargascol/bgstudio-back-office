import { useRef } from 'react';
import { useRouter } from 'next/router';
import { createUser } from '@services/api/users'

export default function FormProduct({ setOpen, setAlert }) {
  const formRef = useRef(null);
  const router = useRouter();
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    };


    createUser(data)
      .then(() => {
        setAlert({
          active: true,
          message: 'Usuario creado correctamente',
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
          <div className="grid grid-cols-6 gap-2">


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

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                Contraseña
              </label>
              <input
                // defaultValue={product?.title}
                type="password"
                name="password"
                id="password"
                placeholder="Contraseña"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="role" className="block text-xs font-medium text-gray-700">
                Rol
              </label>
              <input
                // defaultValue={product?.title}
                type="text"
                name="role"
                id="role"
                placeholder="Rol"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
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