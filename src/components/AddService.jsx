import { useRef } from 'react';
import useFetch from '@hooks/useFetch';
import { createService } from '@services/api/services';
import endPoints from '@services/api';


export default function FormProduct({ setOpen, setAlert }) {
  const formRef = useRef(null);
  const categories = useFetch(endPoints.categories.getAllCategory);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseInt(formData.get('price')),
      minutes: parseInt(formData.get('minutes')),
      image: formData.get('image'),
      categoryId: formData.get('category'),
    };

    createService(data)
      .then((response) => {
        setAlert({
          active: true,
          message: 'Servicio creado correctamente',
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

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="overflow-hidden">
        <p className="text-sm pb-2 font-bold text-gray-900">Añadir servicio</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">

            <div className="col-span-6 sm:col-span-5">
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
              <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                Categoría
              </label>
              <select
                name="category"
                id="category"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    disabled={category.unavailable}
                    className="text-xs leading-5 text-gray-600 py-0 pl-4 whitespace-nowrap">{category.name}</option>))}
              </select>
            </div>


            <div className="col-span-2 sm:col-span-4">
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

            <div className="col-span-2 sm:col-span-4">
              <label htmlFor="minutes" className="block text-xs font-medium text-gray-700">
                Duración (min)
              </label>
              <input
                type="number"
                name="minutes"
                id="minutes"
                required="required"
                min="5"
                step="5"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
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