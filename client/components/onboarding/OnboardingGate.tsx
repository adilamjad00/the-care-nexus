'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  Crown,
  FilePlus2,
  HeartPulse,
  House,
  Info,
  Mic as MicIcon,
  UserRound,
  Users,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  useMarkOnboardingCompleteMutation,
  useMarkProfileCompleteMutation,
} from '@/store/api/onboardingApi';
import { useUpdateProfileMutation as usePatientUpdateProfileMutation } from '@/store/api/patientApi';
import { useUpdateDoctorProfileMutation } from '@/store/api/doctorApi';
import { useSaveSettingsMutation } from '@/store/api/clinicApi';
import {
  setCredentials,
  setOnboardingComplete,
  setProfileComplete,
} from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import toast from 'react-hot-toast';

const wizardContent = {
  en: {
    patient: [
      {
        title: 'Welcome to The Care Nexus',
        description:
          "Your personal health companion. Book appointments, track prescriptions, and manage your family's health in one place.",
        icon: HeartPulse,
      },
      {
        title: 'Book Appointments Easily',
        description:
          'Find clinics, choose your doctor, pick a slot, and confirm in under 2 minutes.',
        icon: CalendarIcon,
      },
      {
        title: 'Your Health Timeline',
        description:
          'Every prescription, diagnosis, and visit is automatically saved and searchable.',
        icon: FilePlus2,
      },
      {
        title: 'Manage Your Family',
        description:
          'Add family members and track their health alongside yours from one account.',
        icon: Users,
      },
    ],
    doctor: [
      {
        title: 'Welcome, Doctor',
        description:
          'The Care Nexus helps you manage patients, prescriptions, and schedules from a single workspace.',
        icon: Crown,
      },
      {
        title: 'Voice Prescriptions',
        description:
          'Speak in English or Urdu and let the AI transcribe and structure the prescription instantly.',
        icon: MicIcon,
      },
      {
        title: 'Set Your Schedule',
        description:
          'Define your available slots per day so patients only book within your availability.',
        icon: CalendarIcon,
      },
      {
        title: 'Chat with Patients',
        description: 'Communicate directly through the built-in secure chat.',
        icon: Users,
      },
    ],
    clinic_admin: [
      {
        title: 'Welcome to Your Clinic Dashboard',
        description:
          'Manage doctors, staff, appointments, and revenue from one dashboard.',
        icon: House,
      },
      {
        title: 'Build Your Doctor Network',
        description:
          'Add doctors by email so they appear in your clinic roster immediately.',
        icon: UserRound,
      },
      {
        title: 'Track Your Performance',
        description:
          'Review patient flow, revenue reports, and doctor stats in real time.',
        icon: Info,
      },
      {
        title: 'Configure Your Clinic',
        description:
          'Set your clinic details, working hours, and staff accounts.',
        icon: FilePlus2,
      },
    ],
  },
  ur: {
    patient: [
      {
        title: 'میڈ ایز میں خوش آمدید',
        description: 'اپنی صحت، اپائنٹمنٹ اور ریکارڈز ایک ہی جگہ پر سنبھالیں۔',
        icon: HeartPulse,
      },
      {
        title: 'آسان اپائنٹمنٹ بک کریں',
        description:
          'کلینک تلاش کریں، ڈاکٹر منتخب کریں، وقت چنیں اور جلدی کنفرم کریں۔',
        icon: CalendarIcon,
      },
      {
        title: 'آپ کی صحت کی تاریخ',
        description:
          'ہر نسخہ، تشخیص اور وزٹ محفوظ رہتا ہے اور بعد میں تلاش کیا جا سکتا ہے۔',
        icon: FilePlus2,
      },
      {
        title: 'خاندان کا انتظام کریں',
        description:
          'اپنے اہلِ خانہ کو شامل کریں اور ایک اکاؤنٹ سے سب کی صحت دیکھیں۔',
        icon: Users,
      },
    ],
    doctor: [
      {
        title: 'ڈاکٹر خوش آمدید',
        description: 'میڈ ایز سے مریض، نسخے اور شیڈول ایک ہی جگہ پر سنبھالیں۔',
        icon: Crown,
      },
      {
        title: 'آواز سے نسخہ',
        description: 'اردو یا انگلش میں بولیں اور AI فوراً نسخہ تیار کرے۔',
        icon: MicIcon,
      },
      {
        title: 'اپنا شیڈول سیٹ کریں',
        description:
          'ہر دن کے دستیاب وقت مقرر کریں تاکہ مریض صرف اسی میں بک کریں۔',
        icon: CalendarIcon,
      },
      {
        title: 'مریضوں سے چیٹ کریں',
        description: 'بلٹ اِن محفوظ چیٹ کے ذریعے براہ راست رابطہ رکھیں۔',
        icon: Users,
      },
    ],
    clinic_admin: [
      {
        title: 'اپنے کلینک ڈیش بورڈ میں خوش آمدید',
        description: 'ڈاکٹرز، عملہ، اپائنٹمنٹس اور آمدنی ایک جگہ منظم کریں۔',
        icon: House,
      },
      {
        title: 'ڈاکٹر نیٹ ورک بنائیں',
        description:
          'ای میل کے ذریعے ڈاکٹر شامل کریں اور فوراً فہرست میں دیکھیں۔',
        icon: UserRound,
      },
      {
        title: 'کارکردگی دیکھیں',
        description: 'مریض فلو، آمدنی اور ڈاکٹر اسٹیٹس ریئل ٹائم میں دیکھیں۔',
        icon: Info,
      },
      {
        title: 'کلینک ترتیب دیں',
        description: 'کلینک کی تفصیل، اوقات اور اسٹاف اکاؤنٹس سیٹ کریں۔',
        icon: FilePlus2,
      },
    ],
  },
} as const;

