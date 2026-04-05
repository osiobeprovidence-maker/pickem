import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery, DeliveryStatus } from '../types';
import { motion } from 'motion/react';
import { Package, MapPin, Clock, Search, Navigation, Phone } from 'lucide-react';
import { format } from 'date-fns';

export default function RunnerDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeliveries = async () => {
    if (user) {
      const data = await api.getDeliveries('runner', user.id);
      setDeliveries(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAccept = async (id: string) => {
    if (!user) return;
    try {
      await api.updateDeliveryStatus(id, 'assigned', user.id);
      fetchDeliveries();
    } catch (error) {
      alert('Failed to accept delivery. It might have been taken.');
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: DeliveryStatus) => {
    let nextStatus: DeliveryStatus;
    if (currentStatus === 'assigned') nextStatus = 'picked_up';
    else if (currentStatus === 'picked_up') nextStatus = 'delivered';
    else return;

    await api.updateDeliveryStatus(id, nextStatus);
    fetchDeliveries();
  };

  const availableJobs = deliveries.filter((delivery) => delivery.status === 'requested');
  const myJobs = deliveries.filter((delivery) => delivery.runner_id === user?.id && delivery.status !== 'delivered');
  const completedJobs = deliveries.filter((delivery) => delivery.runner_id === user?.id && delivery.status === 'delivered');

  return (
    <div className="space-y-8 overflow-x-clip md:space-y-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Runner Dashboard</h1>
          <p className="text-stone-500">Find jobs and manage your active deliveries.</p>
        </div>
        <div className="w-full rounded-2xl bg-emerald-600 px-6 py-3 text-white sm:w-auto">
          <div className="text-xs font-bold uppercase opacity-80">Total Earnings</div>
          <div className="break-words text-2xl font-bold">
            N{completedJobs.reduce((accumulator, current) => accumulator + current.fee * 0.8, 0).toFixed(2)}
          </div>
        </div>
      </div>

      {myJobs.length > 0 && (
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Clock className="h-5 w-5 text-brand-600" /> Your Active Jobs
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {myJobs.map((job) => (
              <motion.div
                key={job.id}
                layoutId={job.id}
                className="rounded-3xl border-2 border-brand-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase text-brand-700">
                      {job.status.replace('_', ' ')}
                    </span>
                    <h3 className="mt-2 break-words text-xl font-bold">{job.item_description}</h3>
                  </div>
                  <div className="shrink-0 text-2xl font-bold text-emerald-600">N{job.fee}</div>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-50">
                      <MapPin className="h-4 w-4 text-stone-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase text-stone-400">Pickup</div>
                      <div className="break-words font-medium">{job.pickup_location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-50">
                      <Navigation className="h-4 w-4 text-stone-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase text-stone-400">Dropoff</div>
                      <div className="break-words font-medium">{job.drop_location}</div>
                    </div>
                  </div>
                  {job.contact_details && (
                    <div className="flex flex-col gap-2 rounded-xl bg-stone-50 p-3 sm:flex-row sm:items-center">
                      <Phone className="h-4 w-4 shrink-0 text-stone-400" />
                      <span className="break-all text-sm">{job.contact_details}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleUpdateStatus(job.id, job.status)}
                  className="w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  {job.status === 'assigned' ? 'Mark as Picked Up' : 'Mark as Delivered'}
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Package className="h-5 w-5 text-emerald-600" /> Available Jobs
        </h2>
        <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-stone-400">Searching for jobs...</div>
          ) : availableJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-50">
                <Search className="h-8 w-8 text-stone-300" />
              </div>
              <h3 className="mb-2 text-lg font-bold">No jobs available right now</h3>
              <p className="text-stone-500">We&apos;ll notify you when new requests come in.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {availableJobs.map((job) => (
                <div key={job.id} className="p-6 transition-colors hover:bg-stone-50">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase text-stone-600">
                          {job.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-stone-400">
                          {format(new Date(job.created_at), 'h:mm a')}
                        </span>
                      </div>
                      <h3 className="mb-3 break-words text-lg font-bold">{job.item_description}</h3>
                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-4">
                        <div className="flex items-start gap-2 text-stone-600">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span className="break-words font-medium">{job.pickup_location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-stone-600">
                          <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                          <span className="break-words font-medium">{job.drop_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:items-end">
                      <div className="text-2xl font-bold text-emerald-600">N{job.fee}</div>
                      <button
                        onClick={() => handleAccept(job.id)}
                        className="rounded-xl bg-brand-500 px-8 py-3 font-bold text-white transition-colors hover:bg-brand-600"
                      >
                        Accept Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
