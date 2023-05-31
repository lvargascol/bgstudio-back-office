import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Switch } from '@headlessui/react'
import axios from 'axios';
import { updateSpecialist, deleteSpecialist } from '@services/api/specialists'
import endPoints from "@services/api";

export default function FormProduct({ setOpen, setAlert, id }) {
  const formRef = useRef(null);
  const router = useRouter();

  const [specialist, setSpecialist] = useState([]);
  const [enabled, setEnabled] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteMessage = `Esta acción es irreversible ¿Estás seguro de eliminar este miembro? De ser así, escriba "${specialist?.firstName} ${specialist?.lastName}" para confirmar`;

  useEffect(() => {
    async function loadSpecialist() {
      const response = await axios.get(endPoints.specialists.getOneSpecialist(id));
      setSpecialist(response.data);
      setEnabled(response.data.active);
    }
    try {
      loadSpecialist();
    } catch (error) {
      console.log(error)
    }
  }, [alert])

  const handleEnable = () => {
    setEnabled(!enabled);
  };

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
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
      active: enabled,
    };

    if (confirmDelete) {
      deleteSpecialist(specialist.id)
        .then(() => {
          setAlert({
            active: true,
            message: 'Especialista eliminado correctamente',
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
      updateSpecialist(specialist.id, data)
        .then(() => {
          setAlert({
            active: true,
            message: 'Especialista actualizado correctamente',
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
        <p className="text-sm pb-2 font-bold text-gray-900">Editar miembro</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                Nombres
              </label>
              <input
                defaultValue={specialist?.firstName}
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Nombre"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                Apellidos
              </label>
              <input
                defaultValue={specialist?.lastName}
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Apellido"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="birthday" className="block text-xs font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <input
                defaultValue={specialist?.birthday?.substring(0, 10)}
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
              <div className='inline-flex items-center justify-center gap-x-2 mt-1'>
                <p className='text-xs font-medium text-gray-700'>+56</p>
                <input
                  defaultValue={specialist?.phone}
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="9 XXXX XXXX"
                  required="required"
                  pattern="[0-9]{9}"
                  className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                /></div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                defaultValue={specialist?.user?.email}
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
              <label htmlFor="position" className="block text-xs font-medium text-gray-700">
                Cargo / Ocupación
              </label>
              <input
                defaultValue={specialist?.position}
                type="text"
                name="position"
                id="position"
                required="required"
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ/]{1,20}$"
                placeholder="Cargo"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="startedAt" className="block text-xs font-medium text-gray-700">
                Inicio de Actividades
              </label>
              <input
                defaultValue={specialist?.startedAt?.substring(0, 10)}
                type="date"
                name="startedAt"
                id="startedAt"
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
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
          </div>
        </div>

        {!confirmDelete && (<div className='flex justify-between'>
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