const fieldLabels = {
  en: {
    completeProfileBanner: 'Complete your profile to unlock all features.',
    completeProfileBtn: 'Complete Profile',
    skip: 'Skip',
    next: 'Next',
    back: 'Back',
    getStarted: 'Get Started',
    saveProfile: 'Save Profile',
    saveSettings: 'Save Settings',
    review: 'Review & Save',
    editSection: 'Edit',
    patientProfileSaved: 'Profile completed! Welcome to The Care Nexus.',
    doctorProfileSaved: "Profile saved! You're all set.",
    clinicProfileSaved: 'Clinic profile saved! Welcome to The Care Nexus.',
    profileSaveError: 'Failed to save profile. Please try again.',
    fullName: 'Full Name',
    dob: 'Date of Birth',
    gender: 'Gender',
    phone: 'Phone Number',
    photo: 'Profile Photo',
    bloodGroup: 'Blood Group',
    allergies: 'Allergies',
    chronicConditions: 'Chronic Conditions',
    emergencyName: 'Emergency Contact Name',
    emergencyPhone: 'Emergency Contact Number',
    specialization: 'Specialization',
    licenseNumber: 'Medical License Number',
    experience: 'Years of Experience',
    fee: 'Consultation Fee (PKR)',
    bio: 'About / Bio',
    city: 'City',
    clinicName: 'Clinic Name',
    clinicType: 'Clinic Type',
    regNumber: 'Registration Number',
    address1: 'Address Line 1',
    address2: 'Address Line 2',
    workingHours: 'Working Hours',
    email: 'Email',
  },
  ur: {
    completeProfileBanner:
      'تمام فیچرز استعمال کرنے کے لیے اپنا پروفائل مکمل کریں۔',
    completeProfileBtn: 'پروفائل مکمل کریں',
    skip: 'اسکپ',
    next: 'اگلا',
    back: 'واپس',
    getStarted: 'شروع کریں',
    saveProfile: 'پروفائل محفوظ کریں',
    saveSettings: 'سیٹنگز محفوظ کریں',
    review: 'جائزہ اور محفوظ کریں',
    editSection: 'ترمیم',
    patientProfileSaved: 'پروفائل مکمل ہوگیا! میڈ ایز میں خوش آمدید۔',
    doctorProfileSaved: 'پروفائل محفوظ ہوگیا! سب تیار ہے۔',
    clinicProfileSaved: 'کلینک پروفائل محفوظ ہوگیا! میڈ ایز میں خوش آمدید۔',
    profileSaveError: 'پروفائل محفوظ نہیں ہو سکا۔ دوبارہ کوشش کریں۔',
    fullName: 'پورا نام',
    dob: 'تاریخ پیدائش',
    gender: 'جنس',
    phone: 'فون نمبر',
    photo: 'پروفائل تصویر',
    bloodGroup: 'بلڈ گروپ',
    allergies: 'الرجی',
    chronicConditions: 'دائمی بیماریاں',
    emergencyName: 'ایمرجنسی رابطہ نام',
    emergencyPhone: 'ایمرجنسی رابطہ نمبر',
    specialization: 'تخصص',
    licenseNumber: 'میڈیکل لائسنس نمبر',
    experience: 'تجربہ (سال)',
    fee: 'مشاورت فیس (روپے)',
    bio: 'اپنے بارے میں',
    city: 'شہر',
    clinicName: 'کلینک کا نام',
    clinicType: 'کلینک کی قسم',
    regNumber: 'رجسٹریشن نمبر',
    address1: 'پتہ لائن 1',
    address2: 'پتہ لائن 2',
    workingHours: 'کام کے اوقات',
    email: 'ای میل',
  },
} as const;

