import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import { useAuth } from '@hooks/useAuth';
import { createBooking, addService, addPromo } from '@services/api/bookings';
import { getAllCustomer } from '@services/api/customers';
import endPoints from '@services/api';
export default function NewBooking({ setOpen, setAlert, alert, setOpenCustomer }) {
  const formRef = useRef(null);
  const auth = useAuth();
  const customersFetch = useFetch(endPoints.customers.getAllCustomer);
  const categories = useFetch(endPoints.categories.getAllCategory);
  const promos = useFetch(endPoints.promos.getAllPromo);
  const services = useFetch(endPoints.services.getAllService);
  const specialists = useFetch(endPoints.specialists.getAllSpecialist);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [date, setDate] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [ignore, setIgnore] = useState(false);
  useEffect(() => {
    getAllCustomer().then((response) => {
      setCustomers(response);
    });
  }, [alert, customersFetch]);
  useEffect(() => {
    async function loadSchedule(date) {
      const response = await axios.get(endPoints.bookings.getScheduleByDate(date, selectedSpecialists.id));
      setSchedule(response.data);
    }
    if (date && selectedSpecialists.id) {
      try {
        loadSchedule(date);
        setSelectedTime([]);
        enableSubmit();
      } catch (error) {
        console.error(error);
      }
    }
  }, [date, selectedSpecialists]);
  useEffect(() => {
    ignore ? AllAvailable() : availableCheck();
    enableSubmit();
  }, [selectedService, selectedPromo, selectedCustomer, schedule, selectedTime, ignore]);
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
  const AllAvailable = () => {
    const all = schedule.map((timeBlock) => ({
      time: timeBlock.time,
      min: timeBlock.min,
      free: true,
    }));
    setAvailable(all);
  };
  const enableSubmit = () => {
    if (selectedTime.length != 0 && (selectedService != 0 || selectedPromo != 0) && selectedCustomer) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
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
  const handleSelectCustomer = () => {
    const customerInput = new FormData(formRef.current).get('customer');
    setSelectedCustomer(customers.find((customer) => `${customer.firstName} ${customer.lastName} (${customer.user.email})` === customerInput));
  };
  const handleSelectSpecialist = () => {
    const specialistId = parseInt(new FormData(formRef.current).get('specialist'));
    setSelectedSpecialists(specialists.find((specialist) => specialist.id === specialistId));
  };
  const handleRemoveService = (service) => {
    setSelectedService(selectedService.filter((item) => item.id != service.id));
  };
  const handleRemovePromo = (promo) => {
    setSelectedPromo(selectedPromo.filter((item) => item.id != promo.id));
  };
  const handleIgnore = () => {
    const ignoreInput = new FormData(formRef.current).get('ignore');
    setIgnore(ignoreInput ? true : false);
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
      customerId: selectedCustomer.id,
      specialistId: selectedSpecialists.id,
      order: {
        userId: auth.user.id,
      },
    };
    createBooking(data)
      .then((response) => {
        setAlert({
          active: true,
          message: 'Cita agendada correctamente',
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
        <p className="text-sm pb-2 font-bold text-gray-900">Crear nueva reserva</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            <div className="col-span-8 sm:col-span-9">
              <label htmlFor="customer" className="block text-xs font-medium text-gray-700">
                Cliente
              </label>
              <input
                list="customers"
                type="search"
                name="customer"
                id="customer"
                onInput={handleSelectCustomer}
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 border rounded-md py-2 pl-3"
                required="required"
              />
              <datalist id="customers">
                {customers?.map((customer) => (
                  <option key={customer.id} value={`${customer.firstName} ${customer.lastName} (${customer.user.email})`} disabled={customer.unavailable}>
                    {customer.firstName} {customer.lastName} ({customer.user.email})
                  </option>
                ))}
              </datalist>
            </div>
            <div className="col-span-8 sm:col-span-1">
              <div className="h-4 hidden sm:block"></div>
              <div className="">
                <button
                  type="button"
                  className="gap-x-2 border text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-xs border-gray-300 rounded-md "
                  onClick={() => setOpenCustomer(true)}
                >
                  <div className="grid place-content-center h-8 p-0.5">
                    <p className="sm:hidden text-xs font-medium text-gray-700">Crear nuevo cliente</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-gray-700 hidden sm:block">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-span-8 sm:col-span-5">
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
                  Seleccione las promociones
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
            <div className="col-span-8 sm:col-span-5 ">
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
                  Seleccione los servicios
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
            <div className="col-span-8 sm:col-span-6">
              <label htmlFor="specialist" className="block text-xs font-medium text-gray-700">
                Especialista
              </label>
              <select
                name="specialist"
                id="specialist"
                onChange={handleSelectSpecialist}
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                required="required"
              >
                <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">
                  Seleccione el especialista
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
                type="date"
                name="date"
                id="date"
                onChange={(date) => setDate(moment(date.target.value).format('YYYY-MM-DD'))}
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-8 sm:col-span-10">
              {available.length != 0 && (
                <ul className="grid grid-cols-4 sm:grid-cols-8 items-center justify-center gap-x-2 gap-y-1 mt-1 flex-wrap">
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
            <div className="col-span-8 sm:col-span-10 pl-1">
              <input
                type="checkbox"
                id="ignore"
                name="ignore"
                onClick={handleIgnore}
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
              <label htmlFor="ignore" className="text-xs font-medium text-gray-700 pl-2">
                Ignorar restricciones de horario (No recomendado)
              </label>
            </div>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-2"></div>
        </div>
        <div className="">
          <div className="px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              disabled={submitDisabled}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                submitDisabled ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
