import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChartNoAxesCombined,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  BUSINESS_MONTHLY_PRICE,
  type BusinessRegistrationInput,
  registerBusiness,
  startBusinessTrial,
} from '../lib/businessOnboarding';
import { cn } from '../lib/utils';

type FormErrors = Partial<Record<keyof BusinessRegistrationInput, string>>;

const benefits = [
  {
    icon: ChartNoAxesCombined,
    title: 'Increase Sales',
    description: 'Reach students in dorms and classes, then expand delivery instantly without adding operational drag.',
  },
  {
    icon: Users,
    title: 'No Hiring Needed',
    description: 'Plug into Pick’em’s trusted student runner network and skip the cost of managing delivery staff.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Transactions',
    description: 'Keep every order tracked through a verified system built for campus handoffs and accountability.',
  },
];

const testimonials = [
  {
    quote: 'Pick’em helped us double hostel orders in under a month without hiring a dispatch rider.',
    name: 'Tife Johnson',
    business: 'Cafe Nova',
  },
  {
    quote: 'The trial made it easy to test demand, and now deliveries are part of our daily sales flow.',
    name: 'Emeka Obi',
    business: 'Campus Mart',
  },
];

const categoryOptions = [
  'Restaurant / Food',
  'Groceries / Convenience',
  'Fashion / Beauty',
  'Books / Stationery',
  'Tech / Accessories',
  'Laundry / Cleaning',
  'Health / Pharmacy',
  'Other',
];

