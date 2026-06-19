'use client';

import { useState } from 'react';
import { useCreatePatientMutation } from '@/store/api/clinicApi';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  MapPin,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewPatientPage() {
  const router = useRouter();
  const [createPatient, { isLoading }] = useCreatePatientMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    photo: null as string | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'create' | 'link'>('create');

  const set = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateLink = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ email: 'Valid email is required' });
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid email is required';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === 'link') {
        if (!validateLink()) return;
        const result = await createPatient({ email: formData.email }).unwrap();
        if (result.data?.isRequestSent) {
          toast.success('Patient exists! Connection request sent.', {
            duration: 5000,
          });
        } else {
          toast.success('Patient connected successfully!');
        }
      } else {
        if (!validateForm()) {
          toast.error('Please fill in all required fields');
          return;
        }
        const result = await createPatient(formData).unwrap();
        toast.success(`Patient created successfully!`);
      }
      router.push('/dashboard/clinic_admin/patients');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/clinic_admin/patients'
          className='h-10 w-10 bg-white rounded-lg flex items-center justify-center hover:bg-surface/80 transition-colors border border-border-light'
        >
          <ArrowLeft className='h-5 w-5 text-text-secondary' />
        </Link>
        <div>
          <h1 className='text-3xl font-black text-text-primary'>
            Clinical Enrollment
          </h1>
          <p className='text-text-secondary mt-1 font-medium'>
            Register new patients or link with existing The Care Nexus accounts
          </p>
        </div>
      </div>

      <div className='flex gap-2 p-1.5 bg-surface rounded-2xl w-fit border border-border-light'>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'create'
              ? 'bg-white  text-primary'
              : 'text-text-secondary hover:text-text-secondary :text-white/70'
          }`}
        >
          Register New
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'link'
              ? 'bg-white  text-primary'
              : 'text-text-secondary hover:text-text-secondary :text-white/70'
          }`}
        >
          Link Existing
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-2xl border border-border-light p-8'
      >
        <div className='space-y-8'>
          {activeTab === 'link' ? (
            <div className='py-6'>
              <label className='block text-sm font-black text-text-secondary mb-4 uppercase tracking-widest'>
                Registered Email Identity{' '}
                <span className='text-primary'>*</span>
              </label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary' />
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => set('email', e.target.value)}
                  className='w-full pl-14 pr-4 py-5 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 text-xl font-black tracking-tight'
                  placeholder='patient@system.com'
                />
              </div>
              <p className='mt-6 text-sm font-bold text-text-secondary flex items-center gap-2'>
                <Sparkles className='h-4 w-4 text-primary' />
                Existing user profiles will receive a connection request for
                clinical access approval.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
              <div className='md:col-span-2 flex flex-col items-center pb-6'>
                <div className='relative group'>
                  <div className='h-32 w-32 rounded-2xl overflow-hidden border-2 border-dashed border-border-light bg-background/50 flex items-center justify-center transition-all group-hover:border-primary/50'>
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt='Preview'
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='flex flex-col items-center gap-2 text-white/70'>
                        <User size={40} />
                        <span className='text-[10px] font-black uppercase tracking-widest'>
                          Identity Photo
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                  {formData.photo && (
                    <button
                      type='button'
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, photo: null }))
                      }
                      className='absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10'
                    >
                      ×
                    </button>
                  )}
                </div>
                <p className='text-[10px] text-text-secondary mt-3 font-bold uppercase tracking-widest'>
                  Optional Clinical Visual Identity
                </p>
              </div>

              <div className='md:col-span-2'>
                <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                  Full Name
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70' />
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => set('name', e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold'
                  />
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                  Email Identity
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => set('email', e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold'
                  />
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                  Primary Contact
                </label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70' />
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold'
                  />
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                  Birth Date
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70' />
                  <input
                    type='date'
                    value={formData.dateOfBirth}
                    onChange={(e) => set('dateOfBirth', e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => set('gender', e.target.value)}
                    className='w-full px-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold appearance-none'
                  >
                    <option value=''>Select...</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
                <div>
                  <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                    Blood Group
                  </label>
                  <div className='relative'>
                    <Droplet className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500/50' />
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => set('bloodGroup', e.target.value)}
                      className='w-full pl-9 pr-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold appearance-none'
                    >
                      <option value=''>Select...</option>
                      <option value='A+'>A+</option>
                      <option value='A-'>A-</option>
                      <option value='B+'>B+</option>
                      <option value='B-'>B-</option>
                      <option value='AB+'>AB+</option>
                      <option value='AB-'>AB-</option>
                      <option value='O+'>O+</option>
                      <option value='O-'>O-</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='md:col-span-2'>
                <label className='block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2'>
                  Residential Address
                </label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-3.5 h-5 w-5 text-white/70' />
                  <textarea
                    value={formData.address}
                    onChange={(e) => set('address', e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border-2 border-border-light rounded-2xl focus:outline-none focus:border-primary bg-background/50 font-bold min-h-[100px]'
                    placeholder='Street, City, Province'
                  />
                </div>
              </div>
            </div>
          )}

          <div className='flex gap-4 pt-6'>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-hover transition-all disabled:opacity-50'
            >
              {isLoading
                ? 'Authenticating...'
                : activeTab === 'create'
                  ? 'Authorize Enrollment'
                  : 'Initiate Connection Request'}
            </button>
            <Link
              href='/dashboard/clinic_admin/patients'
              className='px-10 py-4 bg-surface text-text-secondary rounded-2xl font-black uppercase tracking-widest hover:bg-surface :bg-text-secondary transition-all'
            >
              Back
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
