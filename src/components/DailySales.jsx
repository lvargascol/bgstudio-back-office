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
      <li className="py-2 px-2">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-x-1 sm:gap-x-2">
            <div className="col-span-1 sm:col-span-1 min-w-0">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Hora</p>
            </div>
            <div className="col-span-6 sm:col-span-8 order-last sm:order-none min-w-0 text-left">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Servicios</p>
            </div>
            <div className="col-span-1 sm:col-span-1 min-w-0 text-center sm:text-right">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Monto</p>
            </div>
          </div>
        </div>
      </li>
      {sales.map((sale) => (
        <li key={`booking-${sale.id}`} className="py-1 px-2">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-x-1 sm:gap-x-2">
            <div className="col-span-1 sm:col-span-1 min-w-0">
              <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">{moment(sale.date).format('HH:mm')}</p>
            </div>
            <div className="col-span-6 sm:col-span-8 order-last sm:order-none min-w-0 flex gap-x-1 flex-wrap">
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
            <div className="col-span-1 sm:col-span-1 min-w-0 text-center sm:text-right">
              <p className="mt-1 truncate text-xs leading-4 text-gray-500">{sale.cost}</p>
            </div>
          </div>
        </li>
      ))}
      <li className="pt-6 pb-2 px-2">
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
