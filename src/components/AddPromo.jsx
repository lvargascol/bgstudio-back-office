import { useState, useRef } from 'react';
import useFetch from '@hooks/useFetch';
import { createPromo, addService } from '@services/api/promos';
import endPoints from '@services/api';


export default function FormProduct({ setOpen, setAlert }) {
  const formRef = useRef(null);
  const categories = useFetch(endPoints.categories.getAllCategory);
  const services = useFetch(endPoints.services.getAllService);


  const [selected, setSelected] = useState([]);


  const handleSelect = () => {
    const selectedId = parseInt(new FormData(formRef.current).get('service'));
    const found = selected.find((item) => (item.id === selectedId)
    );
    if (!found) {
      services.map((service) => (service.id === selectedId) ? setSelected([...selected, service]) : selectedId
      );
    }
  };

  const handleRemove = (service) => {
    setSelected(selected.filter((item) => (item.id != service.id)));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseInt(formData.get('price')),
      minutes: selected.reduce((acum, current) => acum + current.minutes, 0),
      image: formData.get('image'),
    };

    createPromo(data)
      .then((response) => {
        setAlert({
          active: true,
          message: 'Promoción creada correctamente',
          type: 'success',
          autoClose: false,
        });
        selected.map((item) => {
          const toAddService = {
            promoId: response.id,
            serviceId: item.id,
          };
          addService(toAddService);
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
        <p className="text-sm pb-2 font-bold text-gray-900">Añadir promoción</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">

            <div className="col-span-4 sm:col-span-5">
              <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Nombre"
                required="required"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-2 sm:col-span-3">
              <label htmlFor="price" className="block text-xs font-medium text-gray-700">
                Precio ($)
              </label>
              <div className='inline-flex items-center justify-center gap-x-2 mt-1'>

                <input
                  type="number"
                  name="price"
                  id="price"
                  required="required"
                  min="1000"
                  step="500"
                  className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                /></div>
            </div>


            <div className="col-span-6 sm:col-span-8">
              <label htmlFor="service" className="block text-xs font-medium text-gray-700">
                Servicios
              </label>
              <select
                name="service"
                id="service"
                onChange={handleSelect}
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              >
                <option value="" disabled selected className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">Selecione los servicios</option>
                {categories?.map((category) => (
                  <optgroup
                    key={category.id}
                    value={category.id}
                    disabled={category.unavailable}
                    label={category.name}
                    className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap"
                  >
                    {category?.services.map((service) => (
                      <option
                        key={service.id}
                        value={service.id}
                        disabled={service.unavailable}
                        className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap"
                      >
                        {service.name}

                      </option>))}

                  </optgroup>))}
              </select>

              {selected.length != 0 && (<ul className='inline-flex items-center justify-center gap-x-2 gap-y-1 mt-1 flex-wrap'>
                {selected.map((item, index) => (
                  <li
                    key={item.id}
                    className='inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-500'
                  ><p className="text-xs mt-0 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md">{item.name}</p><button
                    type="button"
                    onClick={() => handleRemove(item)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pl-1 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button></li>))}
              </ul>)}
            </div>





            <div className="col-span-6 sm:col-span-8">
              <label htmlFor="image" className="block text-xs font-medium text-gray-700">
                Imagen (URL)
              </label>
              <input
                type="url"
                name="image"
                id="image"
                placeholder="https://example.com/image.jpg"
                required="required"
                pattern="https://.*"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
            </div>



            <div className="col-span-6 sm:col-span-8">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                id="description"
                required="required"
                placeholder="Agregar descripción"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
                rows="3"
              ></textarea>
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