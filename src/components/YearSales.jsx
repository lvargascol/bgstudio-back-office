import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import endPoints from '@services/api';
import BarChart from '@common/BarChart';
export default function YearSales({ date }) {
  const localLocale = moment();
  localLocale.locale('es');
  const router = useRouter();
  const [totals, setTotals] = useState([]);
  const [yearTotals, setYearTotals] = useState([]);
  const labels = totals.map((total, index) => localLocale.month(index).format('MMM'));
  const totalColor = 'rgba(15, 99, 255, 0.8)';
  const countColor = 'rgba(255, 50, 40, 0.8)';
  const averageColor = 'rgba(255, 165, 20, 0.8)';
  const [totalChartData, setTotalChartData] = useState({
    labels: labels,
    datasets: [
      {
        label: 'Ingreso',
        data: [],
      },
    ],
  });
  const [countChartData, setCountChartData] = useState({
    labels: labels,
    datasets: [
      {
        label: 'Cantidad',
        data: [],
      },
    ],
  });
  const [averageChartData, setAverageChartData] = useState({
    labels: labels,
    datasets: [
      {
        label: 'Promedio',
        data: [],
      },
    ],
  });
  useEffect(() => {
    async function loadTotals() {
      try {
        const year = moment(date).format('YYYY');
        const totalArray = [];
        for (let month = 0; month < 12; month++) {
          const firstDay = moment().year(year).month(month).startOf('month').format('YYYY-MM-DD');
          const lastDay = moment().year(year).month(month).endOf('month').format('YYYY-MM-DD');
          const monthResponse = await axios.get(endPoints.bookings.getTotalSalesOnInterval(firstDay, lastDay));
          totalArray.push(monthResponse.data);
        }
        setTotals(totalArray);
        const firstDay = moment().year(year).startOf('year').format('YYYY-MM-DD');
        const lastDay = moment().year(year).endOf('year').format('YYYY-MM-DD');
        const yearResponse = await axios.get(endPoints.bookings.getTotalSalesOnInterval(firstDay, lastDay));
        setYearTotals(yearResponse.data);
      } catch (error) {
        router.push('/login');
        console.error(error);
      }
    }
    loadTotals();
  }, [date]);
  useEffect(() => {
    if (totals.length != 0) {
      setTotalChartData({
        labels: labels,
        datasets: [
          {
            label: 'Ingreso',
            data: totals.map((total) => total.total),
            backgroundColor: [totalColor],
          },
        ],
      });
      setCountChartData({
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: totals.map((total) => total.count),
            backgroundColor: [countColor],
          },
        ],
      });
      setAverageChartData({
        labels: labels,
        datasets: [
          {
            label: 'Promedio',
            data: totals.map((total) => total.average),
            backgroundColor: [averageColor],
          },
        ],
      });
    }
  }, [totals]);
  return (
    <ul className="divide-y divide-gray-200">
      <li className="py-2 px-2">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
            <div className="col-span-2 sm:col-span-2 min-w-0">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Mes</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Total</p>
            </div>
            <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Cantidad</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Promedio</p>
            </div>
          </div>
        </div>
      </li>
      {totals.map((total, index) => (
        <li key={`month-${index}`} className={`py-1 px-2 ${index === parseInt(moment(date).format('MM')) - 1 ? 'bg-green-50' : ''}`}>
          <div as="div" className="gap-x-6">
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
              <div className="col-span-2 sm:col-span-2 min-w-0">
                <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">{localLocale.month(index).format('MMMM')}</p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-500">$ {total.total}</p>
              </div>
              <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-500">{total.count}</p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-4 text-gray-500">$ {total.average}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
      <li className="py-1 px-2 bg-blue-50">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
            <div className="col-span-2 sm:col-span-2 min-w-0">
              <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">Total {moment(date).format('YYYY')}</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">$ {yearTotals.total}</p>
            </div>
            <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">{yearTotals.count}</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">$ {yearTotals.average}</p>
            </div>
          </div>
        </div>
      </li>
      <li className="py-2 px-2 ">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-3 gap-x-4">
            <div className="col-span-3 sm:col-span-1 min-w-0">
              <BarChart data={totalChartData} options={{}} />
            </div>
            <div className="col-span-3 sm:col-span-1 min-w-0">
              <BarChart data={countChartData} options={{}} />
            </div>
            <div className="col-span-3 sm:col-span-1 min-w-0">
              <BarChart data={averageChartData} options={{}} />
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}
