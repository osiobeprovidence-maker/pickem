import { PackageCheck, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';

type OrdersTableProps = {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (order: Order, status: Order['status']) => void;
};

const getNextStatus = (status: Order['status']): Order['status'] | null => {
  if (status === 'pending') return 'accepted';
  if (status === 'accepted') return 'preparing';
  if (status === 'preparing') return 'in_transit';
  if (status === 'in_transit') return 'completed';
  return null;
};

export function OrdersTable({ orders, onViewOrder, onUpdateStatus }: OrdersTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-apple-gray-100 p-6 sm:p-8">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">Orders</p>
        <h3 className="mt-2 text-2xl font-black text-apple-gray-500">Incoming orders</h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
          Track new purchases, move orders through fulfillment, and keep customers updated.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 sm:p-8">
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="Orders from the marketplace will appear here as soon as your storefront and products go live."
          />
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-apple-gray-50 text-[11px] font-black uppercase tracking-[0.16em] text-apple-gray-300">
                  <th className="px-8 py-4">Order</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Products</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Payment</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-gray-100">
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);

                  return (
                    <tr key={order.id} className="align-top">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-apple-gray-300">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-apple-gray-500">{order.customer_name}</td>
                      <td className="px-8 py-6 text-sm font-medium text-apple-gray-400">
                        {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-apple-gray-500">
                        ₦{order.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={order.payment_status} />
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-apple-gray-400">
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            className="min-h-10 px-4 py-2 text-xs"
                            onClick={() => onViewOrder(order)}
                          >
                            View Order
                          </Button>
                          {nextStatus ? (
                            <Button
                              className="min-h-10 px-4 py-2 text-xs"
                              onClick={() => onUpdateStatus(order, nextStatus)}
                            >
                              {order.status === 'pending' ? 'Accept' : 'Update Status'}
                            </Button>
                          ) : null}
                          {order.status !== 'completed' && order.status !== 'cancelled' ? (
                            <Button
                              variant="ghost"
                              className="min-h-10 px-4 py-2 text-xs"
                              onClick={() => onUpdateStatus(order, 'completed')}
                            >
                              <PackageCheck className="h-4 w-4" />
                              Mark Completed
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-apple-gray-100 lg:hidden">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);

              return (
                <div key={order.id} className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-apple-gray-300">#{order.id.slice(0, 8)}</span>
                    <StatusBadge status={order.status} />
                    <StatusBadge status={order.payment_status} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-apple-gray-500">{order.customer_name}</div>
                    <div className="mt-1 text-sm font-medium text-apple-gray-300">
                      {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-apple-gray-50 p-4 text-sm font-medium text-apple-gray-400">
                      Amount
                      <span className="mt-1 block text-base font-bold text-apple-gray-500">
                        ₦{order.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-apple-gray-50 p-4 text-sm font-medium text-apple-gray-400">
                      Date
                      <span className="mt-1 block text-base font-bold text-apple-gray-500">
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="min-h-10 px-4 py-2 text-xs"
                      onClick={() => onViewOrder(order)}
                    >
                      View Order
                    </Button>
                    {nextStatus ? (
                      <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => onUpdateStatus(order, nextStatus)}>
                        {order.status === 'pending' ? 'Accept' : 'Update Status'}
                      </Button>
                    ) : null}
                    {order.status !== 'completed' && order.status !== 'cancelled' ? (
                      <Button
                        variant="ghost"
                        className="min-h-10 px-4 py-2 text-xs"
                        onClick={() => onUpdateStatus(order, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}
