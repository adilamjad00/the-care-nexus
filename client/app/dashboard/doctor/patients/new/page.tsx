'use client';

import { useState } from 'react';
import {
  useCreatePatientMutation,
  useSearchPatientsQuery,
  useFindPatientByEmailQuery,
} from '@/store/api/doctorApi';
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
import { useTranslations } from 'next-intl';

export default function NewPatientPage() {
  const t = useTranslations();
  const router = useRouter();
  const [createPatient, { isLoading }] = useCreatePatientMutation();
  const [activeTab, setActiveTab] = useState<'create' | 'link'>('create');
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    photo: '',
  });

  const { data: searchData, isFetching: isSearching } =
    useFindPatientByEmailQuery(formData.email, {
      skip:
        activeTab !== 'link' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    });
  const foundPatient = searchData?.data?.found
    ? searchData?.data?.patient
    : null;

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('doctor.patients.newPage.imageSizeError'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        setFormData((prev) => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'email') setImageError(false);
  };

  const validateLink = () => {
    if (!formData.email.trim()) {
      setErrors({ email: t('doctor.patients.newPage.emailRequired') });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ email: t('doctor.patients.newPage.validEmailRequired') });
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = t('doctor.patients.newPage.fullNameRequired');
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('doctor.patients.newPage.fullNameLength');
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = t('doctor.patients.newPage.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('doctor.patients.newPage.validEmailRequired');
    }

    // Phone — REQUIRED
    if (!formData.phone.trim()) {
      newErrors.phone = t('doctor.patients.newPage.phoneRequired');
    } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = t('doctor.patients.newPage.validPhoneRequired');
    }

    // Date of Birth — REQUIRED
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('doctor.patients.newPage.dobRequired');
    } else if (new Date(formData.dateOfBirth) >= new Date()) {
      newErrors.dateOfBirth = t('doctor.patients.newPage.dobFuture');
    }

    // Gender — REQUIRED
    if (!formData.gender) {
      newErrors.gender = t('doctor.patients.newPage.genderRequired');
    }

    // Blood Group — REQUIRED
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = t('doctor.patients.newPage.bloodGroupRequired');
    }

    // Address — REQUIRED
    if (!formData.address.trim()) {
      newErrors.address = t('doctor.patients.newPage.addressRequired');
    }

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
          toast.success(t('doctor.patients.newPage.connectionRequestSent'), {
            duration: 5000,
          });
        } else {
          toast.success(t('doctor.patients.newPage.patientConnected'));
        }
      } else {
        if (!validateForm()) {
          toast.error(t('doctor.patients.newPage.fillRequiredFields'));
          return;
        }
        const result = await createPatient(formData).unwrap();
        toast.success(
          t('doctor.patients.newPage.patientCreated', {
            email: result.data.patient.email,
          }),
          { duration: 6000 },
        );
      }
      router.push('/dashboard/doctor/patients');
    } catch (error: any) {
      toast.error(
        error?.data?.message || t('doctor.patients.newPage.operationFailed'),
      );
    }
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/doctor/patients'
          className='h-10 w-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-surface/80 transition-colors'
        >
          <ArrowLeft className='h-5 w-5 text-gray-600 dark:text-gray-400' />
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 '>
            {t('doctor.patients.newPage.title')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            {t('doctor.patients.newPage.subtitle')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-fit border border-gray-200 dark:border-gray-700'>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-2 rounded-xl text-sm font-bold tracking-wider transition-all ${
            activeTab === 'create'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {t('doctor.patients.newPage.createNew')}
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`px-6 py-2 rounded-xl text-sm font-bold tracking-wider transition-all ${
            activeTab === 'link'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {t('doctor.patients.newPage.linkExisting')}
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6'
      >
        <div className='space-y-6'>
          {activeTab === 'link' ? (
            <div className='py-4'>
              <label className='block text-sm font-bold text-gray-400 dark:text-gray-500 mb-3 tracking-tighter'>
                {t('doctor.patients.newPage.registeredEmail')}{' '}
                <span className='text-primary'>*</span>
              </label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary' />
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => set('email', e.target.value)}
                  className='w-full pl-12 pr-4 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-primary bg-slate-50 dark:bg-slate-900 text-lg font-bold'
                  placeholder={t('doctor.patients.newPage.emailPlaceholder')}
                />
                {isSearching && (
                  <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <div className='h-5 w-5 border-2 border-primary border-t-transparent animate-spin rounded-full' />
                  </div>
                )}
              </div>

              {foundPatient && (
                <div className='mt-6 flex items-center gap-5 p-5 bg-primary/5 rounded-2xl border-2 border-primary/20 animate-in slide-in-from-top-4 duration-500 shadow-sm shadow-primary/5'>
                  <div className='h-16 w-16 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm shrink-0'>
                    {!imageError &&
                    (foundPatient.photo || foundPatient.profilePhoto) ? (
                      <img
                        src={
                          (
                            foundPatient.photo || foundPatient.profilePhoto
                          ).startsWith('http')
                            ? foundPatient.photo || foundPatient.profilePhoto
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${(foundPatient.photo || foundPatient.profilePhoto).startsWith('/') ? (foundPatient.photo || foundPatient.profilePhoto).substring(1) : foundPatient.photo || foundPatient.profilePhoto}`
                        }
                        alt={foundPatient.name}
                        onError={() => setImageError(true)}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl'>
                        {foundPatient.name?.charAt(0).toUpperCase() || (
                          <User className='h-8 w-8' />
                        )}
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='font-bold text-gray-900 dark:text-white text-lg tracking-tight truncate'>
                      {foundPatient.name}
                    </h4>
                    <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-1'>
                      <p className='text-xs font-bold text-primary  tracking-wider flex items-center gap-1'>
                        <Mail className='h-3 w-3' />
                        {foundPatient.email}
                      </p>
                      {foundPatient.phone && (
                        <p className='text-xs font-bold text-slate-500  tracking-wider flex items-center gap-1'>
                          <Phone className='h-3 w-3' />
                          {foundPatient.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='hidden sm:block'>
                    <span className='bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider shadow-md shadow-primary/20'>
                      {t('doctor.patients.newPage.memberFound')}
                    </span>
                  </div>
                </div>
              )}

              <p className='mt-4 text-xs font-medium text-slate-500 '>
                {foundPatient
                  ? t('doctor.patients.newPage.patientFoundApprove')
                  : t('doctor.patients.newPage.searchPatientApprove')}
              </p>
            </div>
          ) : (
            <>
              {/* Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('doctor.patients.newPage.fullName')}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                    placeholder='John Doe'
                  />
                </div>
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('doctor.patients.newPage.email')}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                    placeholder='john@example.com'
                  />
                </div>
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('doctor.patients.newPage.phoneNumber')}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                    placeholder='+1 234 567 8900'
                  />
                </div>
                {errors.phone && (
                  <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('doctor.patients.newPage.dateOfBirth')}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
                  <input
                    type='date'
                    value={formData.dateOfBirth}
                    max={new Date().toLocaleDateString('en-CA')}
                    onChange={(e) => set('dateOfBirth', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 ${
                      errors.dateOfBirth
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Gender & Blood Group */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                    {t('doctor.patients.newPage.gender')}{' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => set('gender', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white ${
                      errors.gender
                        ? 'border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                  >
                    <option value=''>
                      {t('doctor.patients.newPage.selectGender')}
                    </option>
                    <option value='male'>
                      {t('doctor.patients.newPage.male')}
                    </option>
                    <option value='female'>
                      {t('doctor.patients.newPage.female')}
                    </option>
                    <option value='other'>
                      {t('doctor.patients.newPage.other')}
                    </option>
                  </select>
                  {errors.gender && (
                    <p className='text-red-500 text-sm mt-1'>{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                    {t('doctor.patients.newPage.bloodGroup')}{' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Droplet className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => set('bloodGroup', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white ${
                        errors.bloodGroup
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                      }`}
                    >
                      <option value=''>
                        {t('doctor.patients.newPage.selectBloodGroup')}
                      </option>
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
                  {errors.bloodGroup && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.bloodGroup}
                    </p>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('doctor.patients.newPage.allergiesOptional')}
                </label>
                <div className='relative'>
                  <Sparkles className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
                  <input
                    type='text'
                    value={formData.allergies}
                    onChange={(e) => set('allergies', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 ${
                      errors.allergies
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                    placeholder={t(
                      'doctor.patients.newPage.allergiesPlaceholder',
                    )}
                  />
                </div>
                {errors.allergies && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.allergies}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('doctor.patients.newPage.address')}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-3.5 h-5 w-5 text-gray-500 dark:text-gray-500' />
                  <textarea
                    value={formData.address}
                    onChange={(e) => set('address', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 resize-none ${
                      errors.address
                        ? 'border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-primary'
                    }`}
                    rows={3}
                    placeholder={t(
                      'doctor.patients.newPage.addressPlaceholder',
                    )}
                  />
                </div>
                {errors.address && (
                  <p className='text-red-500 text-sm mt-1'>{errors.address}</p>
                )}
              </div>

              {/* Info Box */}
              <div className='bg-primary/10 border border-primary/20 rounded-2xl p-4'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  <span className='font-semibold text-primary'>
                    {t('doctor.patients.newPage.noteLabel')}
                  </span>{' '}
                  {t('doctor.patients.newPage.noteText')}
                </p>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              disabled={isLoading}
              className='w-fit px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 whitespace-nowrap text-xs'
            >
              {isLoading
                ? t('doctor.patients.newPage.processing')
                : activeTab === 'create'
                  ? t('doctor.patients.newPage.enlistNewPatient')
                  : t('doctor.patients.newPage.sendConnectionRequest')}
            </button>
            <Link
              href='/dashboard/doctor/patients'
              className='px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs'
            >
              {t('common.cancel')}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