const specializationOptions = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'ENT',
  'Psychiatrist',
  'Gynecologist',
  'Oncologist',
  'Other',
];

const clinicTypeOptions = [
  'General',
  'Specialized',
  'Diagnostic Center',
  'Hospital',
  'Other',
];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['male', 'female', 'other'];

type WorkingDay = {
  closed: boolean;
  open: string;
  close: string;
};

const defaultWorkingHours: Record<string, WorkingDay> = {
  monday: { closed: false, open: '09:00', close: '17:00' },
  tuesday: { closed: false, open: '09:00', close: '17:00' },
  wednesday: { closed: false, open: '09:00', close: '17:00' },
  thursday: { closed: false, open: '09:00', close: '17:00' },
  friday: { closed: false, open: '09:00', close: '17:00' },
  saturday: { closed: true, open: '09:00', close: '17:00' },
  sunday: { closed: true, open: '09:00', close: '17:00' },
};

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type='button'
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-surface-lavender ',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [current, setCurrent] = useState('');

  const addTag = () => {
    const trimmed = current.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setCurrent('');
  };

  return (
    <div className='space-y-2'>
      <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary'>
        {label}
      </label>
      <div className='flex flex-wrap gap-2 rounded-2xl border border-border-light bg-white p-3'>
        {value.map((tag) => (
          <span
            key={tag}
            className='inline-flex items-center gap-2 rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary'
          >
            {tag}
            <button
              type='button'
              onClick={() => onChange(value.filter((item) => item !== tag))}
              className='text-primary/70 hover:text-primary'
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={placeholder}
          className='min-w-45 flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary :text-text-secondary'
        />
      </div>
    </div>
  );
}

function FileField({
  label,
  preview,
  onFile,
  onClear,
}: {
  label: string;
  preview: string;
  onFile: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className='space-y-2'>
      <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary'>
        {label}
      </label>
      <div className='flex items-center gap-4 rounded-2xl border border-dashed border-border p-4'>
        <div className='h-16 w-16 overflow-hidden rounded-2xl bg-surface flex items-center justify-center'>
          {preview ? (
            <img
              src={preview}
              alt={label}
              className='h-full w-full object-cover'
            />
          ) : (
            <UserRound className='h-7 w-7 text-text-secondary' />
          )}
        </div>
        <div className='flex-1 space-y-2'>
          <input
            type='file'
            accept='image/*'
            onChange={(event) => onFile(event.target.files?.[0] || null)}
          />
          {preview && (
            <button
              type='button'
              onClick={onClear}
              className='text-xs font-bold text-primary hover:underline'
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OnboardingWizard({
  role,
  locale,
  onSkip,
  onComplete,
}: {
  role: Role;
  locale: 'en' | 'ur';
  onSkip: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const steps = wizardContent[locale][role];
  const active = steps[step];
  const StepIcon = active.icon;

  return createPortal(
    <div className='fixed inset-0 z-600 flex items-center justify-center bg-black/60 backdrop-blur-md p-4'>
      <div className='relative w-full max-w-xl rounded-2xl border border-white/10 bg-white p-6'>
        <button
          type='button'
          onClick={onSkip}
          className='absolute right-4 top-4 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-primary'
        >
          {fieldLabels[locale].skip}
        </button>

        <div className='mb-6 flex items-center justify-between pr-16'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-bg text-primary'>
              <StepIcon className='h-6 w-6' />
            </div>
            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary'>
                {fieldLabels[locale].completeProfileBanner}
              </p>
              <h2 className='text-2xl font-black text-text-primary'>
                {active.title}
              </h2>
            </div>
          </div>
        </div>

        <p className='text-sm leading-7 text-text-secondary'>
          {active.description}
        </p>

        <div className='mt-8 flex items-center justify-between gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setStep((value) => Math.max(value - 1, 0))}
            disabled={step === 0}
            className=''
          >
            {fieldLabels[locale].back}
          </Button>
          <div className='flex items-center gap-2'>
            {steps.map((_, index) => (
              <span
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full',
                  index === step ? 'bg-primary' : 'bg-surface-lavender ',
                )}
              />
            ))}
          </div>
          {step < steps.length - 1 ? (
            <Button
              type='button'
              onClick={() => setStep((value) => value + 1)}
              className=''
            >
              {fieldLabels[locale].next} <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <Button type='button' onClick={onComplete} className=''>
              {fieldLabels[locale].getStarted}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProfileBanner({
  locale,
  onOpen,
  onDismiss,
}: {
  locale: 'en' | 'ur';
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className='sticky top-16 z-40 border-b border-primary/30 bg-primary-bg px-4 py-3 shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <AlertTriangle className='h-5 w-5 text-primary' />
          <p className='text-sm font-medium text-text-primary'>
            {fieldLabels[locale].completeProfileBanner}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={onOpen}
            className='rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-primary-hover'
          >
            {fieldLabels[locale].completeProfileBtn}
          </button>
          <button
            onClick={onDismiss}
            className='rounded-full p-2 text-text-secondary hover:bg-black/5 hover:text-text-primary :bg-white/5 :text-white'
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileCompletionModal({
  role,
  locale,
  user,
  onClose,
  onCompleted,
}: {
  role: Role;
  locale: 'en' | 'ur';
  user: NonNullable<RootState['auth']['user']>;
  onClose: () => void;
  onCompleted: () => void;
}) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [patientUpdate, { isLoading: isSavingPatient }] =
    usePatientUpdateProfileMutation();
  const [doctorUpdate, { isLoading: isSavingDoctor }] =
    useUpdateDoctorProfileMutation();
  const [clinicSave, { isLoading: isSavingClinic }] = useSaveSettingsMutation();
  const [markProfileComplete, { isLoading: isMarkingProfileComplete }] =
    useMarkProfileCompleteMutation();
  const [photoPreview, setPhotoPreview] = useState('');
  const [workingHours, setWorkingHours] =
    useState<Record<string, WorkingDay>>(defaultWorkingHours);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [state, setState] = useState(() => ({
    patient: {
      name: user?.name || '',
      dob: '',
      gender: '',
      contact: user?.phone || '',
      bloodGroup: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
    doctor: {
      name: user?.name || '',
      phone: user?.phone || '',
      gender: '',
      city: '',
      specialization: '',
      licenseNo: '',
      experience: '',
      consultationFee: '',
      bio: '',
    },
    clinic: {
      name: user?.name || '',
      clinicType: 'General',
      registrationNumber: '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: '',
      addressLine2: '',
      city: '',
      logo: '',
    },
  }));

  const labels = fieldLabels[locale];

  const uploadToPreview = (
    file: File | null,
    setter: (next: string) => void,
  ) => {
    if (!file) {
      setter('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setter(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken') || '';
      const syncAuthUser = (nextFields: Record<string, unknown>) => {
        dispatch(
          setCredentials({
            user: { ...user, ...nextFields } as NonNullable<
              RootState['auth']['user']
            >,
            accessToken,
          }),
        );
      };

      if (role === 'patient') {
        await patientUpdate({
          name: state.patient.name,
          dob: state.patient.dob,
          gender: state.patient.gender,
          bloodGroup: state.patient.bloodGroup,
          allergies,
          chronicConditions: conditions,
          contact: state.patient.contact,
          emergencyContactName: state.patient.emergencyContactName,
          emergencyContactPhone: state.patient.emergencyContactPhone,
          profilePhoto: photoPreview || undefined,
        }).unwrap();
        syncAuthUser({
          name: state.patient.name,
          phone: state.patient.contact,
          photo: photoPreview || user.photo || null,
        });
      } else if (role === 'doctor') {
        await doctorUpdate({
          name: state.doctor.name,
          phone: state.doctor.phone,
          gender: state.doctor.gender,
          city: state.doctor.city,
          specialization: state.doctor.specialization,
          licenseNo: state.doctor.licenseNo,
          experience: Number(state.doctor.experience || 0),
          consultationFee: Math.round(
            Number(state.doctor.consultationFee || 0),
          ),
          bio: state.doctor.bio,
          photo: photoPreview || undefined,
        }).unwrap();
        syncAuthUser({
          name: state.doctor.name,
          phone: state.doctor.phone,
          photo: photoPreview || user.photo || null,
        });
      } else {
        await clinicSave({
          name: state.clinic.name,
          clinicType: state.clinic.clinicType,
          registrationNumber: state.clinic.registrationNumber,
          phone: state.clinic.phone,
          email: state.clinic.email,
          address: state.clinic.address,
          addressLine2: state.clinic.addressLine2,
          city: state.clinic.city,
          photo: photoPreview || undefined,
          workingHours,
        }).unwrap();
        syncAuthUser({
          name: state.clinic.name,
          phone: state.clinic.phone,
          photo: photoPreview || user.photo || null,
        });
      }

      await markProfileComplete().unwrap();
      dispatch(setProfileComplete());
      toast.success(
        role === 'patient'
          ? labels.patientProfileSaved
          : role === 'doctor'
            ? labels.doctorProfileSaved
            : labels.clinicProfileSaved,
      );
      onCompleted();
      onClose();
    } catch (error) {
      console.error('Profile save failed', error);
      toast.error(labels.profileSaveError);
    }
  };

  const progress = role === 'clinic_admin' ? (step + 1) / 3 : (step + 1) / 3;

  return (
    <Modal isOpen title={labels.review} onClose={onClose} size='xl'>
      <div className='space-y-6'>
        <div className='h-2 w-full overflow-hidden rounded-full bg-surface'>
          <div
            className='h-full rounded-full bg-primary transition-all'
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>

        {role === 'patient' && step === 0 && (
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              label={labels.fullName}
              value={state.patient.name}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  patient: { ...current.patient, name: event.target.value },
                }))
              }
            />
            <Input
              label={labels.dob}
              type='date'
              value={state.patient.dob}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  patient: { ...current.patient, dob: event.target.value },
                }))
              }
            />
            <div>
              <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2'>
                {labels.gender}
              </label>
              <select
                value={state.patient.gender}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    patient: { ...current.patient, gender: event.target.value },
                  }))
                }
                className='h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
              >
                <option value=''>Select</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={labels.phone}
              type='tel'
              value={state.patient.contact}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  patient: { ...current.patient, contact: event.target.value },
                }))
              }
            />
            <div className='md:col-span-2'>
              <FileField
                label={labels.photo}
                preview={photoPreview}
                onFile={(file) => uploadToPreview(file, setPhotoPreview)}
                onClear={() => setPhotoPreview('')}
              />
            </div>
          </div>
        )}

        {role === 'patient' && step === 1 && (
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2'>
                {labels.bloodGroup}
              </label>
              <select
                value={state.patient.bloodGroup}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    patient: {
                      ...current.patient,
                      bloodGroup: event.target.value,
                    },
                  }))
                }
                className='h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
              >
                <option value=''>Select</option>
                {bloodGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <TagInput
              label={labels.allergies}
              value={allergies}
              onChange={setAllergies}
              placeholder={labels.allergies}
            />
            <TagInput
              label={labels.chronicConditions}
              value={conditions}
              onChange={setConditions}
              placeholder={labels.chronicConditions}
            />
            <Input
              label={labels.emergencyName}
              value={state.patient.emergencyContactName}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  patient: {
                    ...current.patient,
                    emergencyContactName: event.target.value,
                  },
                }))
              }
            />
            <Input
              label={labels.emergencyPhone}
              type='tel'
              value={state.patient.emergencyContactPhone}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  patient: {
                    ...current.patient,
                    emergencyContactPhone: event.target.value,
                  },
                }))
              }
            />
          </div>
        )}

        {role === 'patient' && step === 2 && (
          <div className='space-y-4 rounded-2xl border border-border-light p-5'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>{labels.fullName}</span>
              <button
                type='button'
                className='text-sm font-semibold text-primary'
                onClick={() => setStep(0)}
              >
                {labels.editSection}
              </button>
            </div>
            <p className='text-sm text-text-secondary'>
              {state.patient.name || '-'}
            </p>
            <div className='flex items-center justify-between border-t border-border-light pt-4'>
              <span className='text-sm font-medium'>{labels.bloodGroup}</span>
              <button
                type='button'
                className='text-sm font-semibold text-primary'
                onClick={() => setStep(1)}
              >
                {labels.editSection}
              </button>
            </div>
            <p className='text-sm text-text-secondary'>
              {state.patient.bloodGroup || '-'}
            </p>
            <Button
              type='button'
              className='w-full'
              onClick={handleSubmit}
              disabled={isSavingPatient || isMarkingProfileComplete}
            >
              {labels.saveProfile}
            </Button>
          </div>
        )}

        {role === 'doctor' && step === 0 && (
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              label={labels.fullName}
              value={state.doctor.name}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  doctor: { ...current.doctor, name: event.target.value },
                }))
              }
            />
            <Input
              label={labels.phone}
              type='tel'
              value={state.doctor.phone}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  doctor: { ...current.doctor, phone: event.target.value },
                }))
              }
            />
            <div>
              <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2'>
                {labels.gender}
              </label>
              <select
                value={state.doctor.gender}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    doctor: { ...current.doctor, gender: event.target.value },
                  }))
                }
                className='h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
              >
                <option value=''>Select</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={labels.city}
              value={state.doctor.city}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  doctor: { ...current.doctor, city: event.target.value },
                }))
              }
            />
            <div className='md:col-span-2'>
              <FileField
                label={labels.photo}
                preview={photoPreview}
                onFile={(file) => uploadToPreview(file, setPhotoPreview)}
                onClear={() => setPhotoPreview('')}
              />
            </div>
          </div>
        )}

        {role === 'doctor' && step === 1 && (
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2'>
                {labels.specialization}
              </label>
              <select
                value={state.doctor.specialization}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    doctor: {
                      ...current.doctor,
                      specialization: event.target.value,
                    },
                  }))
                }
                className='h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
              >
                <option value=''>Select</option>
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={labels.licenseNumber}
              value={state.doctor.licenseNo}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  doctor: { ...current.doctor, licenseNo: event.target.value },
                }))
              }
            />
            <Input
              label={labels.experience}
              type='number'
              min='0'
              value={state.doctor.experience}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  doctor: { ...current.doctor, experience: event.target.value },
                }))
              }
            />
            <Input
              label={labels.fee}
              type='number'
              min='0'
              value={state.doctor.consultationFee}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  doctor: {
                    ...current.doctor,
                    consultationFee: event.target.value,
                  },
                }))
              }
            />
            <div className='md:col-span-2'>
              <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2'>
                {labels.bio}
              </label>
              <textarea
                value={state.doctor.bio}
                maxLength={300}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    doctor: { ...current.doctor, bio: event.target.value },
                  }))
                }
                className='min-h-32 w-full rounded-lg border border-border-light bg-white px-5 py-4 text-sm'
              />
            </div>
          </div>
        )}

        {role === 'doctor' && step === 2 && (
          <div className='rounded-2xl border border-border-light p-5'>
            <p className='text-sm text-text-secondary'>
              You'll be added to clinics by clinic admins. This step is
              automatic.
            </p>
            <div className='mt-4 flex items-center justify-between'>
              <button
                type='button'
                className='text-sm font-semibold text-primary'
                onClick={() => setStep(0)}
              >
                {labels.editSection}
              </button>
              <Button
                type='button'
                className=''
                onClick={handleSubmit}
                disabled={isSavingDoctor || isMarkingProfileComplete}
              >
                {labels.saveProfile}
              </Button>
            </div>
          </div>
        )}

        {role === 'clinic_admin' && step === 0 && (
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              label={labels.clinicName}
              value={state.clinic.name}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: { ...current.clinic, name: event.target.value },
                }))
              }
            />
            <div>
              <label className='block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2'>
                {labels.clinicType}
              </label>
              <select
                value={state.clinic.clinicType}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    clinic: {
                      ...current.clinic,
                      clinicType: event.target.value,
                    },
                  }))
                }
                className='h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
              >
                {clinicTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={labels.regNumber}
              value={state.clinic.registrationNumber}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: {
                    ...current.clinic,
                    registrationNumber: event.target.value,
                  },
                }))
              }
            />
            <Input
              label={labels.phone}
              value={state.clinic.phone}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: { ...current.clinic, phone: event.target.value },
                }))
              }
            />
            <Input
              label={labels.email}
              type='email'
              value={state.clinic.email}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: { ...current.clinic, email: event.target.value },
                }))
              }
            />
            <div className='md:col-span-2'>
              <FileField
                label={labels.photo}
                preview={photoPreview}
                onFile={(file) => uploadToPreview(file, setPhotoPreview)}
                onClear={() => setPhotoPreview('')}
              />
            </div>
          </div>
        )}

        {role === 'clinic_admin' && step === 1 && (
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              label={labels.address1}
              value={state.clinic.address}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: { ...current.clinic, address: event.target.value },
                }))
              }
            />
            <Input
              label={labels.address2}
              value={state.clinic.addressLine2}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: {
                    ...current.clinic,
                    addressLine2: event.target.value,
                  },
                }))
              }
            />
            <Input
              label={labels.city}
              value={state.clinic.city}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  clinic: { ...current.clinic, city: event.target.value },
                }))
              }
            />
            <div className='md:col-span-2 rounded-2xl border border-border-light p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-bold'>{labels.workingHours}</span>
                <button
                  type='button'
                  className='text-sm font-semibold text-primary'
                  onClick={() => setStep(0)}
                >
                  {labels.editSection}
                </button>
              </div>
              <div className='mt-4 space-y-3'>
                {Object.entries(workingHours).map(([day, value]) => (
                  <div
                    key={day}
                    className='grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-2xl border border-border-light p-3'
                  >
                    <span className='text-sm font-medium capitalize'>
                      {day}
                    </span>
                    <ToggleSwitch
                      checked={!value.closed}
                      onChange={(checked) =>
                        setWorkingHours((current) => ({
                          ...current,
                          [day]: { ...current[day], closed: !checked },
                        }))
                      }
                    />
                    {!value.closed ? (
                      <>
                        <Input
                          type='time'
                          value={value.open}
                          onChange={(event) =>
                            setWorkingHours((current) => ({
                              ...current,
                              [day]: {
                                ...current[day],
                                open: event.target.value,
                              },
                            }))
                          }
                        />
                        <Input
                          type='time'
                          value={value.close}
                          onChange={(event) =>
                            setWorkingHours((current) => ({
                              ...current,
                              [day]: {
                                ...current[day],
                                close: event.target.value,
                              },
                            }))
                          }
                        />
                      </>
                    ) : (
                      <span className='text-xs font-semibold text-text-secondary'>
                        Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {role === 'clinic_admin' && step === 2 && (
          <div className='rounded-2xl border border-border-light p-5'>
            <div className='flex items-center justify-between'>
              <button
                type='button'
                className='text-sm font-semibold text-primary'
                onClick={() => setStep(0)}
              >
                {labels.editSection}
              </button>
              <Button
                type='button'
                className=''
                onClick={handleSubmit}
                disabled={isSavingClinic || isMarkingProfileComplete}
              >
                {labels.saveSettings}
              </Button>
            </div>
          </div>
        )}

        <div className='flex items-center justify-between pt-2'>
          <Button
            type='button'
            variant='outline'
            className=''
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            disabled={step === 0}
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> {fieldLabels[locale].back}
          </Button>
          {step < 2 && (
            <Button
              type='button'
              className=''
              onClick={() => setStep((current) => current + 1)}
            >
              {fieldLabels[locale].next}{' '}
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

type Role = 'patient' | 'doctor' | 'clinic_admin';

export default function OnboardingGate({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const locale = useLocale() as 'en' | 'ur';
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [markOnboardingComplete] = useMarkOnboardingCompleteMutation();

  const onboardingCompleted = Boolean(
    user?.onboardingCompleted ?? user?.onboardingComplete,
  );
  const profileCompleted = Boolean(
    user?.profileCompleted ?? user?.profileComplete,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user?.email) return;
    setIsNewSignup(localStorage.getItem('carenexus_new_signup') === user.email);
  }, [mounted, user?.email]);

  useEffect(() => {
    if (!mounted || !user) return;
    if (!onboardingCompleted && isNewSignup) {
      setWizardOpen(true);
      return;
    }
    setWizardOpen(false);
  }, [mounted, onboardingCompleted, isNewSignup, user]);

  const handleFinishWizard = async () => {
    if (user?.email) {
      localStorage.removeItem('carenexus_new_signup');
    }

    try {
      await markOnboardingComplete().unwrap();
      dispatch(setOnboardingComplete());
    } catch {
      dispatch(setOnboardingComplete());
    } finally {
      setWizardOpen(false);
    }
  };

  const shouldShowBanner =
    mounted &&
    user &&
    onboardingCompleted &&
    !profileCompleted &&
    !bannerDismissed &&
    !wizardOpen;

  if (!mounted || !user) return null;

  return (
    <>
      {shouldShowBanner && (
        <ProfileBanner
          locale={locale}
          onOpen={() => setProfileOpen(true)}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {wizardOpen && (
        <OnboardingWizard
          role={role}
          locale={locale}
          onSkip={handleFinishWizard}
          onComplete={handleFinishWizard}
        />
      )}

      {profileOpen && (
        <ProfileCompletionModal
          role={role}
          locale={locale}
          user={user}
          onClose={() => setProfileOpen(false)}
          onCompleted={() => setBannerDismissed(true)}
        />
      )}
      {children}
    </>
  );
}
