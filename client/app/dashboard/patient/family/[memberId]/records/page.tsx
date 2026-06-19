'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  useAddFamilyRecordMutation,
  useDeleteFamilyRecordMutation,
  useGetFamilyRecordsQuery,
} from '@/store/api/patientApi';
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building2,
  Plus,
  Upload,
  Eye,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function FamilyRecordsPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.memberId as string;
  const t = useTranslations();
  const locale = useLocale();

  const { data, isLoading, refetch } = useGetFamilyRecordsQuery(memberId);
  const [addFamilyRecord, { isLoading: isAdding }] =
    useAddFamilyRecordMutation();
  const [deleteFamilyRecord] = useDeleteFamilyRecordMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    diagnosis: 'document',
    doctorName: '',
    clinicName: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    fileUrl: '',
  });

  const records = data?.data || [];

  const formatDate = (d?: string) =>
    d
      ? new Intl.DateTimeFormat(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(d))
      : '';
  const recordTitle = (r: any) =>
    r?.chiefComplaint ||
    r?.attachments?.[0]?.fileName ||
    t('patient.family.untitledRecord');
  const familyText = (key: string, fallback: string) =>
    t.has(key) ? t(key) : fallback;
  const getDiagnosisLabel = (value?: string) => {
    if (!value) return t('common.noData');
    const key = `patient.family.${value}`;
    return t.has(key) ? t(key) : value;
  };
  const getDoctorName = (r: any) =>
    r?.externalDoctorName || r?.doctorName || t('common.noData');
  const getClinicName = (r: any) =>
    r?.externalClinicName || r?.clinicName || t('common.noData');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((p) => ({ ...p, fileUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl)
      return toast.error(t('patient.family.titleAndAttachmentRequired'));
    try {
      await addFamilyRecord({ memberId, ...formData }).unwrap();
      toast.success(t('patient.family.recordAdded'));
      setIsModalOpen(false);
      setFormData({
        title: '',
        diagnosis: 'document',
        doctorName: '',
        clinicName: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        fileUrl: '',
      });
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || t('patient.family.failedToAdd'));
    }
  };

  const doDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFamilyRecord({
        memberId,
        recordId: recordToDelete._id,
      }).unwrap();
      toast.success(t('patient.family.recordDeleted'));
      setRecordToDelete(null);
      setIsDeleteOpen(false);
      setIsDetailOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || t('common.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-[auto,1fr,auto] items-center gap-4'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-text-primary hover:text-primary transition-colors'
        >
          <ArrowLeft className='h-5 w-5' />
          <span className='font-bold uppercase tracking-widest text-[10px]'>
            {t('patient.family.backToFamily')}
          </span>
        </button>

        <h1 className='text-center text-2xl font-black text-text-primary sm:text-3xl'>
          {t('patient.family.recordsTitle')}
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className='inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-4 text-[10px] font-black uppercase tracking-widest text-white justify-self-end'
        >
          <Plus className='h-4 w-4' /> {t('patient.family.addRecord')}
        </button>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-28 animate-pulse rounded-2xl border bg-white'
            />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className='rounded-2xl border p-12 text-center bg-white'>
          <FileText className='mx-auto h-12 w-12 text-text-primary opacity-20 mb-4' />
          <h3 className='text-lg font-bold text-text-primary'>
            {t('patient.family.noRecordsDesc')}
          </h3>
        </div>
      ) : (
        <div className='grid gap-4'>
          {records.map((r: any) => (
            <div
              key={r._id}
              className='flex items-center justify-between rounded-2xl border bg-white p-6'
            >
              <div>
                <h3 className='text-xl font-black'>{recordTitle(r)}</h3>
                <p className='text-xs uppercase text-primary mt-1'>
                  {getDiagnosisLabel(r.diagnosis)}
                </p>
                <div className='mt-3 flex gap-2 text-xs text-text-primary'>
                  <div className='flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5'>
                    <User className='h-4 w-4 text-primary' />{' '}
                    <span>{getDoctorName(r)}</span>
                  </div>
                  <div className='flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5'>
                    <Building2 className='h-4 w-4 text-primary' />{' '}
                    <span>{getClinicName(r)}</span>
                  </div>
                  <div className='flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl'>
                    <Calendar className='h-4 w-4 text-primary' />{' '}
                    <span>{formatDate(r.visitDate || r.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setSelectedRecord(r);
                    setIsDetailOpen(true);
                  }}
                  className='rounded-xl bg-primary px-4 py-2 text-white'
                >
                  <Eye className='h-4 w-4' />
                </button>
                <button
                  onClick={() => {
                    setRecordToDelete(r);
                    setIsDeleteOpen(true);
                  }}
                  className='rounded-xl border px-4 py-2 text-red-600'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('patient.family.addRecordModalTitle')}
      >
        <form onSubmit={handleAdd} className='space-y-4'>
          <input
            placeholder={familyText('patient.family.formTitle', t('form.name'))}
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
            className='w-full rounded-2xl border p-3'
          />
          <input
            placeholder={familyText(
              'patient.family.doctorName',
              t('form.name'),
            )}
            value={formData.doctorName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, doctorName: e.target.value }))
            }
            className='w-full rounded-2xl border p-3'
          />
          <input
            placeholder={familyText(
              'patient.family.clinicName',
              t('clinic.clinicName'),
            )}
            value={formData.clinicName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, clinicName: e.target.value }))
            }
            className='w-full rounded-2xl border p-3'
          />
          <select
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData((p) => ({ ...p, diagnosis: e.target.value }))
            }
            className='w-full rounded-2xl border p-3'
          >
            <option value='document'>
              {familyText('patient.family.document', 'Document')}
            </option>
            <option value='labReport'>
              {familyText('patient.family.labReport', 'Lab Report')}
            </option>
            <option value='imaging'>
              {familyText('patient.family.imaging', 'Imaging')}
            </option>
            <option value='prescription'>
              {familyText('patient.family.prescription', 'Prescription')}
            </option>
            <option value='other'>
              {familyText('patient.family.other', 'Other')}
            </option>
          </select>
          <label className='flex flex-col items-center gap-2 p-4 border rounded-2xl cursor-pointer'>
            <Upload />
            <span>
              {formData.fileUrl
                ? t('patient.family.attachmentSelected')
                : t('patient.family.uploadAttachment')}
            </span>
            <input type='file' className='hidden' onChange={handleFileChange} />
          </label>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type='submit' disabled={isAdding}>
              {isAdding
                ? t('patient.family.saving')
                : t('patient.family.saveRecord')}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={
          selectedRecord
            ? recordTitle(selectedRecord)
            : t('patient.family.recordDetails')
        }
      >
        {selectedRecord && (
          <div className='space-y-4'>
            <h2 className='text-xl font-black'>
              {recordTitle(selectedRecord)}
            </h2>
            <p className='text-sm'>
              {getDiagnosisLabel(selectedRecord.diagnosis)}
            </p>
            <div className='flex gap-2'>
              <div className='rounded border p-2'>
                <User /> {getDoctorName(selectedRecord)}
              </div>
              <div className='rounded border p-2'>
                <Building2 /> {getClinicName(selectedRecord)}
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setRecordToDelete(selectedRecord);
                  setIsDetailOpen(false);
                  setIsDeleteOpen(true);
                }}
              >
                {familyText('patient.family.deleteRecord', 'Delete Record')}
              </Button>
              <Button onClick={() => setIsDetailOpen(false)}>
                {t('common.close')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          if (!isDeleting) setIsDeleteOpen(false);
        }}
        onConfirm={doDelete}
        title={familyText('patient.family.deleteRecord', 'Delete Record')}
        message={familyText(
          'patient.family.confirmDelete',
          'Are you sure you want to delete this record?',
        )}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant='danger'
        confirmLoading={isDeleting}
        closeOnConfirm={false}
      />
    </div>
  );
}
