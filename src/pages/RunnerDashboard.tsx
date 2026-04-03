import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery, DeliveryStatus } from '../types';
import { motion } from 'motion/react';
import { Package, MapPin, CheckCircle2, Clock, Search, Navigation, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
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
    } catch (e) {
      alert("Failed to accept delivery. It might have been taken.");
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

  const availableJobs = deliveries.filter(d => d.status === 'requested');
  const myJobs = deliveries.filter(d => d.runner_id === user?.id && d.status !== 'delivered');
  const completedJobs = deliveries.filter(d => d.runner_id === user?.id && d.status === 'delivered');

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Runner Dashboard</h1>
          <p className="text-stone-500">Find jobs and manage your active deliveries.</p>
        </div>
        <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl">
          <div className="text-xs uppercase font-bold opacity-80">Total Earnings</div>
          <div className="text-2xl font-bold">₦{completedJobs.reduce((acc, curr) => acc + curr.fee * 0.8, 0).toFixed(2)}</div>
        </div>
      </div>

      {/* My Active Jobs */}
      {myJobs.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Your Active Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myJobs.map((job) => (
              <motion.div
                key={job.id}
                layoutId={job.id}
                className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                      {job.status.replace('_', ' ')}
                    </span>
                    <h3 className="text-xl font-bold mt-2">{job.item_description}</h3>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">₦{job.fee}</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 uppercase font-bold">Pickup</div>
                      <div className="font-medium">{job.pickup_location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 uppercase font-bold">Dropoff</div>
                      <div className="font-medium">{job.drop_location}</div>
                    </div>
                  </div>
                  {job.contact_details && (
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <span className="text-sm">{job.contact_details}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleUpdateStatus(job.id, job.status)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  {job.status === 'assigned' ? "Mark as Picked Up" : "Mark as Delivered"}
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Available Jobs */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-600" /> Available Jobs
        </h2>
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-stone-400">Searching for jobs...</div>
          ) : availableJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-stone-300" />
              </div>
              <h3 className="text-lg font-bold mb-2">No jobs available right now</h3>
              <p className="text-stone-500">We'll notify you when new requests come in.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {availableJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase">
                          {job.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-stone-400">
                          {format(new Date(job.created_at), 'h:mm a')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-3">{job.item_description}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-stone-600">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">{job.pickup_location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-600">
                          <Navigation className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{job.drop_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                      <div className="text-2xl font-bold text-emerald-600">₦{job.fee}</div>
                      <button
                        onClick={() => handleAccept(job.id)}
                        className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
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
