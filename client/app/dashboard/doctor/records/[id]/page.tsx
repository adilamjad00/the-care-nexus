'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  User,
  Printer,
  Phone,
  Mail,
  Building2,
  Pill,
} from 'lucide-react';
import {
  useGetRecordByIdQuery,
  useGetPrescriptionByIdQuery,
} from '@/store/api/doctorApi';
import { useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function RecordDetailContent() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const type = searchParams.get('type');

  const { data: recordData, isLoading: isRecordLoading } =
    useGetRecordByIdQuery(id, {
      skip: type === 'prescription',
    });
  const { data: prescriptionData, isLoading: isPrescriptionLoading } =
    useGetPrescriptionByIdQuery(id, {
      skip: type === 'record',
    });

  const record = recordData?.data || prescriptionData?.data;
  const isLoading = isRecordLoading || isPrescriptionLoading;

  const formatDateTime = (value?: string) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDoctorName = () =>
    record?.doctorId?.fullName ||
    record?.doctorId?.name ||
    record?.doctorName ||
    'Doctor';
  const getDoctorPhone = () =>
    record?.doctorId?.phone || record?.doctorPhone || '';
  const getDoctorEmail = () =>
    record?.doctorId?.email || record?.doctorEmail || '';
  const getClinicName = () =>
    record?.clinicId?.name || record?.clinicName || 'The Care Nexus';
  const getClinicAddress = () =>
    record?.clinicId?.address || record?.clinicAddress || '';
  const getClinicPhone = () =>
    record?.clinicId?.phone || record?.clinicPhone || '';
  const getPatientName = () =>
    record?.patientId?.name || record?.patientId?.userId?.name || 'Patient';
  const getPatientPhone = () =>
    record?.patientId?.phone || record?.patientPhone || '';
  const getPatientEmail = () =>
    record?.patientId?.email || record?.patientEmail || '';

  const handlePrint = () => {
    const medicines = Array.isArray(record?.medicines)
      ? record.medicines
      : Array.isArray(record?.prescriptionId?.medicines)
        ? record.prescriptionId.medicines
        : [];

    const printWindow = window.open(
      '',
      '_blank',
      'noopener,noreferrer,width=980,height=760',
    );
    if (!printWindow) {
      window.print();
      return;
    }

    const medicineRows = medicines.length
      ? medicines
          .map(
            (medicine: any, index: number) => `
              <tr>
                <td style="padding:12px 10px;border:1px solid #d1d5db;vertical-align:top;font-weight:700;width:42px;">${index + 1}</td>
                <td style="padding:12px 10px;border:1px solid #d1d5db;vertical-align:top;font-weight:700;">${escapeHtml(medicine.name)}</td>
                <td style="padding:12px 10px;border:1px solid #d1d5db;vertical-align:top;">${escapeHtml(medicine.dosage)}</td>
                <td style="padding:12px 10px;border:1px solid #d1d5db;vertical-align:top;">${escapeHtml(medicine.frequency)}</td>
                <td style="padding:12px 10px;border:1px solid #d1d5db;vertical-align:top;">${escapeHtml(medicine.duration)}</td>
                <td style="padding:12px 10px;border:1px solid #d1d5db;vertical-align:top;">${escapeHtml(medicine.instructions || '')}</td>
              </tr>
            `,
          )
          .join('')
      : `<tr><td colspan="6" style="padding:16px;border:1px solid #d1d5db;text-align:center;color:#6b7280;">No medicines listed</td></tr>`;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(document.title || 'Prescription')}</title>
          <style>
            * { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; background: #ffffff; color: #111827; font-family: Arial, Helvetica, sans-serif; }
            @page { size: A4; margin: 12mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .sheet { width: 100%; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; border-bottom: 2px solid #00b495; padding-bottom: 18px; margin-bottom: 18px; }
            .brand { display: flex; align-items: center; gap: 12px; }
            .logo { width: 56px; height: 56px; border-radius: 14px; object-fit: cover; }
            .brand-name { font-size: 28px; line-height: 1; font-weight: 800; margin: 0; }
            .brand-sub { margin: 4px 0 0; font-size: 12px; color: #6b7280; }
            .meta { text-align: right; min-width: 220px; }
            .meta-title { margin: 0; font-size: 20px; font-weight: 800; color: #00b495; }
            .meta-line { margin: 6px 0 0; font-size: 12px; color: #4b5563; }
            .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 14px; }
            .card { border: 1px solid #d1d5db; border-radius: 14px; padding: 14px; }
            .card-title { margin: 0 0 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #6b7280; }
            .row { margin: 0; font-size: 13px; line-height: 1.55; color: #111827; }
            .row + .row { margin-top: 4px; }
            .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7280; margin-right: 6px; }
            .section { margin-top: 14px; }
            .section-title { margin: 0 0 10px; font-size: 14px; font-weight: 800; color: #111827; display: flex; align-items: center; gap: 8px; }
            .value-box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 14px; font-size: 13px; line-height: 1.7; }
            table { width: 100%; border-collapse: collapse; }
            thead th { background: #f3f4f6; border: 1px solid #d1d5db; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; text-align: left; }
            tfoot td, tbody td { font-size: 12px; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-top: 24px; padding-top: 18px; border-top: 1px solid #d1d5db; }
            .signature { min-width: 220px; text-align: center; }
            .signature-line { height: 1px; background: #111827; margin: 28px 0 10px; }
            .signature-label { margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div class="brand">
                <img class="logo" src="/carenexus.jpeg" alt="Care Nexus" />
                <div>
                  <p class="brand-name">The Care Nexus</p>
                  <p class="brand-sub">Voice-enabled digital healthcare platform</p>
                </div>
              </div>
              <div class="meta">
                <p class="meta-title">Prescription</p>
                <p class="meta-line">Date: ${escapeHtml(formatDateTime(record?.createdAt || record?.visitDate))}</p>
                <p class="meta-line">Record ID: ${escapeHtml(record?._id || id)}</p>
              </div>
            </div>

            <div class="grid">
              <div class="card">
                <p class="card-title">Doctor Information</p>
                <p class="row"><span class="label">Name</span>${escapeHtml(getDoctorName())}</p>
                ${getDoctorPhone() ? `<p class="row"><span class="label">Contact</span>${escapeHtml(getDoctorPhone())}</p>` : ''}
                ${getDoctorEmail() ? `<p class="row"><span class="label">Email</span>${escapeHtml(getDoctorEmail())}</p>` : ''}
                ${record?.doctorId?.specialization ? `<p class="row"><span class="label">Specialization</span>${escapeHtml(record.doctorId.specialization)}</p>` : ''}
                ${record?.doctorId?.licenseNumber ? `<p class="row"><span class="label">License</span>${escapeHtml(record.doctorId.licenseNumber)}</p>` : ''}
              </div>
              <div class="card">
                <p class="card-title">Clinic Information</p>
                <p class="row"><span class="label">Name</span>${escapeHtml(getClinicName())}</p>
                ${getClinicAddress() ? `<p class="row"><span class="label">Address</span>${escapeHtml(getClinicAddress())}</p>` : ''}
                ${getClinicPhone() ? `<p class="row"><span class="label">Contact</span>${escapeHtml(getClinicPhone())}</p>` : ''}
              </div>
              <div class="card">
                <p class="card-title">Patient Information</p>
                <p class="row"><span class="label">Name</span>${escapeHtml(getPatientName())}</p>
                ${getPatientPhone() ? `<p class="row"><span class="label">Contact</span>${escapeHtml(getPatientPhone())}</p>` : ''}
                ${getPatientEmail() ? `<p class="row"><span class="label">Email</span>${escapeHtml(getPatientEmail())}</p>` : ''}
              </div>
              <div class="card">
                <p class="card-title">Visit Summary</p>
                <p class="row"><span class="label">Type</span>${escapeHtml(record?.type || 'Prescription')}</p>
                ${record?.chiefComplaint ? `<p class="row"><span class="label">Chief Complaint</span>${escapeHtml(record.chiefComplaint)}</p>` : ''}
                ${record?.notes ? `<p class="row"><span class="label">Notes</span>${escapeHtml(record.notes)}</p>` : ''}
              </div>
            </div>

            ${
              record?.diagnosis
                ? `
              <div class="section">
                <p class="section-title">Diagnosis</p>
                <div class="value-box">${escapeHtml(record.diagnosis)}</div>
              </div>
            `
                : ''
            }

            <div class="section">
              <p class="section-title">Medicines</p>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  ${medicineRows}
                </tbody>
              </table>
            </div>

            ${
              record?.notes
                ? `
              <div class="section">
                <p class="section-title">Additional Notes</p>
                <div class="value-box">${escapeHtml(record.notes)}</div>
              </div>
            `
                : ''
            }

            <div class="footer">
              <div>
                <p class="row"><span class="label">Issued</span>${escapeHtml(formatDateTime(record?.createdAt || record?.visitDate))}</p>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <p class="signature-label">Doctor Signature</p>
                <p class="row" style="margin-top:8px; font-weight:700;">${escapeHtml(getDoctorName())}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  useEffect(() => {
    if (!isLoading && record && searchParams.get('print') === 'true') {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [isLoading, record, searchParams]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[40vh]'>
        <div className='h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin' />
      </div>
    );
  }

  if (!record) {
    return (
      <div className='space-y-4'>
        <Link
          href='/dashboard/doctor/patients'
          className='inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Patients
        </Link>
        <div className='rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-[#1a1a1a]'>
          <h1 className='text-2xl font-bold'>Medical record not found</h1>
        </div>
      </div>
    );
  }

  const medicines = Array.isArray(record?.medicines)
    ? record.medicines
    : Array.isArray(record?.prescriptionId?.medicines)
      ? record.prescriptionId.medicines
      : [];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between print:hidden'>
        <button
          onClick={() => router.back()}
          className='inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </button>
        <Button
          onClick={handlePrint}
          variant='outline'
          className='bg-white border-black/10 h-10 px-4 text-[10px] font-black uppercase tracking-widest'
        >
          <Printer className='mr-2 h-4 w-4' />
          Print Record
        </Button>
      </div>

      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm print:border-none print:shadow-none print:p-0 dark:border-gray-700 dark:bg-[#1a1a1a]'>
        <div className='flex flex-col gap-3 border-b border-gray-200 pb-5 dark:border-gray-700 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {record?.diagnosis || 'Medical Record'}
            </h1>
            <div className='mt-3 grid gap-2 text-sm text-gray-600 dark:text-gray-300'>
              <p className='inline-flex items-center gap-2'>
                <Calendar className='h-4 w-4' />{' '}
                {formatDateTime(record.visitDate || record.createdAt)}
              </p>
              <p className='inline-flex items-center gap-2'>
                <User className='h-4 w-4' /> {getPatientName()}
              </p>
              {getClinicName() && (
                <p className='inline-flex items-center gap-2'>
                  <MapPin className='h-4 w-4' /> {getClinicName()}
                </p>
              )}
            </div>
          </div>
          <div className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800'>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
              Doctor
            </p>
            <p className='mt-1 font-bold text-gray-900 dark:text-white'>
              {getDoctorName()}
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
              {getDoctorPhone() || getDoctorEmail() || 'No contact available'}
            </p>
          </div>
        </div>

        <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <div className='rounded-2xl border border-gray-200 p-4 dark:border-gray-700'>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
              Doctor Information
            </p>
            <div className='mt-3 space-y-2 text-sm'>
              <p className='flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                <User className='h-4 w-4 text-primary' /> {getDoctorName()}
              </p>
              {getDoctorPhone() && (
                <p className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                  <Phone className='h-4 w-4' /> {getDoctorPhone()}
                </p>
              )}
              {getDoctorEmail() && (
                <p className='flex items-center gap-2 text-gray-600 dark:text-gray-300 break-all'>
                  <Mail className='h-4 w-4' /> {getDoctorEmail()}
                </p>
              )}
              {record?.doctorId?.specialization && (
                <p className='text-gray-600 dark:text-gray-300'>
                  Specialization: {record.doctorId.specialization}
                </p>
              )}
              {record?.doctorId?.licenseNumber && (
                <p className='text-gray-600 dark:text-gray-300'>
                  License: {record.doctorId.licenseNumber}
                </p>
              )}
            </div>
          </div>

          <div className='rounded-2xl border border-gray-200 p-4 dark:border-gray-700'>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
              Clinic Information
            </p>
            <div className='mt-3 space-y-2 text-sm'>
              <p className='flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                <Building2 className='h-4 w-4 text-primary' /> {getClinicName()}
              </p>
              {getClinicAddress() && (
                <p className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                  <MapPin className='h-4 w-4' /> {getClinicAddress()}
                </p>
              )}
              {getClinicPhone() && (
                <p className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                  <Phone className='h-4 w-4' /> {getClinicPhone()}
                </p>
              )}
            </div>
          </div>

          <div className='rounded-2xl border border-gray-200 p-4 dark:border-gray-700'>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
              Patient Information
            </p>
            <div className='mt-3 space-y-2 text-sm'>
              <p className='flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                <User className='h-4 w-4 text-primary' /> {getPatientName()}
              </p>
              {getPatientPhone() && (
                <p className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                  <Phone className='h-4 w-4' /> {getPatientPhone()}
                </p>
              )}
              {getPatientEmail() && (
                <p className='flex items-center gap-2 text-gray-600 dark:text-gray-300 break-all'>
                  <Mail className='h-4 w-4' /> {getPatientEmail()}
                </p>
              )}
            </div>
          </div>
        </div>

        {record.chiefComplaint && (
          <div className='mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800'>
            <p className='text-xs font-black uppercase tracking-widest text-gray-400'>
              Chief complaint
            </p>
            <p className='mt-1 text-sm text-gray-800 dark:text-gray-200'>
              {record.chiefComplaint}
            </p>
          </div>
        )}

        {record.diagnosis && (
          <div className='mt-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800'>
            <p className='text-xs font-black uppercase tracking-widest text-gray-400'>
              Diagnosis
            </p>
            <p className='mt-1 text-sm text-gray-800 dark:text-gray-200'>
              {record.diagnosis}
            </p>
          </div>
        )}

        {medicines.length > 0 && (
          <div className='mt-6 rounded-2xl border border-gray-200 p-4 dark:border-gray-700'>
            <p className='flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400'>
              <Pill className='h-4 w-4 text-primary' /> Medicines
            </p>
            <div className='mt-4 space-y-3'>
              {medicines.map((medicine: any, index: number) => (
                <div
                  key={index}
                  className='rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'
                >
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='font-bold text-gray-900 dark:text-white'>
                      {index + 1}. {medicine.name}
                    </p>
                    <p className='rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary'>
                      {medicine.dosage || 'Dosage N/A'}
                    </p>
                  </div>
                  <div className='mt-3 grid gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2'>
                    <p>
                      <span className='font-bold text-gray-900 dark:text-white'>
                        Frequency:
                      </span>{' '}
                      {medicine.frequency || 'N/A'}
                    </p>
                    <p>
                      <span className='font-bold text-gray-900 dark:text-white'>
                        Duration:
                      </span>{' '}
                      {medicine.duration || 'N/A'}
                    </p>
                  </div>
                  {medicine.instructions && (
                    <p className='mt-2 text-sm italic text-gray-600 dark:text-gray-300'>
                      {medicine.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {record.notes && (
          <div className='mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800'>
            <p className='text-xs font-black uppercase tracking-widest text-gray-400'>
              Additional notes
            </p>
            <p className='mt-1 text-sm text-gray-800 dark:text-gray-200'>
              {record.notes}
            </p>
          </div>
        )}

        <div className='mt-8 flex items-end justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-700'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            <p className='text-[10px] font-black uppercase tracking-[0.2em]'>
              Issued
            </p>
            <p className='mt-1 font-bold text-gray-900 dark:text-white'>
              {formatDateTime(record.createdAt || record.visitDate)}
            </p>
          </div>
          <div className='min-w-55 text-center'>
            <div className='h-px bg-gray-900 dark:bg-gray-200' />
            <p className='mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500'>
              Doctor Signature
            </p>
            <p className='mt-2 text-sm font-bold text-gray-900 dark:text-white'>
              {getDoctorName()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorRecordDetailPage() {
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
