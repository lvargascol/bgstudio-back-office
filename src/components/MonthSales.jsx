import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import endPoints from '@services/api';
import BarChart from '@common/BarChart';
export default function MonthSales({ date }) {
  const router = useRouter();
  const [totals, setTotals] = useState([]);
  const [monthTotals, setMonthTotals] = useState([]);
  const labels = totals.map((total, index) =>
    moment(date)
      .date(index + 1)
      .format('ddd DD')
  );
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
        const month = parseInt(moment(date).format('MM'));
        const endDay = parseInt(moment(date).endOf('month').format('DD'));
        const totalArray = [];
        for (let day = 1; day <= endDay; day++) {
          const currentDate = moment()
            .year(year)
            .month(month - 1)
            .date(day)
            .format('YYYY-MM-DD');
          const dailyResponse = await axios.get(endPoints.bookings.getTotalSalesOnInterval(currentDate, currentDate));
          totalArray.push(dailyResponse.data);
        }
        setTotals(totalArray);
        const firstDay = moment()
          .year(year)
          .month(month - 1)
          .startOf('month')
          .format('YYYY-MM-DD');
        const lastDay = moment()
          .year(year)
          .month(month - 1)
          .endOf('month')
          .format('YYYY-MM-DD');
        const monthResponse = await axios.get(endPoints.bookings.getTotalSalesOnInterval(firstDay, lastDay));
        setMonthTotals(monthResponse.data);
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
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">Día ({moment(date).format('MMM-YYYY')})</p>
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
        <li key={`week-${index}`} className={`py-1 px-2 ${index === parseInt(moment(date).format('DD')) - 1 ? 'bg-green-50' : ''}`}>
          <div as="div" className="gap-x-6">
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
              <div className="col-span-2 sm:col-span-2 min-w-0">
                <p className="text-xs font-semibold leading-1 text-gray-900 py-0.5">
                  {moment(date)
                    .date(index + 1)
                    .format('ddd DD')}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-1 text-gray-500">$ {total.total}</p>
              </div>
              <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-1 text-gray-500">{total.count}</p>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
                <p className="mt-1 truncate text-xs leading-1 text-gray-500">$ {total.average}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
      <li className="py-1 px-2 bg-blue-50">
        <div as="div" className="gap-x-6">
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-x-4">
            <div className="col-span-2 sm:col-span-2 min-w-0">
              <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">Total {moment(date).format('MMM YYYY')}</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">$ {monthTotals.total}</p>
            </div>
            <div className="col-span-1 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">{monthTotals.count}</p>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0 text-center">
              <p className="mt-1 truncate text-xs leading-4 text-gray-900">$ {monthTotals.average}</p>
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
