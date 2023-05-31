import useFetch from '@hooks/useFetch';
import endPoints from "@services/api";

export default function PromoDetails({ setOpen, alert, setAlert, id }) {

  const promo = useFetch(endPoints.promos.getOnePromo(id));


  return (
    <div className='w-full'>
      <div className="overflow-hidden">
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2 min-w-full h-full">

            <div className="col-span-6 sm:col-span-6">
              <p className="text-sm font-semibold leading-5 text-gray-900 py-0.5">{promo?.name}</p>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">$ {promo?.price}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {promo?.minutes} min</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">{promo.active ? 'Disponible' : 'No disponible'}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {promo?.category?.name}</p>
              </div>

              <div className='flex flex-raw items-center gap-x-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">{promo?.description}</p>
              </div>

              <div className='flex flex-raw items-center justify-center gap-x-2 '>
                  <img src={promo?.image} alt="" className='rounded-md p-2 pt-3 sm:p-0 sm:pt-4 w-56 sm:w-64'/>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



