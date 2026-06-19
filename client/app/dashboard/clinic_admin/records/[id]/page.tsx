'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import NextImage from 'next/image';
import { useGetRecordDetailQuery } from '@/store/api/patientApi';
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  Pill,
  FileText,
  Printer,
  X,
  ZoomIn,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useFormatter, useTranslations } from 'next-intl';

export default function ClinicAdminRecordDetailPage() {
  const t = useTranslations();
  const format = useFormatter();
  const params = useParams();
  const router = useRouter();
  const search = useSearchParams();
  const id = params?.id as string;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading } = useGetRecordDetailQuery(id);
  const prescription = data?.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format.dateTime(date, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGenderLabel = (gender?: string) => {
    if (!gender) return 'N/A';
    const key = `form.${gender.toLowerCase()}`;
    return t.has(key) ? t(key) : gender;
  };

  const patientInfoLabel = t.has('prescription.patientInfo')
    ? t('prescription.patientInfo')
    : t('patient.profile.info');
  const issueDateLabel = t.has('prescription.issueDate')
    ? t('prescription.issueDate')
    : 'Issue Date';
  const doctorSignatureLabel = t.has('prescription.doctorSignature')
    ? t('prescription.doctorSignature')
    : 'Doctor Signature';

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='h-8 w-48 animate-pulse rounded bg-surface' />
        <div className='h-64 animate-pulse rounded-2xl border border-border-light bg-white' />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className='rounded-2xl border border-border-light bg-white p-12 text-center'>
        <FileText className='mx-auto h-12 w-12 text-text-secondary' />
        <h3 className='mt-4 text-lg font-semibold text-text-primary'>
          {t('prescription.notFound')}
        </h3>
        <Button onClick={() => router.back()} className='mt-4'>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-text-secondary hover:text-text-primary :text-white transition-colors self-start'
        >
          <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
          <span className='font-medium'>{t('prescription.backToRecords')}</span>
        </button>
        <div className='flex w-full justify-end sm:w-auto'>
          <Button
            onClick={handlePrint}
            variant='outline'
            className='w-full sm:w-auto bg-white border-black/10 h-10 sm:h-11 px-4 sm:px-6 text-[10px] font-black uppercase tracking-widest transition-all'
          >
            <Printer className='mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0' />
            {t('prescription.printPrescription')}
          </Button>
        </div>
      </div>

      <div className='rounded-2xl border border-black/5 bg-white p-4 sm:p-8 lg:p-12 print:border-none print:p-0 print:bg-white print:text-black'>
        <div className='mb-8 border-b border-border-light pb-6'>
          <div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-text-primary print:text-2xl'>
                {t('prescription.medicalPrescription')}
              </h1>
              <p className='mt-2 flex items-center gap-2 text-sm text-text-secondary print:text-xs'>
                <Calendar className='h-4 w-4' />
                {formatDate(prescription.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {prescription.type !== 'document' && (
          <div className='mb-8 grid gap-4 sm:gap-6 md:grid-cols-2 print:grid-cols-2 print:mb-6'>
            <div className='rounded-lg border border-border-light p-4 print:border-border-light'>
              <p className='mb-3 text-xs font-semibold uppercase text-text-secondary print:text-[10px]'>
                {t('prescription.doctorInfo')}
              </p>
              <div className='space-y-2'>
                <p className='flex items-center gap-2 font-semibold text-text-primary print:text-sm'>
                  <User className='h-4 w-4 text-primary' />
                  {t('patient.bookAppointmentPage.doctorPrefix')}{' '}
                  {prescription.doctorId?.name}
                </p>
                <p className='text-sm text-text-secondary print:text-xs'>
                  {prescription.doctorId?.specialization}
                </p>
                {prescription.doctorId?.licenseNumber && (
                  <p className='text-xs text-text-secondary print:text-[9px]'>
                    {t('form.licenseNo')} :{' '}
                    {prescription.doctorId.licenseNumber}
                  </p>
                )}
              </div>
            </div>

            <div className='rounded-lg border border-border-light p-4 print:border-border-light'>
              <p className='mb-3 text-xs font-semibold uppercase text-text-secondary print:text-[10px]'>
                {t('prescription.clinicInfo')}
              </p>
              <div className='space-y-2'>
                <p className='flex items-center gap-2 font-semibold text-text-primary print:text-sm'>
                  <Building2 className='h-4 w-4 text-primary' />
                  {prescription.clinicId?.name}
                </p>
                <p className='text-xs sm:text-sm text-text-secondary print:text-xs wrap-break-word'>
                  {prescription.clinicId?.address}
                </p>
                {prescription.clinicId?.phone && (
                  <p className='flex items-center gap-2 text-xs text-text-secondary print:text-[9px] break-all'>
                    <Phone className='h-3 w-3' />
                    {prescription.clinicId.phone}
                  </p>
                )}
                {prescription.clinicId?.email && (
                  <p className='flex items-center gap-2 text-xs text-text-secondary print:text-[9px] break-all'>
                    <Mail className='h-3 w-3' />
                    {prescription.clinicId.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='mb-8 rounded-lg border border-border-light p-6 print:mb-6 print:border-none print:p-0'>
          <p className='mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary print:mb-2 border-b border-border-light pb-2 print:border-border-light'>
            {patientInfoLabel}
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-x-10 pt-1 print:pt-0'>
            <div className='flex items-center gap-2'>
              <span className='text-[10px] font-bold uppercase text-text-secondary print:text-text-secondary'>
                {t('form.name')}:
              </span>
              <span className='text-sm font-black text-text-primary print:text-sm wrap-break-word'>
                {prescription.patientId?.name || 'N/A'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[10px] font-bold uppercase text-text-secondary print:text-text-secondary'>
                {t('form.gender')}:
              </span>
              <span className='text-sm font-bold text-text-primary capitalize print:text-sm'>
                {getGenderLabel(prescription.patientId?.gender)}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[10px] font-bold uppercase text-text-secondary print:text-text-secondary'>
                {t('patient.profile.bloodGroup')}:
              </span>
              <span className='text-sm font-bold text-text-primary print:text-sm'>
                {prescription.patientId?.bloodGroup || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* diagnosis, medicines, notes, attachments, signature copied from patient view */}
      </div>
    </div>
  );
}
