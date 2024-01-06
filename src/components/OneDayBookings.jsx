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
import RescheduleBooking from '@components/RescheduleBooking';
import ViewMember from '@components/ViewMember';
export default function OneDayBookings({ date }) {
  const auth = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [id, setId] = useState(null);
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
  // const handleView = (id) => {
  //   setId(id);
  //   setOpenView(true);
  //   setOpenReschedule(true);
  // };
  const handleSort = (bookings) => {
    // setBookings(bookings.toSorted((firstBooking,secondBooking) => moment(firstBooking.date).format('X') - moment(secondBooking.date).format('X')));
    return bookings.toSorted((firstBooking, secondBooking) => moment(firstBooking.date).format('X') - moment(secondBooking.date).format('X'));
  };
  return (
    <ul className="divide-y divide-gray-200">
      <Alert alert={alert} handleClose={toggleAlert} />
      {bookings.map((booking) => (
        <li key={`booking-${booking.id}`} className="py-1 px-2">
          <Disclosure as="div">
            {() => (
              <>
                <Disclosure.Button as="div" className="grid grid-cols-9 sm:grid-cols-12 py-1">
                  <div className="col-span-1 sm:col-span-1 flex flex-col justify-center">
                    <p className="col-span-3 text-sm font-semibold leading-5 text-gray-900 py-0 "> {moment(booking.date).format('HH:mm')}</p>
                  </div>
                  <div className="col-span-7 sm:col-span-10 grid grid-cols-10 sm:grid-cols-12 px-4">
                    <p className="col-span-8 sm:col-span-4 text-xs leading-5 text-gray-900 py-0">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </p>
                    <p className="col-span-2 sm:col-span-2 text-xs leading-5 text-gray-900 py-0 text-end sm:text-start">${booking.cost}</p>
                    {/* <div className="col-span-3"></div> */}
                    <p className="col-span-9 sm:col-span-5 text-xs leading-5 text-gray-900 py-0 sm:text-start">
                      {booking.specialist.firstName} {booking.specialist.lastName}
                    </p>
                    <div className="col-span-1 sm:col-span-1 flex items-center pl-3.5">
                      {booking.depositCheck ? (
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
                    {/* {booking.done ? (
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
                    )} */}
                  </div>
                  <div className="col-span-1 sm:col-span-1 justify-between">
                    <div className="flex flex-col content-center justify-center">
                      <div className="col-span-2 sm:col-span-1">
                        <button type="button" className="flex gap-x-2" onClick={() => handleEdit(booking.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                      </div>
                      {/* <div className="col-span-2 sm:col-span-1">
                        <button type="button" className="flex gap-x-2" onClick={() => handleView(booking.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div> */}
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
                      {booking.notes != '' && <p className="mt-1 truncate text-xs leading-3 text-gray-500">Notas: {booking.notes}</p>}
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
          <span className="text-sm leading-4 text-gray-600">Agregar nueva cita</span>
        </button>
      </li>
      <li className="py-4 px-2">
        <button type="button" className="flex gap-x-2" onClick={handleSort}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-gray-600	">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span className="text-sm leading-4 text-gray-600">Sort</span>
        </button>
      </li>
      <Modal open={openEdit} setOpen={setOpenEdit}>
        <EditBooking setOpen={setOpenEdit} setAlert={setAlert} setReschedule={setOpenReschedule} id={id} />
      </Modal>
      <Modal open={openView} setOpen={setOpenView}>
        <ViewMember setOpen={setOpenView} setAlert={setAlert} id={id} />
      </Modal>
      <Modal open={openAdd} setOpen={setOpenAdd}>
        <NewBooking setOpen={setOpenAdd} setAlert={setAlert} />
      </Modal>
      <Modal open={openReschedule} setOpen={setOpenReschedule}>
        <RescheduleBooking setOpen={setOpenReschedule} setAlert={setAlert} id={id} />
      </Modal>
    </ul>
  );
}
