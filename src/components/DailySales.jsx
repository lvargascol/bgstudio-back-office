import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import endPoints from '@services/api';
// import Modal from '@common/Modal';
export default function DailySales({ date }) {
  // const router = useRouter();
  const [sales, setSales] = useState([]);
  const [totals, setTotals] = useState([]);
  useEffect(() => {
    async function loadSales() {
      try {
        const response = await axios.get(endPoints.bookings.getSalesByDate(date));
        setSales(response.data);
      } catch (error) {
        // router.push('/login');
        console.error(error);
      }
    }
    async function loadTotals() {
      try {
        const response = await axios.get(endPoints.bookings.getTotalSalesOnInterval(date, date));
        setTotals(response.data);
      } catch (error) {
        // router.push('/login');
        console.error(error);
      }
    }
    loadSales();
    loadTotals();
  }, [date]);
  return (
    <ul className="divide-y divide-gray-200">
      {sales.map((sale) => (
        <li key={`booking-${sale.id}`} className="py-1 px-2">
          <div as="div" className="flex gap-x-6">
            <div className="grid grid-cols-8 sm:grid-cols-8 sm:flex sm:flex-row gap-x-4">
              <div className="col-span-1 sm:flex-none min-w-0">
                <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">{moment(sale.date).format('HH:mm')}</p>
              </div>
              <div className="order-last col-span-8 sm:order-none sm:grow min-w-0 flex gap-x-1">
                {sale.services.map((service, index) => (
                  <p key={`services-${index}`} className="mt-1 truncate text-xs leading-4 text-gray-500">
                    {service.name}
                    {index + 1 >= sale.services.length ? '' : ','}
                  </p>
                ))}
                <p className="mt-1 truncate text-xs leading-4 text-gray-500"> {sale.services.length > 0 && sale.promos.length > 0 ? '/' : ''}</p>
                {sale.promos.map((promo, index) => (
                  <p key={`promos-${index}`} className="mt-1 truncate text-xs leading-4 text-gray-500">
                    {promo.name}
                    {index + 1 >= sale.promos.length ? '' : ','}
                  </p>
                ))}
              </div>
              <div className="col-span-6 sm:flex-none min-w-0 text-right">
                <p className="mt-1 truncate text-xs leading-4 text-gray-500">$ {sale.cost}</p>
              </div>
              <div className="col-span-1 sm:flex-none flex items-center justify-end">
                {sale.depositCheck ? (
                  <div className="col-span-1 sm:col-span-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                    </div>
                  </div>
                ) : (
                  <div className="col-span-1 sm:col-span-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-gray-500/20 p-0.5">
                      <div className="h-2 w-2 rounded-full bg-red-700" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
      <li className="py-2 px-2">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
            <div className="col-span-2 sm:col-span-2 min-w-0">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Día ({moment(date).format('DD-MMM-YY')})</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Total</p>
            </div>
            <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Cant. Atenciones</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Promedio</p>
            </div>
          </div>
        </div>
      </li>
      <li className="py-1 px-2 bg-blue-50">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
            <div className="col-span-2 sm:col-span-2 min-w-0">
              <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">{moment(date).format('DD-MMM-YY')}</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">$ {totals.total}</p>
            </div>
            <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">{totals.count}</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">$ {totals.average}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}
