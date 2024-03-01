import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '@hooks/useAuth';
import useAlert from '@hooks/useAlert';
import endPoints from '@services/api';
import Modal from '@common/Modal';
import Alert from '@common/Alert';
import NewBooking from '@components/NewBooking';
import EditBooking from '@components/EditBooking';
import ViewOrder from '@components/ViewOrder';
import RescheduleBooking from '@components/RescheduleBooking';
import AddCustomer from '@components/AddCustomer';
export default function OneDayBookings({ date }) {
  const auth = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [id, setId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { alert, setAlert, toggleAlert } = useAlert();
  useEffect(() => {
    auth.user ? [] : router.push('/login');
    async function loadBookings() {
      const response = await axios.get(endPoints.bookings.getBookingByDate(date));
      setBookings(response.data);
      setBookings(handleSort(response.data));
    }
    try {
      loadBookings();
    } catch (error) {
      console.error(error);
    }
  }, [alert, date]);
  const handleEdit = (id) => {
    setId(id);
    setOpenEdit(true);
  };
  const handleView = (id) => {
    setOrderId(id);
    setOpenView(true);
  };
  const handleSort = (bookings) => {
    return bookings.toSorted((firstBooking, secondBooking) => moment(firstBooking.date).format('X') - moment(secondBooking.date).format('X'));
  };
  return (
    <ul className="divide-y divide-gray-200">
      <Alert alert={alert} handleClose={toggleAlert} />
      <li className="py-2 px-2">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-9 sm:grid-cols-12 ">
            <div className="col-span-1 sm:col-span-1 min-w-0">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Hora</p>
            </div>
            <div className="col-span-7 sm:col-span-10 grid grid-cols-10 sm:grid-cols-12 min-w-0 ">
              <div className="col-span-3 sm:col-span-4 min-w-0 ">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Cliente</p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 ">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Monto</p>
              </div>
              <div className="col-span-3 sm:col-span-4 min-w-0 ">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Especialista</p>
              </div>
              <div className="col-span-1 sm:col-span-1 min-w-0 hidden sm:block">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Abono</p>
              </div>
              <div className="col-span-1 sm:col-span-1 min-w-0 hidden sm:block">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">Hecho</p>
              </div>
              <div className="col-span-1 sm:col-span-1 min-w-0 sm:hidden pl-4">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">A</p>
              </div>
              <div className="col-span-1 sm:col-span-1 min-w-0 sm:hidden pl-4">
                <p className="mt-1 truncate text-xs leading-4 text-gray-900">H</p>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-1 justify-between"></div>
          </div>
        </div>
      </li>
      {bookings.map((booking) => (
        <li key={`booking-${booking.id}`} className="py-1 px-2">
          <Disclosure as="div">
            {() => (
              <>
                <Disclosure.Button as="div" className="grid grid-cols-9 sm:grid-cols-12 py-1">
                  <div className="col-span-1 sm:col-span-1 flex flex-col justify-center">
                    <p className="col-span-3 text-xs font-semibold leading-5 text-gray-900 py-0 "> {moment(booking.date).format('HH:mm')}</p>
                  </div>
                  <div className="col-span-7 sm:col-span-10 grid grid-cols-10 sm:grid-cols-12">
                    <p className="col-span-3 sm:col-span-4 text-xs leading-5 text-gray-900 py-0">
                      {booking?.customer?.firstName} {booking?.customer?.lastName}
                    </p>
                    <p className="col-span-2 sm:col-span-2 text-xs leading-5 text-gray-900 py-0 ">${booking.cost}</p>
                    <p className="col-span-3 sm:col-span-4 text-xs leading-5 text-gray-900 py-0 sm:text-start">
                      {booking?.specialist?.firstName} {booking?.specialist?.lastName}
                    </p>
                    <div className="col-span-1 sm:col-span-1 flex items-center pl-3.5">
                      {booking?.depositCheck ? (
                        <div className="flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="">
                          <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                            <div className="h-2 w-2 rounded-full bg-red-700" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-1 sm:col-span-1 flex items-center pl-3.5">
                      {booking.done ? (
                        <div className="flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                            <div className="h-2 w-2 rounded-full bg-red-700" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-1 grid grid-cols-2 sm:grid-cols-2 gap-x-2">
                    <div className="col-span-1 sm:col-span-1 grid">
                      <button type="button" className="flex gap-x-2 justify-self-end" onClick={() => handleEdit(booking.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="col-span-1 sm:col-span-1 grid">
                      <button type="button" className="flex gap-x-2 justify-self-end" onClick={() => handleView(booking.orderId)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600">
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
                </Disclosure.Button>
                <Disclosure.Panel className="flex justify-between bg-gray-50 px-4 pb-2 rounded-sm">
                  <div className="flex gap-x-4">
                    <div className="min-w-0 flex-auto">
                      {/* <p className="text-sm leading-5 text-gray-900">{booking.specialist.firstName}</p> */}
                      <div className="flex gap-x-1">
                        {booking.promos.map((promo, index) => (
                          <p key={promo.id} className="mt-1 text-xs leading-3 text-gray-500">
                            {promo.name}
                            {index + 1 >= booking.promos.length ? '' : ','}
                          </p>
                        ))}
                      </div>
                      <div className="flex gap-x-1">
                        {booking.services.map((service, index) => (
                          <p key={service.id} className="mt-1 text-xs leading-3 text-gray-500">
                            {service.name}
                            {index + 1 >= booking.services.length ? '' : ','}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </li>
      ))}
      <li className="py-4 px-2">
        <button type="button" className="flex gap-x-2" onClick={() => setOpenAdd(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-gray-600	">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span className="text-xs leading-4 text-gray-600">Agregar nueva cita</span>
        </button>
      </li>
      <Modal open={openEdit} setOpen={setOpenEdit}>
        <EditBooking setOpen={setOpenEdit} setAlert={setAlert} setReschedule={setOpenReschedule} id={id} />
      </Modal>
      <Modal open={openAdd} setOpen={setOpenAdd}>
        <NewBooking setOpen={setOpenAdd} setAlert={setAlert} alert={alert} setOpenCustomer={setOpenAddCustomer} />
      </Modal>
      <Modal open={openReschedule} setOpen={setOpenReschedule}>
        <RescheduleBooking setOpen={setOpenReschedule} setAlert={setAlert} id={id} />
      </Modal>
      <Modal open={openAddCustomer} setOpen={setOpenAddCustomer}>
        <AddCustomer setOpen={setOpenAddCustomer} setAlert={setAlert} />
      </Modal>
      <Modal open={openView} setOpen={setOpenView}>
        <ViewOrder setOpen={setOpenView} setAlert={setAlert} id={orderId} />
      </Modal>
    </ul>
  );
}
