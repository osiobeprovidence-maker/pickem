import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Delivery, DeliveryProofMethod, DeliveryStatus, RunnerVerification } from '../types';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Navigation,
  Package,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { format } from 'date-fns';

type VerificationForm = {
  full_name: string;
  phone_number: string;
  id_type: RunnerVerification['id_type'];
  id_front: string;
  id_back: string;
  selfie_image: string;
  residential_address: string;
  proof_of_address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  terms_accepted: boolean;
};

type ProofState = {
  delivery: Delivery | null;
  method: DeliveryProofMethod;
  asset: string;
  code: string;
};

const makeDefaultForm = (name: string, email: string): VerificationForm => ({
  full_name: name,
  phone_number: '',
  id_type: 'nin',
  id_front: '',
  id_back: '',
  selfie_image: '',
  residential_address: '',
  proof_of_address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relationship: '',
  bank_name: '',
  account_number: '',
  account_name: name,
  terms_accepted: false,
});

export default function RunnerDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [verification, setVerification] = useState<RunnerVerification | null>(null);
  const [form, setForm] = useState<VerificationForm | null>(null);
  const [proof, setProof] = useState<ProofState>({ delivery: null, method: 'photo', asset: '', code: '' });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [deliveryData, verificationData] = await Promise.all([
        api.getDeliveries('runner', user.id),
        api.getRunnerVerification(user.id),
      ]);
      setDeliveries(deliveryData);
      setVerification(verificationData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!verification) {
      setForm(makeDefaultForm(user.name, user.email));
      return;
    }
    setForm({
      full_name: verification.full_name || user.name,
      phone_number: verification.phone_number || '',
      id_type: verification.id_type,
      id_front: verification.id_front || '',
      id_back: verification.id_back || '',
      selfie_image: verification.selfie_image || '',
      residential_address: verification.residential_address || '',
      proof_of_address: verification.proof_of_address || '',
      emergency_contact_name: verification.emergency_contact_name || '',
      emergency_contact_phone: verification.emergency_contact_phone || '',
      emergency_contact_relationship: verification.emergency_contact_relationship || '',
      bank_name: verification.bank_name || '',
      account_number: verification.account_number || '',
      account_name: verification.account_name || user.name,
      terms_accepted: verification.terms_accepted,
    });
  }, [user, verification]);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });

  const uploadToField = async (event: React.ChangeEvent<HTMLInputElement>, field: 'id_front' | 'id_back' | 'selfie_image' | 'proof_of_address') => {
    const file = event.target.files?.[0];
    if (!file || !form) return;
    try {
      const data = await readFileAsDataUrl(file);
      setForm(current => (current ? { ...current, [field]: data } : current));
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      event.target.value = '';
    }
  };

  const submitVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !form) return;
    if (!form.terms_accepted) {
      alert('Accept the runner terms before submitting.');
      return;
    }
    await api.createOrUpdateRunnerVerification({
      runner_id: user.id,
      full_name: form.full_name,
      phone_number: form.phone_number,
      phone_verified: true,
      email: user.email,
      email_verified: true,
      id_type: form.id_type,
      id_front: form.id_front,
      id_back: form.id_back,
      selfie_image: form.selfie_image,
      residential_address: form.residential_address,
      proof_of_address: form.proof_of_address,
      emergency_contact_name: form.emergency_contact_name,
      emergency_contact_phone: form.emergency_contact_phone,
      emergency_contact_relationship: form.emergency_contact_relationship,
      bank_name: form.bank_name,
      account_number: form.account_number,
      account_name: form.account_name,
      payout_verified: form.full_name.trim().toLowerCase() === form.account_name.trim().toLowerCase(),
      device_id: `runner-${user.id}`,
      ip_address: 'Local demo session',
      location_data: `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      terms_accepted: form.terms_accepted,
      security_bond_amount: 10000,
      trust_score: verification?.trust_score || 50,
      verification_status: 'in_review',
      submitted_at: new Date().toISOString(),
    });
    await loadDashboard();
    alert('Verification submitted for review.');
  };

  const approveDemo = async () => {
    if (!user) return;
    await api.approveRunnerVerification(user.id);
    await loadDashboard();
  };

  const handleAccept = async (id: string) => {
    if (!user || verification?.verification_status !== 'approved') return;
    try {
      await api.updateDeliveryStatus(id, 'assigned', user.id);
      await loadDashboard();
    } catch {
      alert('Failed to accept delivery. It might have been taken.');
    }
  };

  const updateStatus = async (delivery: Delivery) => {
    if (delivery.status === 'assigned') {
      await api.updateDeliveryStatus(delivery.id, 'picked_up');
      await loadDashboard();
      return;
    }
    if (delivery.status === 'picked_up') {
      setProof({ delivery, method: 'photo', asset: '', code: '' });
    }
  };

  const completeWithProof = async () => {
    if (!user || !proof.delivery) return;
    if ((proof.method === 'photo' || proof.method === 'signature') && !proof.asset) {
      alert('Upload delivery proof first.');
      return;
    }
    if (proof.method === 'otp' && !proof.code.trim()) {
      alert('Enter the customer OTP first.');
      return;
    }
    await api.completeRunnerDeliveryWithProof(proof.delivery.id, user.id, {
      method: proof.method,
      asset: proof.asset || undefined,
      code: proof.code.trim() || undefined,
    });
    setProof({ delivery: null, method: 'photo', asset: '', code: '' });
    await loadDashboard();
  };

  const handleProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await readFileAsDataUrl(file);
      setProof(current => ({ ...current, asset: data }));
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      event.target.value = '';
    }
  };

  if (!user || !form) return null;

  const isVerified = verification?.verification_status === 'approved';
  const availableJobs = deliveries.filter(delivery => delivery.status === 'requested');
  const activeJobs = deliveries.filter(delivery => delivery.runner_id === user.id && delivery.status !== 'delivered' && delivery.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-white py-10 md:py-16 px-4 sm:px-0">
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-apple-gray-50 rounded-full text-[12px] font-semibold text-apple-gray-300">
              <span className={isVerified ? 'text-emerald-500' : verification?.verification_status === 'in_review' ? 'text-amber-500' : 'text-red-500'}>
                {isVerified ? 'Verified' : verification?.verification_status === 'in_review' ? 'In Review' : 'Locked'}
              </span>
              Runner Network Access
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-apple-gray-500">
              {isVerified ? 'Runner Hub' : 'Runner Verification Center'}
            </h1>
            <p className="text-lg sm:text-2xl font-bold text-apple-gray-300">
              {isVerified ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Runners do not see delivery jobs until verification is approved.'}
            </p>
          </div>
          <div className="bg-apple-gray-500 text-white p-8 rounded-[3rem] min-w-[250px] shadow-2xl">
            <div className="text-[10px] uppercase font-black tracking-widest opacity-60">{isVerified ? 'Trust Score' : 'Status'}</div>
            <div className="mt-2 text-4xl font-black tracking-tighter">{isVerified ? `${verification?.trust_score || 80}%` : verification?.verification_status === 'in_review' ? 'Review' : 'Start'}</div>
            <div className="mt-3 text-xs font-bold text-apple-gray-200">{isVerified ? 'Marketplace unlocked' : 'Verification required'}</div>
          </div>
        </div>

        {!isVerified && (
          <>
            {verification?.verification_status === 'in_review' && (
              <div className="rounded-[2.5rem] border border-amber-100 bg-amber-50 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-700">Admin Review Pending</div>
                  <div className="mt-2 text-2xl font-black text-apple-gray-500">Your runner profile is under review.</div>
                  <p className="mt-2 text-sm font-bold text-apple-gray-300">Use the demo approval button below to unlock jobs locally.</p>
                </div>
                <button type="button" onClick={approveDemo} className="inline-flex items-center gap-3 rounded-full bg-apple-gray-500 px-6 py-4 text-sm font-black text-white shadow-sm">
                  <BadgeCheck className="w-4 h-4" />
                  Approve Demo Verification
                </button>
              </div>
            )}

            <form onSubmit={submitVerification} className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl md:text-3xl font-black text-apple-gray-500">Identity Verification</h2>
                </div>
                  <input value={form.full_name} onChange={(e) => setForm(current => (current ? { ...current, full_name: e.target.value } : current))} placeholder="Full legal name" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <div className="flex gap-3">
                    <input value={form.phone_number} onChange={(e) => setForm(current => (current ? { ...current, phone_number: e.target.value } : current))} placeholder="Phone number" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  </div>
                  <input value={user.email} readOnly className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                <select value={form.id_type} onChange={(e) => setForm(current => (current ? { ...current, id_type: e.target.value as RunnerVerification['id_type'] } : current))} className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500">
                  <option value="nin">National ID (NIN)</option>
                  <option value="drivers_license">Driver&apos;s License</option>
                  <option value="passport">International Passport</option>
                  <option value="voters_card">Voter&apos;s Card</option>
                </select>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    ['id_front', 'ID Front'],
                    ['id_back', 'ID Back'],
                    ['selfie_image', 'Live Selfie'],
                  ].map(([field, label]) => (
                    <label key={field} className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5 space-y-3 cursor-pointer">
                      <div className="flex items-center gap-3"><Camera className="w-5 h-5 text-apple-gray-300" /><span className="text-sm font-black text-apple-gray-500">{label}</span></div>
                      <div className="text-xs font-bold text-apple-gray-300">{form[field as keyof VerificationForm] ? 'File added' : 'Tap to upload'}</div>
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(event) => uploadToField(event, field as 'id_front' | 'id_back' | 'selfie_image')} />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-5">
                  <div className="flex items-center gap-3"><FileText className="w-6 h-6 text-emerald-600" /><h2 className="text-2xl font-black text-apple-gray-500">Address & Safety</h2></div>
                  <textarea value={form.residential_address} onChange={(e) => setForm(current => (current ? { ...current, residential_address: e.target.value } : current))} placeholder="Residential address" className="w-full min-h-[110px] rounded-[2rem] bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <label className="rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-5 space-y-3 cursor-pointer block">
                    <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-apple-gray-300" /><span className="text-sm font-black text-apple-gray-500">Proof of Address</span></div>
                    <div className="text-xs font-bold text-apple-gray-300">{form.proof_of_address ? 'Document uploaded' : 'Tap to upload utility bill, bank statement, or rental agreement'}</div>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(event) => uploadToField(event, 'proof_of_address')} />
                  </label>
                  <input value={form.emergency_contact_name} onChange={(e) => setForm(current => (current ? { ...current, emergency_contact_name: e.target.value } : current))} placeholder="Emergency contact name" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <input value={form.emergency_contact_phone} onChange={(e) => setForm(current => (current ? { ...current, emergency_contact_phone: e.target.value } : current))} placeholder="Emergency contact phone" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <input value={form.emergency_contact_relationship} onChange={(e) => setForm(current => (current ? { ...current, emergency_contact_relationship: e.target.value } : current))} placeholder="Relationship" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-5">
                  <div className="flex items-center gap-3"><CreditCard className="w-6 h-6 text-emerald-600" /><h2 className="text-2xl font-black text-apple-gray-500">Bank & Agreement</h2></div>
                  <input value={form.bank_name} onChange={(e) => setForm(current => (current ? { ...current, bank_name: e.target.value } : current))} placeholder="Bank name" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <input value={form.account_number} onChange={(e) => setForm(current => (current ? { ...current, account_number: e.target.value.replace(/\\D/g, '').slice(0, 10) } : current))} placeholder="Account number" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <input value={form.account_name} onChange={(e) => setForm(current => (current ? { ...current, account_name: e.target.value } : current))} placeholder="Account name" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
                  <label className="flex items-start gap-4 rounded-[2rem] bg-apple-gray-50 p-5">
                    <input type="checkbox" checked={form.terms_accepted} onChange={(e) => setForm(current => (current ? { ...current, terms_accepted: e.target.checked } : current))} className="mt-1 h-5 w-5 accent-emerald-600" />
                    <span className="text-sm font-bold text-apple-gray-500">I accept Pick&apos;em runner terms: no theft, no package tampering, no fake delivery confirmation, and violations may lead to permanent ban and legal action.</span>
                  </label>
                  <button className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-5 text-sm font-black text-white shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Submit For Approval
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {isVerified && (
          <>
            {activeJobs.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center"><Clock className="w-6 h-6 text-apple-gray-300" /></div>
                  <h2 className="text-2xl font-black text-apple-gray-500 uppercase tracking-tight">Active Deliveries</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="bg-white p-8 rounded-[3rem] border border-apple-gray-100 shadow-sm space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-4 py-1.5 bg-apple-gray-50 text-apple-gray-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-apple-gray-100">{job.type.replace('_', ' ')}</span>
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">{job.status.replace('_', ' ')}</span>
                          </div>
                          <h3 className="text-2xl font-black text-apple-gray-500">{job.item_description}</h3>
                        </div>
                        <div className="text-3xl font-black text-apple-gray-500">N{job.fee.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-apple-gray-200" /><span className="font-bold text-apple-gray-500">{job.pickup_location}</span></div>
                        <div className="flex items-center gap-3"><Navigation className="w-5 h-5 text-apple-gray-500" /><span className="font-bold text-apple-gray-500">{job.drop_location}</span></div>
                      </div>
                      <button type="button" onClick={() => updateStatus(job)} className="w-full bg-apple-gray-500 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl flex items-center justify-center gap-3">
                        {job.status === 'assigned' ? <><Package className="w-5 h-5" /> Confirm Pickup</> : <><CheckCircle2 className="w-5 h-5" /> Add Delivery Proof</>}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center"><Package className="w-6 h-6 text-apple-gray-300" /></div>
                <h2 className="text-2xl font-black text-apple-gray-500 uppercase tracking-tight">Job Marketplace</h2>
              </div>
              <div className="bg-white rounded-[3rem] border border-apple-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="p-20 text-center text-apple-gray-200 font-bold text-xl">Scanning for new requests...</div>
                ) : availableJobs.length === 0 ? (
                  <div className="p-16 md:p-24 text-center space-y-6">
                    <div className="w-24 h-24 bg-apple-gray-50 rounded-[2rem] flex items-center justify-center mx-auto"><Search className="w-10 h-10 text-apple-gray-200" /></div>
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black text-apple-gray-500">No jobs available right now</h3>
                      <p className="text-lg font-bold text-apple-gray-300">We&apos;ll update this marketplace as soon as new requests arrive.</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-apple-gray-50">
                    {availableJobs.map((job) => (
                      <div key={job.id} className="p-8 md:p-10 hover:bg-apple-gray-50 transition-all">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="px-4 py-1.5 bg-white border border-apple-gray-100 text-apple-gray-300 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">{job.type.replace('_', ' ')}</span>
                              <span className="text-xs font-bold text-apple-gray-200 flex items-center gap-2"><Clock className="w-4 h-4" /> Posted {format(new Date(job.created_at), 'h:mm a')}</span>
                            </div>
                            <h3 className="text-3xl font-black text-apple-gray-500">{job.item_description}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-apple-gray-200" /><span className="font-bold text-apple-gray-300">{job.pickup_location}</span></div>
                              <div className="flex items-center gap-3"><Navigation className="w-5 h-5 text-apple-gray-500" /><span className="font-bold text-apple-gray-500">{job.drop_location}</span></div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row xl:flex-col xl:items-end gap-6">
                            <div className="text-right">
                              <div className="text-[10px] font-black text-apple-gray-200 uppercase tracking-widest">Runner&apos;s Cut</div>
                              <div className="text-4xl font-black text-apple-gray-500">N{job.fee.toLocaleString()}</div>
                            </div>
                            <button type="button" onClick={() => handleAccept(job.id)} className="bg-apple-gray-500 text-white px-10 py-4 rounded-[1.5rem] font-black text-lg shadow-xl flex items-center gap-3">
                              Take this Job <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {proof.delivery && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-2xl rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-apple-gray-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Delivery Proof Required
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-apple-gray-500">Complete delivery with confirmation</h2>
            </div>
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ['photo', 'Photo'],
                  ['signature', 'Signature'],
                  ['otp', 'OTP'],
                ].map(([method, label]) => (
                  <button key={method} type="button" onClick={() => setProof(current => ({ ...current, method: method as DeliveryProofMethod, asset: '', code: '' }))} className={`rounded-[1.75rem] border px-5 py-4 text-sm font-black ${proof.method === method ? 'border-apple-gray-500 bg-apple-gray-500 text-white' : 'border-apple-gray-100 bg-apple-gray-50 text-apple-gray-500'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {(proof.method === 'photo' || proof.method === 'signature') && (
                <label className="block rounded-[2rem] border border-apple-gray-100 bg-apple-gray-50 p-6 cursor-pointer">
                  <div className="flex items-center gap-3 text-apple-gray-500 font-black"><Camera className="w-5 h-5" /> Upload proof image</div>
                  <div className="mt-3 text-sm font-bold text-apple-gray-300">{proof.asset ? 'Proof uploaded.' : 'Tap to choose an image file.'}</div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleProofUpload} />
                </label>
              )}
              {proof.method === 'otp' && (
                <input value={proof.code} onChange={(e) => setProof(current => ({ ...current, code: e.target.value }))} placeholder="Enter customer OTP" className="w-full rounded-full bg-apple-gray-50 px-7 py-5 font-bold text-apple-gray-500" />
              )}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <button type="button" onClick={() => setProof({ delivery: null, method: 'photo', asset: '', code: '' })} className="rounded-full border border-apple-gray-100 px-6 py-4 text-sm font-black text-apple-gray-500">
                  Cancel
                </button>
                <button type="button" onClick={completeWithProof} className="inline-flex items-center justify-center gap-3 rounded-full bg-apple-gray-500 px-8 py-4 text-sm font-black text-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Delivery
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