const initialFormData: BusinessRegistrationInput = {
  businessName: '',
  businessCategory: '',
  ownerFullName: '',
  email: '',
  phoneNumber: '',
  businessAddress: '',
  cityState: '',
  description: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Businesses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [step, setStep] = React.useState<'form' | 'success'>('form');
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [formData, setFormData] = React.useState<BusinessRegistrationInput>({
    ...initialFormData,
    ownerFullName: user?.name ?? '',
    email: user?.email ?? '',
  });

  React.useEffect(() => {
    if (!user) return;

    setFormData((current) => ({
      ...current,
      ownerFullName: current.ownerFullName || user.name,
      email: current.email || user.email,
    }));
  }, [user]);

  const openRegistration = () => {
    setErrors({});
    setStep('form');
    setIsModalOpen(true);
  };

  const closeRegistration = () => {
    setIsModalOpen(false);
    setErrors({});
    setStep('form');
  };

  const updateField = (field: keyof BusinessRegistrationInput, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = () => {
    // Keep validation explicit here so the onboarding modal can give immediate, field-level feedback.
    const nextErrors: FormErrors = {};

    if (!formData.businessName.trim()) nextErrors.businessName = 'Business name is required.';
    if (!formData.businessCategory.trim()) nextErrors.businessCategory = 'Choose a category.';
    if (!formData.ownerFullName.trim()) nextErrors.ownerFullName = 'Owner name is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!formData.phoneNumber.trim()) nextErrors.phoneNumber = 'Phone number is required.';
    if (!formData.businessAddress.trim()) nextErrors.businessAddress = 'Business address is required.';
    if (!formData.cityState.trim()) nextErrors.cityState = 'City and state are required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    registerBusiness({
      ...formData,
      businessName: formData.businessName.trim(),
      businessCategory: formData.businessCategory.trim(),
      ownerFullName: formData.ownerFullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      businessAddress: formData.businessAddress.trim(),
      cityState: formData.cityState.trim(),
      description: formData.description?.trim(),
    });
    setStep('success');
  };

  const handleStartTrial = () => {
    const record = startBusinessTrial(formData.email);
    if (!record) return;

    closeRegistration();

    if (user?.role === 'business' && user.email.toLowerCase() === record.email.toLowerCase()) {
      navigate('/dashboard');
      return;
    }

    navigate('/auth?role=business');
  };

  const scrollToBenefits = () => {
    document.getElementById('business-benefits')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7faf8_38%,#ffffff_100%)]">
      <section className="px-5 pb-14 pt-20 sm:px-6 sm:pb-18 sm:pt-24 lg:pb-20 lg:pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Partnerships
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
              <BadgeCheck className="h-4 w-4" />
              7-Day Free Trial → ₦{BUSINESS_MONTHLY_PRICE.toLocaleString()}/month
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-apple-gray-500 sm:text-5xl md:text-6xl lg:text-7xl">
              Grow Your Campus Business with Pick’em
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg md:text-xl">
              The delivery infrastructure for campus businesses. Reach more students and scale without hiring delivery staff.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" onClick={openRegistration}>
                Register Your Business
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={scrollToBenefits}>
                Learn More
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Avg. setup time', value: '5 mins' },
                { label: 'Campus reach', value: '100+ businesses' },
                { label: 'Subscription', value: '₦3,500/mo' },
              ].map((item) => (
                <Card key={item.label} className="p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-apple-gray-300">{item.label}</div>
                  <div className="mt-2 text-2xl font-black text-apple-gray-500">{item.value}</div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative"
          >
            <div className="absolute inset-x-6 top-8 h-48 rounded-full bg-brand-500/15 blur-3xl" />
            <Card className="relative overflow-hidden p-5 sm:p-6">
              <div className="rounded-[1.5rem] bg-apple-gray-500 p-5 text-white sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Business Console</p>
                    <h2 className="mt-2 text-2xl font-black">Campus Mart</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]">
                    Live Orders
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Orders', value: '128' },
                    { label: 'Runners', value: '22' },
                    { label: 'Revenue', value: '₦248k' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/8 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">{stat.label}</div>
                      <div className="mt-2 text-2xl font-black">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                <Card className="border-brand-100 bg-brand-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">Plan status</p>
                      <h3 className="mt-2 text-2xl font-black text-apple-gray-500">7-day free trial</h3>
                    </div>
                    <CreditCard className="h-6 w-6 text-brand-600" />
                  </div>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-400">
                    Launch instantly, track your first orders, then continue for ₦{BUSINESS_MONTHLY_PRICE.toLocaleString()}/month.
                  </p>
                </Card>

                <Card className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-apple-gray-300">What you unlock</p>
                  <div className="mt-4 space-y-3">
                    {['Runner dispatch access', 'Tracked order timeline', 'Business analytics'].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-bold text-apple-gray-500">
                        <CheckCircle2 className="h-4 w-4 text-brand-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="business-benefits" className="px-5 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-700">Why it converts</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">
              Built for businesses that want campus growth without delivery overhead.
            </h2>
          </div>

          <div className="mt-8 grid auto-rows-fr gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
                    <benefit.icon className="h-7 w-7 text-brand-600" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-apple-gray-500">{benefit.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <Card className="p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-700">
              Join 100+ campus businesses already using Pick’em
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">
              Trusted by sellers that want more orders, faster fulfillment, and cleaner operations.
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {['CM', 'CN', 'BK', 'LF', 'PX'].map((initials) => (
                <div
                  key={initials}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-sm font-black text-brand-700"
                >
                  {initials}
                </div>
              ))}
              <span className="text-sm font-bold text-apple-gray-300">Campus Mart, Cafe Nova, Book Hub, Laundry Fix, Pixel Store</span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-[1.5rem] border border-apple-gray-100 bg-apple-gray-50 p-5">
                  <p className="text-sm font-medium leading-relaxed text-apple-gray-400">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-5">
                    <div className="text-sm font-black text-apple-gray-500">{item.name}</div>
                    <div className="text-sm font-medium text-apple-gray-300">{item.business}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-6 sm:p-8">
            <div className="rounded-[1.75rem] bg-brand-500 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">Fast onboarding</p>
              <h3 className="mt-3 text-2xl font-black">Start with a free trial.</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/80">
                Register your store, claim your 7-day free trial, and only continue at ₦{BUSINESS_MONTHLY_PRICE.toLocaleString()}/month if the flow works for your business.
              </p>
              <Button variant="secondary" className="mt-6 w-full border-white/20 bg-white text-brand-700 hover:bg-brand-50" onClick={openRegistration}>
                Register Your Business
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                'Collect business details in one clean onboarding flow.',
                'Launch your 7-day trial immediately after registration.',
                'Upgrade to monthly subscription when the trial ends.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-apple-gray-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="px-5 pb-18 pt-8 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden bg-apple-gray-500 p-8 text-white sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/65">Launch now</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Ready to turn Pick’em into your campus delivery engine?
                </h2>
                <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/75">
                  Register in minutes, activate your free trial, and start receiving orders with a premium dispatch experience built for student demand.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={openRegistration}>
                  Register Your Business
                </Button>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full border-white/15 bg-white text-brand-700 hover:bg-brand-50">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* The modal carries the full acquisition flow: registration first, then trial activation. */}
      <Modal open={isModalOpen} onClose={closeRegistration}>
        {step === 'form' ? (
          <div>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                <Building2 className="h-4 w-4" />
                Business registration
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">
                Register your business and launch your free trial.
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
                Complete the form below. After submission, you can claim your 7-day free trial and start receiving orders.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleRegister}>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Business Name"
                  placeholder="Campus Mart"
                  value={formData.businessName}
                  onChange={(event) => updateField('businessName', event.target.value)}
                  error={errors.businessName}
                />
                <label className="block space-y-2">
                  <span className="text-sm font-bold text-apple-gray-500">Business Category</span>
                  <select
                    value={formData.businessCategory}
                    onChange={(event) => updateField('businessCategory', event.target.value)}
                    className={cn(
                      'w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30',
                      errors.businessCategory && 'border-red-200 focus:border-red-300 focus:ring-red-500/20',
                    )}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.businessCategory ? (
                    <p className="text-sm font-medium text-red-500">{errors.businessCategory}</p>
                  ) : null}
                </label>
                <Input
                  label="Owner Full Name"
                  placeholder="Jane Doe"
                  value={formData.ownerFullName}
                  onChange={(event) => updateField('ownerFullName', event.target.value)}
                  error={errors.ownerFullName}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="owner@business.com"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="08012345678"
                  value={formData.phoneNumber}
                  onChange={(event) => updateField('phoneNumber', event.target.value)}
                  error={errors.phoneNumber}
                />
                <Input
                  label="City / State"
                  placeholder="Akoka, Lagos"
                  value={formData.cityState}
                  onChange={(event) => updateField('cityState', event.target.value)}
                  error={errors.cityState}
                />
              </div>

              <Input
                label="Business Address"
                placeholder="Shop 12, Student Mall, Main Gate"
                value={formData.businessAddress}
                onChange={(event) => updateField('businessAddress', event.target.value)}
                error={errors.businessAddress}
              />

              <label className="block space-y-2">
                <span className="text-sm font-bold text-apple-gray-500">Optional Description</span>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Tell us what your business sells and who you serve."
                  className="w-full rounded-2xl border border-apple-gray-100 bg-apple-gray-50 px-4 py-3.5 text-sm font-medium text-apple-gray-500 outline-none transition-all placeholder:text-apple-gray-200 focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
                />
              </label>

              <div className="rounded-[1.5rem] border border-brand-100 bg-brand-50 p-4 text-sm font-medium text-brand-900">
                This registration unlocks a <span className="font-black">7-day free trial</span>, then continues at{' '}
                <span className="font-black">₦{BUSINESS_MONTHLY_PRICE.toLocaleString()}/month</span>.
              </div>

              <div className="flex flex-col gap-3 border-t border-apple-gray-100 pt-5 sm:flex-row sm:justify-end">
                <Button variant="ghost" className="w-full sm:w-auto" onClick={closeRegistration}>
                  Cancel
                </Button>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Register Your Business
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <CheckCircle2 className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-apple-gray-500 sm:text-4xl">
              🎉 Business Registered Successfully
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-apple-gray-300">
              You can now claim your 7-day free trial and start receiving orders.
            </p>

            <Card className="mx-auto mt-8 max-w-xl p-5 text-left">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">Next step</p>
                  <h3 className="mt-2 text-xl font-black text-apple-gray-500">Activate free trial</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-apple-gray-300">
                    Trial starts immediately and then rolls into ₦{BUSINESS_MONTHLY_PRICE.toLocaleString()}/month.
                  </p>
                </div>
                <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-black text-brand-700">
                  7 days free
                </div>
              </div>
            </Card>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={handleStartTrial}>
                Start 7-Day Free Trial
              </Button>
              <Button variant="secondary" size="lg" onClick={closeRegistration}>
                Maybe Later
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
