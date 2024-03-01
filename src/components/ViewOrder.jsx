import useFetch from '@hooks/useFetch';
import endPoints from '@services/api';
import moment from 'moment';
export default function ViewOrder({ id }) {
  const order = useFetch(endPoints.orders.getOneOrder(id));
  const orderNumber = String(order.id).padStart(6, '0');
  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div className="px-4 py-1 bg-white sm:p-6 sm:pt-1">
          <div className="grid grid-cols-6 gap-2 min-w-full h-full">
            <div className="col-span-6 sm:col-span-6">
              <div className="grid grid-cols-8">
                <div className="col-span-5">
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">Orden N° {orderNumber}</p>
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <p className="text-xs leading-5 text-gray-900 py-0 pl-1">{order?.user?.email}</p>
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <p className="text-xs leading-5 text-gray-900 py-0 pl-1">{moment(order?.createdAt).format('DD-MMM-YYYY hh:mm a')}</p>
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    {order.paid && <p className="text-xs leading-5 text-green-900 py-0 pl-1">Pagado</p>}
                    {!order.paid && <p className="text-xs leading-5 text-red-900 py-0 pl-1">Por pagar</p>}
                  </div>
                  <div className="flex flex-raw items-center gap-x-2 ">
                    <p className="text-xs leading-5 text-gray-900 py-0 pl-1">{order?.notes}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">Reserva</p>
                  {order?.bookings?.map((booking) => (
                    <div key={`booking-${booking.id}`} className="items-center gap-x-2 ">
                      <div>
                        <p className="text-xs leading-5 text-gray-900 py-0 pl-1">$ {booking.cost}</p>
                      </div>
                      <div>
                        {booking.depositCheck && <p className="text-xs leading-5 text-green-900 py-0 pl-1">Abonó</p>}
                        {!booking.depositCheck && <p className="text-xs leading-5 text-red-900 py-0 pl-1">Por abonar</p>}
                      </div>
                      <div className="flex flex-raw items-center gap-x-2 ">{booking?.notes && <q className="text-xs leading-5 text-gray-600 py-0 pl-1">{booking?.notes}</q>}</div>
                    </div>
                  ))}
                </div>
                <div className="col-span-8">
                  <p className="text-xs font-semibold leading-5 text-gray-900 py-0.5">Pagos</p>

                  <div className="items-center gap-x-2 ">
                    {order?.payments?.map((payment) => (
                      <div key={`payment-${payment.id}`} className="flex gap-x-2">
                        <p className="text-xs leading-5 text-gray-900 py-0 pl-1 inline-block">{moment(payment?.createdAt).format('DD-MMM-YYYY hh:mm a')}</p>
                        <p className="text-xs leading-5 text-gray-900 py-0 pl-1 inline-block">$ {payment?.amount}</p>
                        <p className="text-xs leading-5 text-gray-900 py-0 pl-1 inline-block">{payment?.type}</p>
                        {payment?.confirmed && <p className="text-xs leading-5 text-green-900 py-0 pl-1 inline-block">Confirmado</p>}
                        {!payment?.confirmed && <p className="text-xs leading-5 text-red-900 py-0 pl-1 inline-block">Por confirmar</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
