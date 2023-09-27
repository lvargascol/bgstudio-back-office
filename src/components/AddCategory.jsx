import { useRef } from 'react';
import { createCategory } from '@services/api/categories';


export default function FormProduct({ setOpen, setAlert }) {
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get('name'),
      image: formData.get('image'),
    };

    console.log(data);

    createCategory(data)
      .then((response) => {
        setAlert({
          active: true,
          message: 'Categoría creada correctamente',
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
        <p className="text-sm pb-2 font-bold text-gray-900">Añadir categoría</p>
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2">

            <div className="col-span-2 sm:col-span-3">
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


            <div className="col-span-2 sm:col-span-5">
              <label htmlFor="image" className="block text-xs font-medium text-gray-700">
                Imagen (URL)
              </label>
              <input
                type="url"
                name="image"
                id="image"
                placeholder="https://example.com/image.jpg"
                pattern="https://.*"
                className="text-xs mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
              />
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