import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import { useAuth } from '@hooks/useAuth';
import { createBooking, addService, addPromo, deleteBooking } from '@services/api/bookings';
import endPoints from '@services/api';
export default function RescheduleBooking({ setOpen, setAlert, id }) {
  const formRef = useRef(null);
  const auth = useAuth();
  const booking = useFetch(endPoints.bookings.getOneBooking(id));
  const categories = useFetch(endPoints.categories.getAllCategory);
  const promos = useFetch(endPoints.promos.getAllPromo);
  const services = useFetch(endPoints.services.getAllService);
  const specialists = useFetch(endPoints.specialists.getAllSpecialist);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [date, setDate] = useState(false);
  const [finalStep, setFinalStep] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  useEffect(() => {
    async function loadSchedule(date) {
      const response = await axios.get(endPoints.bookings.getScheduleByDate(date));
      setSchedule(response.data);
    }
    if (date) {
      try {
        loadSchedule(date);
        setSelectedTime([]);
        enableSubmit();
      } catch (error) {
        console.error(error);
      }
    }
  }, [alert, date]);
  useEffect(() => {
    availableCheck();
    enableSubmit();
    enableNext();
  }, [selectedService, selectedPromo, schedule, selectedTime]);
  const availableCheck = () => {
    const servicesMinutes = selectedService.reduce((accumulator, service) => accumulator + service.minutes, 0);
    const promosMinutes = selectedPromo.reduce((accumulator, promo) => accumulator + promo.minutes, 0);
    const bookingMinutes = servicesMinutes + promosMinutes;
    const availableArray = [];
    for (let i = 0; i < schedule.length; i++) {
      const element = schedule[i];
      const check = schedule.slice(i, i + Math.ceil(bookingMinutes / 15));
      const time = bookingMinutes <= 15 ? element.min : check.reduce((accumulator, item) => accumulator + item.min, 0);
      const free = time >= bookingMinutes;
      availableArray.push({
        time: element.time,
        min: time,
        free: free,
      });
    }
    setAvailable(availableArray);
  };
  const enableSubmit = () => {
    if (selectedTime.length != 0 && (selectedService != 0 || selectedPromo != 0)) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };
  const enableNext = () => {
    if (selectedService != 0 || selectedPromo != 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  };
  const handleNext = () => {
    setDate(moment(booking.date).format('YYYY-MM-DD'));
    setFinalStep(true);
  };
  const handleBack = () => {
    setSelectedService([]);
    setSelectedPromo([]);
    setFinalStep(false);
    setSchedule([]);
  };
  const handleSelectService = () => {
    const selectedId = parseInt(new FormData(formRef.current).get('service'));
    const found = selectedService.find((item) => item.id === selectedId);
    if (!found) {
      services.map((service) => (service.id === selectedId ? setSelectedService([...selectedService, service]) : selectedId));
    }
  };
  const handleSelectPromo = () => {
    const selectedId = parseInt(new FormData(formRef.current).get('promo'));
    const found = selectedPromo.find((item) => item.id === selectedId);
    if (!found) {
      promos.map((promo) => (promo.id === selectedId ? setSelectedPromo([...selectedPromo, promo]) : selectedId));
    }
  };
  const handleRemoveService = (service) => {
    setSelectedService(selectedService.filter((item) => item.id != service.id));
  };
  const handleRemovePromo = (promo) => {
    setSelectedPromo(selectedPromo.filter((item) => item.id != promo.id));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const day = moment(formData.get('date')).format('YYYY-MM-DD');
    const data = {
      date: moment(`${day}T${selectedTime}`).utc().format(),
      cost: 0,
      minutes: 0,
      depositCheck: false,
      done: false,
      customerId: booking.customer.id,
      specialistId: parseInt(new FormData(formRef.current).get('specialist')),
      order: {
        userId: auth.user.id,
      },
    };
    createBooking(data)
      .then((response) => {
        setAlert({
          active: true,
          message: 'Cita reagendada correctamente',
          type: 'success',
          autoClose: false,
        });
        selectedService.forEach((service) => {
          const toAddService = {
            bookingId: response.id,
            serviceId: service.id,
          };
          addService(toAddService);
        });
        selectedPromo.forEach((promo) => {
          const toAddPromo = {
            bookingId: response.id,
            promoId: promo.id,
          };
          addPromo(toAddPromo);
        });
        deleteBooking(booking.id);
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
        <p className="text-sm pb-2 font-bold text-gray-900">Reagendar reserva</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          {!finalStep && (
            <div className="grid grid-cols-8 sm:grid-cols-8 gap-2">
              <div className="col-span-8 sm:col-span-8">
                <label htmlFor="customer" className="block text-xs font-medium text-gray-700">
                  Cliente
                </label>
                <select
                  name="customer"
                  id="customer"
                  onChange={enableNext}
                  className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                  disabled
                >
                  <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                    {booking?.customer?.firstName} {booking?.customer?.lastName}
                  </option>
                </select>
              </div>
              <div className="col-span-8 sm:col-span-4">
                <label htmlFor="promo" className="block text-xs font-medium text-gray-700">
                  Promociones
                </label>
                <select
                  name="promo"
                  id="promo"
                  onChange={handleSelectPromo}
                  className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                >
                  <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                    Selecione las promociones
                  </option>
                  {promos?.map((promo) => (
                    <option key={promo.id} value={promo.id} disabled={promo.unavailable} className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                      {promo.name}
                    </option>
                  ))}
                </select>
                {selectedPromo.length != 0 && (
                  <ul className="inline-flex items-center justify-left gap-x-2 gap-y-1 mt-1 flex-wrap">
                    {selectedPromo.map((item) => (
                      <li key={item.id} className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-500">
                        <p className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md">{item.name}</p>
                        <button type="button" onClick={() => handleRemovePromo(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pl-1 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-span-8 sm:col-span-4">
                <label htmlFor="service" className="block text-xs font-medium text-gray-700">
                  Servicios
                </label>
                <select
                  name="service"
                  id="service"
                  onChange={handleSelectService}
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
                {selectedService.length != 0 && (
                  <ul className="inline-flex items-center justify-left gap-x-2 gap-y-1 mt-1 flex-wrap">
                    {selectedService.map((item) => (
                      <li key={item.id} className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-500">
                        <p className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md">{item.name}</p>
                        <button type="button" onClick={() => handleRemoveService(item)}>
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
          )}
          {finalStep && (
            <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
              <div className="col-span-4 sm:col-span-12">
                <p className="text-xs leading-5 text-gray-900 py-0">
                  {booking?.customer?.firstName} {booking?.customer?.lastName}
                </p>
                {selectedPromo.length != 0 && (
                  <div className="col-span-8 sm:col-span-8">
                    <ul className="inline-flex items-center justify-left gap-x-1 gap-y-0 mt-0 flex-wrap">
                      <li key="title" className="min-w-0 flex gap-x-4">
                        <p className="text-xs leading-5 text-gray-900 py-0">Promociones: </p>
                      </li>
                      {selectedPromo.map((item, index) => (
                        <li key={item.id} className="min-w-0 flex gap-x-0">
                          <p className="text-xs leading-5 text-gray-900 py-0.5">
                            {item.name}
                            {index + 1 >= selectedPromo.length ? '.' : ', '}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedService.length != 0 && (
                  <div className="col-span-8 sm:col-span-8">
                    <ul className="inline-flex items-center justify-left gap-x-1 gap-y-1 mt-0 flex-wrap">
                      <li key="title" className="min-w-0 flex gap-x-4">
                        <p className="text-xs leading-5 text-gray-900 py-0.5">Servicios: </p>
                      </li>
                      {selectedService.map((item, index) => (
                        <li key={item.id} className="min-w-0 flex gap-x-0">
                          <p className="text-xs leading-5 text-gray-900 py-0.5">
                            {item.name}
                            {index + 1 >= selectedService.length ? '.' : ', '}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="col-span-8 sm:col-span-8">
                <label htmlFor="specialist" className="block text-xs font-medium text-gray-700">
                  Especialista
                </label>
                <select
                  name="specialist"
                  id="specialist"
                  className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                  required="required"
                >
                  <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                    Selecione el especialista
                  </option>
                  {specialists?.map((specialist) => (
                    <option key={specialist.id} value={specialist.id} disabled={specialist.unavailable} className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                      {specialist.firstName} {specialist.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-8 sm:col-span-4">
                <label htmlFor="date" className="block text-xs font-medium text-gray-700">
                  Fecha
                </label>
                <input
                  // defaultValue={product?.title}
                  type="date"
                  name="date"
                  id="date"
                  defaultValue={moment(booking.date).format('YYYY-MM-DD')}
                  onChange={(date) => setDate(moment(date.target.value).format('YYYY-MM-DD'))}
                  required="required"
                  className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-8 sm:col-span-12">
                {available.length != 0 && (
                  <ul className="grid grid-cols-8 items-center justify-center gap-x-2 gap-y-1 mt-1 flex-wrap">
                    {available.map((item) => (
                      <li key={item.time} className={`inline-flex justify-center  text-xs font-medium rounded-md text-white ${item.free ? 'bg-gray-500' : 'bg-gray-300'}`}>
                        <button
                          type="button"
                          onClick={() => setSelectedTime(item.time)}
                          disabled={!item.free}
                          className={`py-1 px-1 rounded-md  border border-transparent shadow-sm ${item.time === selectedTime ? 'bg-green-600' : ''}`}
                          required="required"
                        >
                          <p className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md">{item.time}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-span-8 sm:col-span-12"></div>
              <div className="col-span-8 sm:col-span-12">
                <label htmlFor="notes" className="block text-xs font-medium text-gray-700">
                  Notas
                </label>
                <input
                  type="text"
                  name="notes"
                  id="notes"
                  // pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]{1,20}$"
                  placeholder="(Opcional)"
                  className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
        {!finalStep && (
          <div className="">
            <div className="px-0 pt-3 text-right sm:px-6">
              <button
                type="button"
                disabled={nextDisabled}
                onClick={handleNext}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  nextDisabled ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
        {finalStep && (
          <div className="flex justify-between">
            <div className="px-0 pt-3 text-right sm:px-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Atras
              </button>
            </div>
            <div className="px-0 pt-3 text-right sm:px-6">
              <button
                type="submit"
                disabled={submitDisabled}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  submitDisabled ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Reagendar
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
