import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Switch } from '@headlessui/react'
import { Disclosure } from '@headlessui/react'
import { Listbox } from '@headlessui/react'
import axios from 'axios';
import useFetch from '@hooks/useFetch';
import { updateSpecialist, deleteSpecialist, addService, addServiceByCategory, removeService } from '@services/api/specialists'
import endPoints from "@services/api";

const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

export default function SpecialistDetails({ setOpen, alert, setAlert, id }) {
  const formRef = useRef(null);
  const router = useRouter();

  const [specialist, setSpecialist] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enabled, setEnabled] = useState(true)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [serviceId, setServiceId] = useState([0]);
  const [selectedService, setSelectedService] = useState(false)


  const deleteMessage = `¿Está seguro que desea eliminar "${specialist?.firstName} ${specialist?.lastName}" de los servicios ofrecidos?`;

  useEffect(() => {
    async function loadSpecialist() {
      const response = await axios.get(endPoints.specialists.getOneSpecialist(id));
      setSpecialist(response.data);
      // setEnabled(response.data.active);
    }
    try {
      loadSpecialist();
    } catch (error) {
      console.log(error)
    }

    async function loadServices() {
      const response = await axios.get(endPoints.services.getAllService);
      setServices(response.data);
    }
    try {
      loadServices();
    } catch (error) {
      console.log(error)
    }

    async function loadCategories() {
      const response = await axios.get(endPoints.categories.getAllCategory);
      setCategories(response.data);
    }
    try {
      loadCategories();
    } catch (error) {
      console.log(error)
    }

  }, [enabled])

  const handleAddService = () => {

    const data = selectedService.categoryId ? {
      specialistId: id,
      serviceId: selectedService.id,
    } : {
      specialistId: id,
      categoryId: selectedService.id,
    };

    if (selectedService.categoryId) {
      addService(data)
        .then(() => {
          setAlert({
            active: true,
            message: `Servicio ${data.serviceId} agregado correctamente`,
            type: 'success',
            autoClose: false,
          });
          setEnabled(!enabled);
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
      addServiceByCategory(data)
      .then(() => {
        setAlert({
          active: true,
          message: `Categoría ${data.categoryId} agregada correctamente`,
          type: 'success',
          autoClose: false,
        });
        setEnabled(!enabled);
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

    console.log(data);

  };

  const handleRemove = (data) => {
    console.log(data);

    removeService(data.id)
      .then(() => {
        setAlert({
          active: true,
          message: `Servicio ${data.serviceId} removido correctamente`,
          type: 'success',
          autoClose: false,
        });
        setEnabled(!enabled);
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
    <div className='w-full'>
      <div className="overflow-hidden">
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2 min-w-full h-full">

            <div className="col-span-6 sm:col-span-3">
              <p className="text-sm font-semibold leading-5 text-gray-900 py-0.5">{specialist?.firstName} {specialist?.lastName}</p>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>

                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">{specialist.position}</p>
              </div>


              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> +56 {specialist.phone}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>

                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {specialist?.user?.email}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>

                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {new Date(specialist.startedAt).toLocaleDateString('es-ES', dateOptions)}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                </svg>

                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {new Date(specialist.birthday).toLocaleDateString('es-ES', dateOptions)}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">{specialist.active ? 'Disponible' : 'No disponible'}</p>

              </div>


            </div>

            {specialist.services && (
              <div className="col-span-6 sm:col-span-3">
                <p className="text-sm font-semibold leading-5 text-gray-900 py-0.5">Servicios Ofrecidos</p>
                <ul>
                  {specialist.services.map((service) => (

                    <li key={`service-${service.id}`} className="flex flex-raw gap-x-2 items-center ">

                      <Disclosure>
                        {({ openDelete }) => (
                          <>
                            <Disclosure.Button className="">
                              <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1 whitespace-nowrap">{service.name}</p>

                            </Disclosure.Button>
                            <Disclosure.Panel className="flex flex-raw gap-x-1 items-end">

                              <Disclosure >
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button as="div">
                                      {!open && (<button
                                        className=''
                                        type="button"
                                      >
                                        {/* Trash Can */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                      </button>)}

                                      {open && (<button
                                        type="button"
                                      >
                                        {/* Equis */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </button>)}

                                    </Disclosure.Button>
                                    <Disclosure.Panel >
                                      <div>
                                        {open && (<button
                                          type="button"
                                          onClick={() => handleRemove(service.SpecialistService)}
                                        >
                                          {/* Confirm */}
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                          </svg>
                                        </button>)}

                                      </div>

                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>

                            </Disclosure.Panel>
                          </>
                        )}</Disclosure>

                    </li>
                  ))}
                  <li>


                    <Listbox value={selectedService} onChange={setSelectedService}>
                      <Listbox.Button className="flex flex-raw gap-x-2 items-center ">

                        {!selectedService && (<p className="text-sm leading-5 text-gray-500 py-0.5 pl-1 whitespace-nowrap"> Agregar nuevo servicio </p>)}

                        <p className="text-sm leading-5 text-gray-500 py-0.5 pl-1 whitespace-nowrap"> {selectedService?.name}</p>
                        {selectedService && (<button
                          type="button"
                          className="flex flex-raw gap-x- py-0.5"
                          onClick={() => handleAddService()}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>)}
                      </Listbox.Button>
                      <Listbox.Options>
                        {services.map((service) => (
                          <Listbox.Option
                            key={service.id}
                            value={service}
                            disabled={service.unavailable}
                          >
                            <p className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">{service.name}</p>

                          </Listbox.Option>
                        ))}
                        {categories.map((category) => (
                          <Listbox.Option
                            key={category.id}
                            value={category}
                            disabled={category.unavailable}
                          >
                            <p className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">Categoria: {category.name}</p>

                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>


                  </li>
                </ul>

              </div>)}
          </div>
        </div>

      </div>
    </div>
  );
}



