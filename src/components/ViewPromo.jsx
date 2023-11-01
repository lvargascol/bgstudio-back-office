import useFetch from '@hooks/useFetch';
import endPoints from '@services/api';
export default function PromoDetails({ id }) {
  const promo = useFetch(endPoints.promos.getOnePromo(id));
  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2 min-w-full h-full">
            <div className="col-span-6 sm:col-span-6">
              <p className="text-sm font-semibold leading-5 text-gray-900 py-0.5">{promo?.name}</p>
              <div className="grid grid-cols-4">
                <div className="col-span-2">
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">$ {promo?.price}</p>
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1"> {promo?.minutes} min</p>
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 py-0.5 text-gray-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">{promo.active ? 'Disponible' : 'No disponible'}</p>
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 py-0.5 text-gray-500">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    <p className="text-sm leading-5 text-gray-900 py-1.5 pl-1">{promo?.description}</p>
                  </div>
                  <div className="flex flex-raw items-center justify-center gap-x-2 ">
                    <img src={promo?.image} alt="" className="rounded-md p-2 pt-3 sm:p-0 sm:pt-4 w-56 sm:w-64" />
                  </div>
                </div>
                <div className="col-span-2">
                  {promo?.services?.map((service) => (
                    <div key={`service-${service.id}`} className="flex flex-raw items-center gap-x-2 ">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 py-0.5 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                      <p className="text-sm leading-5 text-gray-900 py-0 pl-0"> {service.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
