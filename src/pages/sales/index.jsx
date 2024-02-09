import { useState } from 'react';
import moment from 'moment';
import DailySales from '@components/DailySales';
import MonthSales from '@components/MonthSales';
import YearSales from '@components/YearSales';

export default function Sales() {
  const today = moment(Date.now()).format('YYYY-MM-DD');
  const [date, setDate] = useState(today);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(0);
  const timeIntervals = [
    { name: 'Diario', current: selectedTimeInterval === 0 ? true : false },
    { name: `Mensual (${moment(date).format('MMM')})`, current: selectedTimeInterval === 1 ? true : false },
    { name: `Anual (${moment(date).format('YYYY')})`, current: selectedTimeInterval === 2 ? true : false },
  ];
  const handleTimeInterval = (index) => {
    setSelectedTimeInterval(index);
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setDate(moment(date).add(-1, 'days').format('YYYY-MM-DD'))}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <input
                  value={date}
                  onChange={(date) => setDate(moment(date.target.value).format('YYYY-MM-DD'))}
                  type="date"
                  name="date"
                  id="date"
                  required="required"
                  className="relative z-10 inline-flex items-center bg-bgPink-800 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgPink-800"
                />
                <button
                  onClick={() => setDate(moment(date).add(1, 'days').format('YYYY-MM-DD'))}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 px-0.5 pt-0.5 grid grid-cols-3 gap-x-0.5 rounded-sm">
        {timeIntervals.map((timeInterval, index) => (
          <button key={`button-${index}`} className={`col-span-1 py-1 ${selectedTimeInterval === index ? 'bg-white ' : ''}`} onClick={() => handleTimeInterval(index)}>
            <span className="text-sm leading-5 text-gray-900 py-0.5">{timeInterval.name}</span>
          </button>
        ))}
      </div>
      {selectedTimeInterval === 0 && <DailySales date={date} />}
      {selectedTimeInterval === 1 && <MonthSales date={date} />}
      {selectedTimeInterval === 2 && <YearSales date={date} />}
    </div>
  );
}
