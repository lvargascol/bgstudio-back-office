import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Switch } from '@headlessui/react'
import axios from 'axios';
import { updateUser, deleteUser } from '@services/api/users'
import endPoints from "@services/api";

export default function FormProduct({ setOpen, setAlert, id }) {
  const formRef = useRef(null);
  const router = useRouter();

  const [user, setUser] = useState([]);
  const [passMatch, setPassMatch] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const deleteMessage = `Esta acción es irreversible ¿Estás seguro de eliminar este miembro? De ser así, escriba "${user?.email}" para confirmar`;

  useEffect(() => {
    async function loadUser() {
      const response = await axios.get(endPoints.users.getOneUser(id));
      setUser(response.data);
      // setEnabled(response.data.active);
    }
    try {
      loadUser();
    } catch (error) {
      console.log(error)
    }
  }, [alert])

  // const handleEnable = () => {
  //   setEnabled(!enabled);
  // };

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const toggleConfirmReset = () => {
    setConfirmReset(!confirmReset);
  };

  const equal = (pass1, pass2) => {
    return (pass1 === pass2);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      email: formData.get('email'),
      role: formData.get('role'),
    };

    setPassMatch(equal(formData.get('password'),formData.get('password2')));

    const pass = {
      password: formData.get('password'),
    };

    if (confirmDelete) {
      deleteUser(user.id)
        .then(() => {
          setAlert({
            active: true,
            message: 'Usuario eliminado correctamente',
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
    } else if (confirmReset && !(formData.get('password') === formData.get('password2'))) {
      return;
    } else if (confirmReset && (formData.get('password') === formData.get('password2'))) {
      updateUser(user.id, pass)
        .then(() => {
          setAlert({
            active: true,
            message: 'Contraseña de usuario restaurada correctamente',
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
      updateUser(user.id, data)
        .then(() => {
          setAlert({
            active: true,
            message: 'Usuario actualizado correctamente',
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
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="overflow-hidden">
        <div className='pb-2'>
          <p className="text-sm font-bold text-gray-900">Editar usuario</p>
          {user?.specialist && (<p className="text-xs font-medium text-gray-700">{user?.specialist?.firstName} {user?.specialist?.lastName} - {user?.specialist?.position}</p>)}
          {user?.customer && (<p className="text-xs font-medium text-gray-700">{user?.customer?.firstName} {user?.customer?.lastName} - Cliente</p>)}
        </div>
        <div className="px-4 pt-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2">

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                defaultValue={user?.email}
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
              <label htmlFor="role" className="block text-xs font-medium text-gray-700">
                Rol
              </label>
              <input
                defaultValue={user?.role}
                type="text"
                name="role"
                id="role"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ/]{1,20}$"
                placeholder="Cargo"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                disabled={user?.specialist}
              />
            </div>

          </div>
        </div>

        {(!confirmDelete && !confirmReset) && (<div className='flex justify-between'>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={toggleConfirmDelete}
              disabled={(user?.specialist || user?.customer)}
            >
              Eliminar
            </button>
          </div>


          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={toggleConfirmReset}
            >
              Contraseña
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
        </div>)}

        {confirmDelete && (
          <div className="flex flex-col w-full max-w-[264.5px] sm:max-w-none">
            <div className="bg-red-300 p-4 rounded mb-8 sm:p-5">
              <div className="grid grid-cols-6 gap-2 ">

                <div className="grid col-span-6 sm:col-span-6">

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="justify-self-center w-6 h-6 text-red-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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
                  <div className='flex justify-between'>
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        onClick={toggleConfirmDelete}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

        {confirmReset && (
          <div className="flex flex-col w-full max-w-[264.5px] sm:max-w-none">
            <div className="bg-gray-200 p-4 rounded mb-8 sm:p-5">
              <div className="grid grid-cols-6 gap-2 ">

                <div className="grid col-span-6 sm:col-span-6">
                  <label htmlFor="password" className="block break-words w-full text-sm font-medium text-gray-900 pt-2">
                    Ingrese nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Contraseña mayor a 8 dígitos"
                    required="required"
                    pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{8,20}$"
                    className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                  />
                  <label htmlFor="password2" className="block break-words w-full text-sm font-medium text-gray-900 pt-2">
                    Confirme su contraseña
                  </label>
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    placeholder="Contraseña mayor a 8 dígitos"
                    required="required"
                    pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{8,20}$"
                    className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                  />
                  {!passMatch && (<p className="text-xs pt-1 font-medium text-red-700">Contraseña no coincide</p>)}
                  <div className='flex justify-between'>
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        onClick={toggleConfirmReset}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Confirmar
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