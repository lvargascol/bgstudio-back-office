import useFetch from '@hooks/useFetch';
import endPoints from "@services/api";

export default function CategoryDetails({ setOpen, alert, setAlert, id }) {

  const category = useFetch(endPoints.categories.getOneCategory(id));
  console.log(category);


  return (
    <div className='w-full'>
      <div className="overflow-hidden">
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2 min-w-full h-full">

            <div className="col-span-6 sm:col-span-6">
              <p className="text-sm font-semibold leading-5 text-gray-900 py-0.5">{category?.name}</p>

              {category?.services?.map((service) => (
                <div className='flex flex-raw items-center gap-x-2 '>
                  <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {service.name}</p>
                </div>
              ))}

              <div className='flex flex-raw items-center justify-center gap-x-2 '>
                <img src={category?.image} alt="" className='rounded-md p-2 pt-3 sm:p-0 sm:pt-4 w-56 sm:w-64' />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



