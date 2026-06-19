'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import NextImage from 'next/image';
import {
  useDeleteRecordMutation,
  useGetRecordDetailQuery,
} from '@/store/api/patientApi';
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
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { useFormatter, useTranslations } from 'next-intl';

function RecordDetailContent() {
  const t = useTranslations();
  const format = useFormatter();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const printableRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading } = useGetRecordDetailQuery(id);
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteRecordMutation();
  const prescription = data?.data;
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && prescription && searchParams.get('print') === 'true') {
      handlePrint();
    }
  }, [isLoading, prescription, searchParams]);

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
    const printWindow = window.open(
      '',
      '_blank',
      'noopener,noreferrer,width=900,height=700',
    );

    if (!printWindow || !printableRef.current) {
      window.print();
      return;
    }

    const copiedHead = document.head.innerHTML;
    const printableContent = printableRef.current.outerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${document.title}</title>
          ${copiedHead}
          <style>
            @media print {
              @page { size: auto; margin: 15mm; }
              body { background: white !important; padding: 0 !important; margin: 0 !important; }
              .print\\:hidden { display: none !important; }
              .print\\:block { display: block !important; }
              .print\\:border-none { border: none !important; }
              .print\\:shadow-none { box-shadow: none !important; }
              .print\\:p-0 { padding: 0 !important; }
              .print\\:mb-0 { margin-bottom: 0 !important; }
              .print\\:mb-2 { margin-bottom: 0.5rem !important; }
              .print\\:mb-6 { margin-bottom: 1.5rem !important; }
              .print\\:pt-0 { padding-top: 0 !important; }
              .print\\:text-sm { font-size: 0.875rem !important; }
              .print\\:text-xs { font-size: 0.75rem !important; }
              .print\\:text-\\[9px\\] { font-size: 9px !important; }
              .print\\:text-\\[10px\\] { font-size: 10px !important; }
              .print\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              .print\\:break-inside-avoid { break-inside: avoid !important; }
              
              /* Ensure colors are printed */
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              
              /* Signature block alignment */
              .min-w-50 { min-width: 200px !important; }
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="p-8">
            ${printableContent}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(id).unwrap();
      toast.success(t('common.success') || 'Record deleted');
      router.push('/dashboard/patient/records');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete record');
    }
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
          {t.has('prescription.notFound')
            ? t('prescription.notFound')
            : 'Prescription not found'}
        </h3>
        <Button onClick={() => router.back()} className='mt-4'>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-text-secondary hover:text-text-primary :text-white transition-colors self-start'
        >
          <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
          <span className='font-medium'>{t('prescription.backToRecords')}</span>
        </button>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto'>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            variant='outline'
            className='w-full bg-white border-red-200 text-red-600 h-10 sm:h-11 px-4 sm:px-6 text-[10px] font-black uppercase tracking-widest hover:bg-red-50'
          >
            {t('patient.records.deleteRecord')}
          </Button>
          <Button
            onClick={handlePrint}
            variant='outline'
            className='w-full bg-white border-black/10 h-10 sm:h-11 px-4 sm:px-6 text-[10px] font-black uppercase tracking-widest transition-all'
          >
            <Printer className='mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0' />
            {t('prescription.printPrescription')}
          </Button>
        </div>
      </div>

      {/* Prescription Details */}
      <div
        ref={printableRef}
        className='rounded-2xl border border-black/5 bg-white p-4 sm:p-8 lg:p-12 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-white print:text-black'
      >
        {/* Header Section */}
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

        {/* Doctor & Clinic Info - Only for prescriptions */}
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
                    {t('form.licenseNo')}: {prescription.doctorId.licenseNumber}
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

        {/* Patient Info - Single line for print */}
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

        {/* Diagnosis */}
        <div className='mb-8 print:mb-6'>
          <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold text-text-primary print:text-sm'>
            <FileText className='h-5 w-5 text-primary print:h-4 print:w-4' />
            {t('prescription.diagnosis')}
          </h3>
          <p className='rounded-lg bg-background p-4 text-text-primary print:bg-white print:p-0 print:text-sm'>
            {prescription.diagnosis}
          </p>
        </div>

        {/* Medicines */}
        {prescription.medicines && prescription.medicines.length > 0 && (
          <div className='mb-8 print:mb-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary print:text-sm'>
              <Pill className='h-5 w-5 text-primary print:h-4 print:w-4' />
              {t('prescription.prescribedMedicines')} (
              {prescription.medicines.length})
            </h3>
            <div className='space-y-4 print:space-y-3'>
              {prescription.medicines.map((medicine: any, index: number) => (
                <div
                  key={index}
                  className='rounded-lg border border-border-light p-4 print:border-border-light print:break-inside-avoid print:bg-white'
                >
                  <div className='mb-2 flex items-start justify-between'>
                    <h4 className='text-lg font-semibold text-text-primary print:text-sm'>
                      {index + 1}. {medicine.name}
                    </h4>
                    <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary print:bg-white print:border print:border-primary/20 print:text-[10px]'>
                      {medicine.dosage}
                    </span>
                  </div>
                  <div className='grid gap-2 text-sm md:grid-cols-2 print:grid-cols-2'>
                    <p className='text-text-secondary print:text-xs'>
                      <span className='font-medium'>
                        {t('prescription.frequency')}:
                      </span>{' '}
                      {medicine.frequency}
                    </p>
                    <p className='text-text-secondary print:text-xs'>
                      <span className='font-medium'>
                        {t('prescription.duration')}:
                      </span>{' '}
                      {medicine.duration}
                    </p>
                  </div>
                  {medicine.instructions && (
                    <p className='mt-2 text-sm italic text-text-secondary print:text-xs'>
                      {medicine.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {prescription.notes && (
          <div className='mb-8 print:mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-text-primary print:text-sm'>
              {t('prescription.additionalNotes')}
            </h3>
            <p className='rounded-lg bg-background p-4 text-text-primary print:bg-white print:p-0 print:text-sm'>
              {prescription.notes}
            </p>
          </div>
        )}

        {/* Attachments / Images Gallery */}
        {prescription.attachments && prescription.attachments.length > 0 && (
          <>
            <div className='print:hidden'>
              <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary'>
                <FileText className='h-5 w-5 text-primary' />
                {t('prescription.uploadedDocuments')} (
                {prescription.attachments.length})
              </h3>
              <div className='grid gap-6 sm:grid-cols-2'>
                {prescription.attachments.map(
                  (attachment: any, index: number) => (
                    <div
                      key={index}
                      className='relative aspect-4/3 overflow-hidden rounded-2xl border border-border-light bg-background group cursor-pointer'
                      onClick={() => setSelectedImage(attachment.fileUrl)}
                    >
                      <NextImage
                        src={attachment.fileUrl}
                        alt={attachment.fileName || `Attachment ${index + 1}`}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <div className='bg-white/20 backdrop-blur-md p-3 rounded-full text-white'>
                          <ZoomIn size={24} />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <Modal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                title={t('prescription.uploadedDocuments')}
                size='xl'
              >
                <div className='relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-black flex items-center justify-center'>
                  {selectedImage && (
                    <NextImage
                      src={selectedImage}
                      alt='Preview'
                      fill
                      className='object-contain'
                    />
                  )}
                </div>
                <div className='mt-4 flex justify-between items-center'>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedImage || '';
                      link.download = `medical-record-${Date.now()}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className='flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all font-bold text-sm'
                  >
                    <Download className='h-4 w-4' />
                    {t('common.download')}
                  </button>
                  <Button
                    onClick={() => setSelectedImage(null)}
                    className='rounded-xl px-8'
                  >
                    {t('common.close')}
                  </Button>
                </div>
              </Modal>
            </div>

            {/* Print attachments */}
            <div className='hidden print:block mb-8 print:mb-6'>
              <h3 className='mb-3 text-lg font-semibold text-text-primary print:text-sm'>
                {t('prescription.uploadedDocuments')} (
                {prescription.attachments.length})
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                {prescription.attachments.map(
                  (attachment: any, index: number) => (
                    <div
                      key={index}
                      className='border border-border-light rounded-lg p-2 print:break-inside-avoid bg-white'
                    >
                      <img
                        src={attachment.fileUrl}
                        alt={attachment.fileName || `Attachment ${index + 1}`}
                        className='w-full h-auto max-h-65 object-contain'
                      />
                      <p className='mt-1 text-[10px] text-text-secondary'>
                        {attachment.fileName || `Attachment ${index + 1}`}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </>
        )}

        {/* Signature Block - Only for print */}
        <div className='hidden print:block mt-16 pt-8 border-t border-border-light'>
          <div className='flex justify-between items-end'>
            <div className='space-y-1'>
              <p className='text-[10px] font-bold uppercase text-text-secondary'>
                {issueDateLabel}
              </p>
              <p className='text-sm font-bold'>
                {formatDate(prescription.createdAt)}
              </p>
            </div>
            <div className='text-center min-w-50 space-y-4'>
              <div className='h-px bg-ink-soft w-full mb-1'></div>
              <p className='text-sm font-black uppercase tracking-[0.2em] mb-4'>
                {doctorSignatureLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t('patient.records.deleteRecord')}
        message={t('patient.records.confirmDelete')}
      />
    </div>
  );
}

export default function RecordDetailPage() {
  return (
    <Suspense
      fallback={
        <div className='p-8 text-center text-text-secondary'>
          Loading record details...
        </div>
      }
    >
      <RecordDetailContent />
    </Suspense>
  );
}
