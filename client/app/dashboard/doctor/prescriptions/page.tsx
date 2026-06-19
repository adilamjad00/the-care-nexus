'use client';

import {
  useGetPrescriptionsQuery,
  useDeletePrescriptionMutation,
  useGetPrescriptionByIdQuery,
} from '@/store/api/doctorApi';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  FileText,
  Calendar,
  User,
  Pill,
  Download,
  Trash2,
  AlertTriangle,
  Loader,
} from 'lucide-react';
import TrashIcon from '@/icons/trash-icon';
import DownloadIcon from '@/icons/download-icon';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import { useLocale, useTranslations } from 'next-intl';

function downloadPrescriptionPDF(
  prescription: any,
  pkrLabel: string,
  locale: string,
  labels: Record<string, string>,
) {
  const medicines = prescription.medicines || [];
  const date = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(prescription.createdAt));

  const medRows = medicines
    .map(
      (med: any, i: number) => `
    <tr style="background:${i % 2 === 0 ? '#f8fffe' : '#fff'} !important">
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111 !important">${med.name || '-'}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151 !important">${med.dosage || '-'}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151 !important">${med.frequency || '-'}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151 !important">${med.duration || '-'}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151 !important">${med.instructions || '-'}</td>
    </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="${locale}" dir="${locale.startsWith('ur') ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <title>${labels.medicalPrescription} - ${prescription.patientId?.name || labels.unknownPatient}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { background: #fff !important; color-scheme: light !important; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff !important; color: #111 !important; padding: 40px; }
    @media print { 
      @page { margin: 0; } 
      body { padding: 1.6cm; background: white !important; color: black !important; } 
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #00b495; }
    .brand { font-size: 24px; font-weight: 800; color: #00b495 !important; letter-spacing: -0.5px; }
    .brand span { color: #111 !important; }
    .date { font-size: 13px; color: #6b7280 !important; text-align: right; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280 !important; font-weight: 700; margin-bottom: 6px; }
    .patient-name { font-size: 20px; font-weight: 700; color: #111 !important; }
    .patient-email { font-size: 13px; color: #6b7280 !important; margin-top: 2px; }
    .diagnosis-box { background: #e6f8f4 !important; border-left: 4px solid #00b495; padding: 12px 16px; border-radius: 6px; font-size: 15px; font-weight: 600; color: #111 !important; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    thead th { background: #00b495 !important; color: #fff !important; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 12px; }
    tbody td { background: #fff !important; color: #111 !important; }
    .notes { background: #f9fafb !important; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; font-size: 13px; color: #111 !important; line-height: 1.6; margin-top: 8px; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #4b5563 !important; }
    .sig-line { margin-top: 60px; border-top: 2px solid #111; width: 220px; padding-top: 8px; font-size: 13px; font-weight: 700; color: #111 !important; text-align: center; }
    .prescription-title { font-size: 28px; font-weight: 900; color: #111; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .meta-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 13px; color: #4b5563; }
    .meta-item b { color: #111; min-width: 80px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">MEDE<span>AZ</span></div>
      <div style="font-size:12px;color:#6b7280;margin-top:4px;font-weight:600">${labels.digitalHealthcarePlatform}</div>
    </div>
    <div class="date">
      <div style="font-weight:800;color:#111;font-size:14px">${labels.issueDate}</div>
      <div>${date}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:32px">
    <div class="section">
      <div class="section-title">${labels.patientInfo}</div>
      <div class="patient-name">${prescription.patientId?.name || labels.unknownPatient}</div>
      <div class="patient-email">${prescription.patientId?.email || ''}</div>
      ${prescription.patientId?.phone ? `<div class="patient-email">${prescription.patientId.phone}</div>` : ''}
    </div>
    <div class="section">
      <div class="section-title">${labels.healthcareProvider}</div>
      <div style="font-size:20px;font-weight:800;color:#111 !important;margin-bottom:4px">Dr. ${prescription.doctorId?.fullName || prescription.doctorId?.name || labels.medicalProfessional}</div>
      <div style="font-size:14px;font-weight:700;color:#00b495 !important">${prescription.clinicId?.name || labels.privateClinic}</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px">${prescription.clinicId?.address || ''}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${labels.diagnosis}</div>
    <div class="diagnosis-box">${prescription.diagnosis || labels.notSpecified}</div>
  </div>

  ${
    medicines.length > 0
      ? `
  <div class="section">
    <div class="section-title">${labels.prescribedMedicines}</div>
    <table>
      <thead>
        <tr>
          <th>${labels.medicine}</th><th>${labels.dosage}</th><th>${labels.frequency}</th><th>${labels.duration}</th><th>${labels.instructions}</th>
        </tr>
      </thead>
      <tbody>${medRows}</tbody>
    </table>
  </div>`
      : ''
  }

  ${
    prescription.notes
      ? `
  <div class="section">
    <div class="section-title">${labels.additionalNotes}</div>
    <div class="notes">${prescription.notes}</div>
  </div>`
      : ''
  }

  ${
    prescription.consultationFee ||
    prescription.medicineCost ||
    prescription.totalCost
      ? `
  <div class="section" style="break-inside: avoid">
    <div class="section-title">${labels.paymentDetails}</div>
    <div style="background:#f8fafc !important;border:1px solid #e2e8f0;padding:20px;border-radius:16px;margin-top:8px">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px">
        <span style="color:#4b5563;font-size:14px;font-weight:600">${labels.consultationFee}</span>
        <span style="color:#111;font-weight:700;font-size:14px">${pkrLabel} ${Math.round(prescription.consultationFee || 0).toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:10px">
        <span style="color:#4b5563;font-size:14px;font-weight:600">${labels.medicineCost}</span>
        <span style="color:#111;font-weight:700;font-size:14px">${pkrLabel} ${Math.round(prescription.medicineCost || 0).toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:2px dashed #e2e8f0;margin-top:8px">
        <span style="color:#111;font-weight:900;font-size:16px;text-transform:uppercase">${labels.totalAmount}</span>
        <span style="color:#00b495;font-weight:900;font-size:22px">${pkrLabel} ${Math.round(prescription.totalCost || 0).toLocaleString()}</span>
      </div>
    </div>
  </div>`
      : ''
  }

  <div style="margin-top:80px;display:flex;justify-content:flex-end">
    <div class="sig-line">
      ${labels.authorizedSignatory}<br/>
      <span style="font-size:10px;font-weight:500;color:#6b7280;margin-top:4px;display:block">${labels.doctorSignature}</span>
    </div>
  </div>

  <div class="footer">
    <div>${labels.generatedVia} The Care Nexus ${labels.digitalHealthcarePlatform}</div>
    <div>${labels.officialMedicalRecord}</div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 500);
}

import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

function PrescriptionsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const searchId = searchParams.get('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (searchId) {
      setSearchQuery(searchId);
      setDebouncedSearch(searchId);
    }
  }, [searchId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isFetching } = useGetPrescriptionsQuery({
    limit: 50,
    search:
      debouncedSearch && debouncedSearch !== searchId
        ? debouncedSearch
        : undefined,
  });

  const { data: specificPrescription, isLoading: isLoadingSpecific } =
    useGetPrescriptionByIdQuery(searchId, {
      skip:
        !searchId ||
        (data?.data?.prescriptions || []).some((p: any) => p._id === searchId),
    });

  const [deletePrescription] = useDeletePrescriptionMutation();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string;
    patientName: string;
  }>({ open: false, id: '', patientName: '' });

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deletePrescription(deleteModal.id).unwrap();
      toast.success('Prescription deleted successfully');
      setDeleteModal({ open: false, id: '', patientName: '' });
    } catch (err) {
      toast.error('Failed to delete prescription');
      console.error('Delete failed', err);
    }
  };

  const prescriptions = Array.isArray(data?.data)
    ? [...data.data]
    : [...(data?.data?.prescriptions || [])];

  if (
    specificPrescription?.data &&
    !prescriptions.some((p) => p._id === specificPrescription.data._id)
  ) {
    prescriptions.unshift(specificPrescription.data);
  }

  const prescriptionPdfLabels = {
    medicalPrescription: t('prescription.medicalPrescription'),
    digitalHealthcarePlatform: t('prescription.digitalHealthcarePlatform'),
    patient: t('prescription.patient'),
    healthcareProvider: t('prescription.healthcareProvider'),
    diagnosis: t('prescription.diagnosis'),
    prescribedMedicines: t('prescription.prescribedMedicines'),
    medicine: t('prescription.medicine'),
    dosage: t('prescription.dosage'),
    frequency: t('prescription.frequency'),
    duration: t('prescription.duration'),
    instructions: t('prescription.instructions'),
    additionalNotes: t('prescription.additionalNotes'),
    paymentDetails: t('prescription.paymentDetails'),
    consultationFee: t('prescription.consultationFee'),
    medicineCost: t('prescription.medicineCost'),
    totalAmount: t('prescription.totalAmount'),
    generatedVia: t('prescription.generatedVia'),
    officialMedicalRecord: t('prescription.officialMedicalRecord'),
    authorizedSignatory: t('prescription.authorizedSignatory'),
    unknownPatient: t('prescription.unknownPatient'),
    medicalProfessional: t('prescription.medicalProfessional'),
    privateClinic: t('prescription.privateClinic'),
    notSpecified: t('prescription.notSpecified'),
  };

  const filteredPrescriptions = prescriptions.filter(
    (px: any) =>
      px.patientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      px.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      px._id === searchQuery,
  );

  if (isLoading || (searchId && isLoadingSpecific)) {
    return <TableSkeleton rows={8} />;
  }

  return (
    <>
      <div className='space-y-4 sm:space-y-6 animate-in'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-xl font-bold text-text-primary tracking-tight'>
              {t('doctor.prescriptions.title')}
            </h1>
            <p className='text-text-secondary mt-1 sm:mt-2 text-base sm:text-lg font-bold'>
              {t('doctor.prescriptions.subtitle')}
            </p>
          </div>
          <Link
            href='/dashboard/doctor/prescriptions/new'
            className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md'
          >
            <Plus className='h-5 w-5 stroke-[2.5px]' />
            {t('doctor.prescriptions.newPrescription')}
          </Link>
        </div>

        {/* Search Bar */}
        <div className='max-w-md'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <Plus className='h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors rotate-45' />
            </div>
            <input
              type='text'
              placeholder={
                t('common.search') +
                ' (' +
                t('doctor.patientName') +
                ', ' +
                t('doctor.diagnosis') +
                ')...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-12 pl-12 pr-12 bg-white border border-border-light rounded-lg text-sm font-bold transition-colors'
            />
            {isFetching && (
              <div className='absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none'>
                <Loader className='h-4 w-4 text-primary animate-spin' />
              </div>
            )}
          </div>
        </div>

        {/* Prescriptions List */}
        <div className='grid grid-cols-1 gap-4'>
          {filteredPrescriptions.length === 0 ? (
            <div className='text-center py-20 bg-card-custom border-card-custom rounded-2xl'>
              <div className='h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30'>
                <FileText className='h-10 w-10 text-primary' />
              </div>
              <p className='text-text-primary text-lg font-bold'>
                {t('doctor.prescriptions.noPrescriptions')}
              </p>
              {/* Keep single clear message; avoid duplicate 'No prescriptions found' lines */}
              {!searchQuery && (
                <Link
                  href='/dashboard/doctor/prescriptions/new'
                  className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg'
                >
                  <Plus className='h-5 w-5 stroke-[2.5px]' />
                  {t('doctor.prescriptions.newPrescription')}
                </Link>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredPrescriptions.map((prescription: any) => (
                <div
                  key={prescription._id}
                  className='p-6 bg-card-custom border-card-custom rounded-2xl transition-all hover:border-primary/30 shadow-sm group'
                >
                  <div className='flex flex-col gap-6'>
                    <div className='flex items-start gap-5'>
                      <div className='h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-sm shrink-0'>
                        <Pill className='h-7 w-7 text-white' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between gap-4'>
                          <h3 className='font-bold text-text-primary text-xl flex items-center gap-2'>
                            {prescription.patientId?.name || 'Unknown Patient'}
                          </h3>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() =>
                                downloadPrescriptionPDF(
                                  prescription,
                                  t('common.pkr'),
                                  locale,
                                  prescriptionPdfLabels,
                                )
                              }
                              className='h-10 px-4 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 group'
                            >
                              <DownloadIcon className='h-4 w-4' />
                              {t('common.download')}
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  id: prescription._id,
                                  patientName:
                                    prescription.patientId?.name ||
                                    'Unknown Patient',
                                })
                              }
                              className='h-10 w-10 flex items-center justify-center border-2 border-transparent hover:border-red-100  text-gray-400 hover:text-red-500 transition-all rounded-xl group'
                            >
                              <TrashIcon className='h-4 w-4' />
                            </button>
                          </div>
                        </div>
                        <p className='text-text-secondary text-sm font-bold mt-1'>
                          {prescription.patientId?.email}
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-border-light'>
                      <div>
                        <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5'>
                          {t('doctor.diagnosis')}
                        </p>
                        <p className='font-bold text-text-primary text-sm'>
                          {prescription.diagnosis || 'No diagnosis provided'}
                        </p>
                      </div>
                      <div>
                        <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5'>
                          {t('common.date')}
                        </p>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-primary' />
                          <p className='font-bold text-text-primary text-sm'>
                            {new Date(
                              prescription.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5'>
                          Billing
                        </p>
                        <p className='font-black text-black dark:text-primary text-base'>
                          {t('common.pkr')}{' '}
                          {prescription.totalCost?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>

                    {prescription.notes && (
                      <div className='px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-border-light'>
                        <p className='text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 flex items-center gap-1.5'>
                          <AlertTriangle className='h-3 w-3' />
                          {t('doctor.notes')}
                        </p>
                        <p className='text-text-primary text-sm font-bold leading-relaxed'>
                          {prescription.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: '', patientName: '' })}
        onConfirm={handleDelete}
        title={t('doctor.prescriptions.deletePrescription')}
        message={t('doctor.prescriptions.confirmDelete')}
      />
    </>
  );
}

export default function PrescriptionsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} />}>
      <PrescriptionsContent />
    </Suspense>
  );
}
