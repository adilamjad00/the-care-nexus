'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Pill,
  User,
} from 'lucide-react';
import { useGetPrescriptionByIdQuery } from '@/store/api/doctorApi';
import { useTranslations } from 'next-intl';

export default function DoctorPrescriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const id = params.id as string;
  const { data, isLoading, error } = useGetPrescriptionByIdQuery(id, {
    skip: !id,
  });

  const prescription = data?.data;

  const handlePrint = () => window.print();

  return (
    <div className='space-y-6 animate-in fade-in duration-300'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => router.push('/dashboard/doctor/prescriptions')}
          className='h-10 w-10 rounded-lg border border-border-light bg-white flex items-center justify-center hover:bg-surface transition-colors'
          title={t('common.back')}
        >
          <ArrowLeft className='h-5 w-5 text-text-secondary' />
        </button>
        <div>
          <h1 className='text-2xl font-bold text-text-primary'>
            {t('doctor.prescriptions.title')}
          </h1>
          <p className='text-sm text-text-secondary'>{id}</p>
        </div>
      </div>

      {isLoading ? (
        <div className='rounded-2xl border border-border-light bg-white p-10 text-center text-text-secondary'>
          {t('common.loading')}
        </div>
      ) : error || !prescription ? (
        <div className='rounded-2xl border border-border-light bg-white p-10 text-center'>
          <p className='text-text-secondary'>
            {t('doctor.prescriptions.notFound')}
          </p>
          <Link
            href='/dashboard/doctor/prescriptions'
            className='mt-4 inline-flex text-primary font-semibold hover:underline'
          >
            {t('common.back')}
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='rounded-2xl border border-border-light bg-white p-6 md:p-8 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div className='flex items-center gap-4'>
                <div className='h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary'>
                  <FileText className='h-7 w-7' />
                </div>
                <div>
                  <p className='text-xs font-bold uppercase tracking-widest text-text-secondary'>
                    {t('doctor.prescriptions.medicalPrescription') ||
                      t('doctor.prescriptions.title')}
                  </p>
                  <h2 className='text-xl md:text-2xl font-black text-text-primary'>
                    {prescription.diagnosis || t('common.noData')}
                  </h2>
                </div>
              </div>
              <button
                type='button'
                onClick={handlePrint}
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors'
              >
                <Download className='h-4 w-4' />
                {t('common.download')}
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='rounded-2xl border border-border-light bg-white p-6'>
              <div className='mb-4 flex items-center gap-2 text-primary'>
                <User className='h-5 w-5' />
                <h3 className='font-bold'>{t('prescription.patientInfo')}</h3>
              </div>
              <p className='font-semibold text-text-primary'>
                {prescription.patientId?.name || t('common.noData')}
              </p>
              <p className='text-sm text-text-secondary'>
                {prescription.patientId?.email || t('common.noData')}
              </p>
              <p className='text-sm text-text-secondary'>
                {prescription.patientId?.phone || t('common.noData')}
              </p>
            </div>

            <div className='rounded-2xl border border-border-light bg-white p-6'>
              <div className='mb-4 flex items-center gap-2 text-primary'>
                <Calendar className='h-5 w-5' />
                <h3 className='font-bold'>{t('common.date')}</h3>
              </div>
              <p className='font-semibold text-text-primary'>
                {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
              <p className='text-sm text-text-secondary'>
                {prescription.followUpDate
                  ? new Date(prescription.followUpDate).toLocaleDateString()
                  : t('common.noData')}
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-border-light bg-white p-6'>
            <div className='mb-4 flex items-center gap-2 text-primary'>
              <Pill className='h-5 w-5' />
              <h3 className='font-bold'>
                {t('prescription.prescribedMedicines')}
              </h3>
            </div>
            <div className='space-y-3'>
              {(prescription.medicines || []).map(
                (medicine: any, index: number) => (
                  <div
                    key={`${medicine.name}-${index}`}
                    className='rounded-2xl border border-border-light bg-surface p-4'
                  >
                    <p className='font-bold text-text-primary'>
                      {medicine.name}
                    </p>
                    <p className='text-sm text-text-secondary'>
                      {medicine.dosage} · {medicine.frequency} ·{' '}
                      {medicine.duration}
                    </p>
                    {medicine.instructions ? (
                      <p className='mt-1 text-sm text-text-secondary'>
                        {medicine.instructions}
                      </p>
                    ) : null}
                  </div>
                ),
              )}
              {(prescription.medicines || []).length === 0 && (
                <p className='text-sm text-text-secondary'>
                  {t('common.noData')}
                </p>
              )}
            </div>
          </div>

          <div className='rounded-2xl border border-border-light bg-white p-6'>
            <h3 className='mb-4 font-bold text-text-primary'>
              {t('doctor.prescriptions.billingConsultation')}
            </h3>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl bg-surface p-4'>
                <p className='text-xs font-bold uppercase tracking-widest text-text-secondary'>
                  {t('doctor.prescriptions.consultationFee')}
                </p>
                <p className='mt-1 text-lg font-black text-text-primary'>
                  {Number(prescription.consultationFee || 0).toLocaleString()}{' '}
                  {t('common.pkr')}
                </p>
              </div>
              <div className='rounded-2xl bg-surface p-4'>
                <p className='text-xs font-bold uppercase tracking-widest text-text-secondary'>
                  {t('doctor.prescriptions.medicineCost')}
                </p>
                <p className='mt-1 text-lg font-black text-text-primary'>
                  {Number(prescription.medicineCost || 0).toLocaleString()}{' '}
                  {t('common.pkr')}
                </p>
              </div>
              <div className='rounded-2xl bg-primary/10 p-4'>
                <p className='text-xs font-bold uppercase tracking-widest text-primary'>
                  {t('doctor.prescriptions.totalBilling')}
                </p>
                <p className='mt-1 text-lg font-black text-primary'>
                  {Number(prescription.totalCost || 0).toLocaleString()}{' '}
                  {t('common.pkr')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
