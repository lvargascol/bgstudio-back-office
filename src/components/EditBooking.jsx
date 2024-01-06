import { useState, useRef, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import axios from 'axios';
import moment from 'moment';
import { updateBooking, deleteBooking } from '@services/api/bookings';
import endPoints from '@services/api';
export default function EditBooking({ setOpen, setAlert, setReschedule, id }) {
  const formRef = useRef(null);
  const [booking, setBooking] = useState([]);
  const [done, setDone] = useState(true);
  const [depositCheck, setDepositCheck] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMessage = `Esta acción es irreversible ¿Estás seguro de eliminar este reserva? De ser así, escriba la hora de la cita para confirmar`;
  useEffect(() => {
    async function loadBooking() {
      const response = await axios.get(endPoints.bookings.getOneBooking(id));
      setBooking(response.data);
      setDone(response.data.done);
      setDepositCheck(response.data.depositCheck);
    }
    try {
      loadBooking();
    } catch (error) {
      console.error(error);
    }
  }, [alert]);
  const handleDone = () => {
    setDone(!done);
  };
  const handlesDepositCheck = () => {
    setDepositCheck(!depositCheck);
  };
  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };
  const handleReschedule = () => {
    setOpen(false);
    setReschedule(true);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      depositCheck: depositCheck,
      done: done,
      notes: formData.get('notes'),
    };
    if (confirmDelete) {
      deleteBooking(booking.id)
        .then(() => {
          setAlert({
            active: true,
            message: 'Reserva eliminada correctamente',
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
      updateBooking(booking.id, data)
        .then(() => {
          setAlert({
            active: true,
            message: 'Cita actualizada correctamente',
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
    }
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="overflow-hidden">
        <p className="text-sm pb-2 font-bold text-gray-900">Actualizar estado de la reserva</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            <div className="col-span-6 sm:col-span-6 sm:pt-1">
              <p className="text-sm leading-5 text-gray-900">
                {booking?.customer?.firstName} {booking?.customer?.lastName}
              </p>
              <p className="text-sm leading-5 text-gray-900">{moment(booking?.date).format('DD-MM-YYYY hh:mm')}</p>
            </div>
            <div className="col-span-3 sm:col-span-1 pt-1">
              <label htmlFor="startedAt" className="block text-xs font-medium text-gray-700 text-center">
                Pagado
              </label>
              <div className="pt-1 text-center">
                <Switch
                  checked={depositCheck}
                  onChange={handlesDepositCheck}
                  inputProps={{ 'aria-label': 'controlled' }}
                  className={`${depositCheck ? 'bg-green-900' : 'bg-red-700'}
          relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span
                    aria-hidden="true"
                    className={`${depositCheck ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 pt-1">
              <label htmlFor="startedAt" className="block text-xs font-medium text-gray-700 text-center">
                Hecho
              </label>
              <div className="pt-1 text-center">
                <Switch
                  checked={done}
                  onChange={handleDone}
                  inputProps={{ 'aria-label': 'controlled' }}
                  className={`${done ? 'bg-green-900' : 'bg-red-700'}
          relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span
                    aria-hidden="true"
                    className={`${done ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-8">
              <label htmlFor="notes" className="block text-xs font-medium text-gray-700">
                Notas
              </label>
              <input
                type="text"
                name="notes"
                id="notes"
                defaultValue=""
                placeholder="(Opcional)"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        {!confirmDelete && (
          <div className="flex justify-between">
            <div className="px-4 py-3  text-right sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={toggleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
            <div className="px-4 py-3  text-right sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleReschedule}
              >
                Reagendar
              </button>
            </div>
            <div className="px-4 py-3 text-right sm:px-6">
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
                    required
                    placeholder={moment(booking?.date).format('hh:mm')}
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
