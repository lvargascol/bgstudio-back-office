import { useState, useRef, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import axios from 'axios';
import moment from 'moment';
import { updateBooking, deleteBooking } from '@services/api/bookings';
import { createPayment, updatePayment } from '@services/api/payments';
import endPoints from '@services/api';
export default function EditBooking({ setOpen, setAlert, setReschedule, id }) {
  const formRef = useRef(null);
  const [booking, setBooking] = useState([]);
  const [order, setOrder] = useState([]);
  const [payments, setPayments] = useState([]);
  const [done, setDone] = useState(true);
  const [enableNewPayment, setEnableNewPayment] = useState(false);
  const [totallyPaid, setTotallyPaid] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [paymentDataMissing, setPaymentDataMissing] = useState(false);
  const deleteMessage = `Esta acción es irreversible ¿Estás seguro de eliminar este reserva? De ser así, escriba la hora de la cita para confirmar`;
  const paymentTypes = {
    english: ['cash', 'transfer', 'debit', 'credit'],
    spanish: ['efectivo', 'transferencia', 'débito', 'crédito'],
  };
  useEffect(() => {
    async function loadBooking() {
      const response = await axios.get(endPoints.bookings.getOneBooking(id));
      setBooking(response.data);
      const orderResponse = await axios.get(endPoints.orders.getOneOrder(response.data.orderId));
      setOrder(orderResponse.data);
      setDone(response.data.done);
      setPayments(
        orderResponse.data.payments.map((payment) => ({
          id: payment.id,
          confirmed: payment.confirmed,
        }))
      );
      setTotallyPaid(orderResponse.data.paymentsTotal >= orderResponse.data.bookingsTotal);
    }
    try {
      loadBooking();
    } catch (error) {
      console.error(error);
    }
  }, [alert, enableNewPayment]);
  const handleDone = () => {
    setDone(!done);
  };
  const handleConfirmPayment = (id) => {
    setPayments(
      payments.map((payment) =>
        id === payment.id
          ? {
              id: payment.id,
              confirmed: !payment.confirmed,
            }
          : {
              id: payment.id,
              confirmed: payment.confirmed,
            }
      )
    );
  };
  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };
  const handleReschedule = () => {
    setOpen(false);
    setReschedule(true);
  };
  const handleNewPayment = () => {
    setEnableNewPayment(true);
  };
  const addNewPayment = () => {
    const formData = new FormData(formRef.current);
    const data = {
      amount: parseInt(formData.get('amount')),
      confirmed: false,
      type: formData.get('type'),
      orderId: order.id,
    };
    if (data.amount && data.type) {
      createPayment(data);
      setPaymentDataMissing(false);
      setEnableNewPayment(false);
    } else {
      setPaymentDataMissing(true);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
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
          payments.forEach((payment) => {
            updatePayment(payment.id, {
              confirmed: payment.confirmed,
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
    }
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <div className="overflow-hidden ">
        <p className="text-xs pb-0 font-bold text-gray-900">Actualizar estado de la reserva</p>
        <div className="px-2 py-1 bg-white sm:p-4 sm:pt-1 border-b">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            <div className="col-span-5 sm:col-span-7 flex gap-x-2 items-end pb-1 flex-wrap">
              {/* <div className="h-4 sm:block"></div> */}
              <p className="text-xs leading-5 text-gray-900">
                {booking?.customer?.firstName} {booking?.customer?.lastName}
              </p>
              <p className="text-xs leading-5 text-gray-900 ">{moment(booking?.date).format('DD MMM YYYY hh:mm a')}</p>
              <p className="text-xs leading-5 text-gray-900 ">Total orden: {order?.bookingsTotal}</p>
              <p className="text-xs leading-5 text-gray-900 ">Total pagado: {order?.paymentsTotal}</p>
            </div>
            <div className="col-span-1 sm:col-span-1 pt-1">
              <label htmlFor="startedAt" className="block text-xs font-medium text-gray-700 text-center">
                Hecho
              </label>
              <div className="pt-1 text-center">
                <Switch
                  checked={done}
                  onChange={handleDone}
                  disabled={order?.paymentsTotal < order?.bookingsTotal}
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
                Agregar o modificar nota
              </label>
              <input
                type="text"
                name="notes"
                id="notes"
                defaultValue={booking.notes}
                placeholder="(Opcional)"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <p className="text-xs py-2 font-bold text-gray-900">Pagos</p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-x-2 px-2 pb-1 sm:px-4 sm:pt-1">
          <div className="col-span-6 sm:col-span-8">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-x-0 pb-1">
              <div className="col-span-2 sm:col-span-4">
                <p className="block text-xs font-medium text-gray-700">Fecha y hora</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="block text-xs font-medium text-gray-700">Monto</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="block text-xs font-medium text-gray-700">Tipo</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="block text-xs font-medium text-gray-700 text-center">Confirmar</p>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {order?.payments?.map((payment, index) => (
                <li key={`payment-${payment.id}`} className="pt-1">
                  <div className="grid grid-cols-5 sm:grid-cols-10">
                    <div className="col-span-4 hidden sm:block">
                      <p className="text-xs leading-5 text-gray-900">{moment(payment?.createdAt).format('DD-MMM-YYYY hh:mm a')}</p>
                    </div>
                    <div className="col-span-2 sm:hidden">
                      <p className="text-xs leading-5 text-gray-900">{moment(payment?.createdAt).format('DD-MM-YY hh:mm a')}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <p className="text-xs leading-5 text-gray-900">{payment?.amount}</p>
                    </div>
                    <div className="col-span-2 hidden sm:block">
                      <p className="text-xs leading-5 text-gray-900">{payment?.type?.charAt(0).toLocaleUpperCase().concat(payment?.type?.slice(1))}</p>
                    </div>
                    <div className="col-span-1 sm:hidden">
                      <p className="text-xs leading-5 text-gray-900">{payment?.type?.charAt(0).toLocaleUpperCase().concat(payment?.type?.slice(1, 8))}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 text-center">
                      <Switch
                        checked={payments[index].confirmed}
                        onChange={() => handleConfirmPayment(payment.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        className={`flex-right ${
                          payments[index].confirmed ? 'bg-green-900' : 'bg-red-700'
                        } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        disabled={booking.done}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            payments[index].confirmed ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {!enableNewPayment && !totallyPaid && (
              <div className="col-span-6 sm:col-span-8">
                <button type="button" onClick={handleNewPayment} className="text-xs font-semibold text-bgPink-600 hover:text-bgPink-500 pb-2">
                  Agregar nuevo pago
                </button>
              </div>
            )}
          </div>
          {enableNewPayment && !totallyPaid && (
            <div className="col-span-8 sm:col-span-8 grid grid-cols-8 sm:grid-cols-8 gap-x-2">
              <div className="col-span-8 sm:col-span-8">
                <p className="text-xs py-2 font-bold text-gray-900">Nuevo pago</p>
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label htmlFor="amount" className="block text-xs font-medium text-gray-700">
                  Monto ($)
                </label>
                <div className="inline-flex items-center justify-center gap-x-2 mt-1">
                  <input
                    defaultValue={order.paymentsTotal ? order?.bookingsTotal - order?.paymentsTotal : order?.bookingsTotal / 2}
                    type="number"
                    name="amount"
                    id="amount"
                    // required="required"
                    min="1000"
                    max={order?.bookingsTotal - order?.paymentsTotal}
                    step="500"
                    className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="col-span-4 sm:col-span-4">
                <label htmlFor="type" className="block text-xs font-medium text-gray-700">
                  Tipo
                </label>
                <select name="type" id="type" className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md">
                  <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                    Tipo de pago
                  </option>
                  {paymentTypes.spanish.map((type) => (
                    <option key={type} value={type} disabled={type.unavailable} className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                      {type.charAt(0).toLocaleUpperCase().concat(type.slice(1))}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-8 sm:col-span-1">
                <div className="h-4 hidden sm:block"></div>
                <div className="">
                  <button
                    type="button"
                    className="gap-x-2 border text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-xs border-gray-300 rounded-md "
                    onClick={addNewPayment}
                  >
                    <div className="grid place-content-center h-8 p-0.5">
                      <p className="sm:hidden text-xs font-medium text-gray-700">Agregar pago</p>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-gray-700 hidden sm:block">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              {paymentDataMissing && (
                <div className="col-span-6 sm:col-span-8">
                  <p className="text-xs font-semibold text-red-600 py-2">Ingrese monto y tipo de pago</p>
                </div>
              )}
            </div>
          )}
        </div>
        {!confirmDelete && (
          <div className="flex justify-between pt-2">
            <div className="px-2 py-3 text-right sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-3 sm:px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={toggleConfirmDelete}
                disabled={payments.length != 0}
              >
                Eliminar
              </button>
            </div>
            <div className="px-2 py-3  text-right sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-3 sm:px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleReschedule}
                disabled={payments.length != 0}
              >
                Reagendar
              </button>
            </div>
            <div className="px-2 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-3 sm:px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        className="inline-flex justify-center py-2 px-3 sm:px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={toggleConfirmDelete}
                        disabled={payments.length != 0}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div className="px-0 pt-3 text-right sm:px-0">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-3 sm:px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
