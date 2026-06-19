'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  useGetRecordsQuery,
  useUploadRecordMutation,
  useDeleteRecordMutation,
} from '@/store/api/patientApi';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  User,
  Building2,
  Search,
  Plus,
  Upload,
  X,
  Trash2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import TrashIcon from '@/icons/trash-icon';
import XIcon from '@/icons/x-icon';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    title: '',
    recordType: 'Lab Report',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    fileUrl: '',
  });
  const [uploadRecord, { isLoading }] = useUploadRecordMutation();

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('clinic.imageSizeError'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fileUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error(t('patient.records.errors.titleRequired'));
      return;
    }

    if (!formData.fileUrl) {
      toast.error(t('patient.records.errors.attachmentRequired'));
      return;
    }

    try {
      await uploadRecord(formData).unwrap();
      toast.success(t('patient.records.recordUploaded'));
      onClose();
      setFormData({
        title: '',
        recordType: 'Lab Report',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        fileUrl: '',
      });
    } catch (err: any) {
      toast.error(err?.data?.message || t('common.error'));
    }
  };

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 m-0 p-4'
      style={{ zIndex: 10000 }}
      aria-modal='true'
      role='dialog'
    >
      <div
        className='absolute inset-0 bg-black/55 backdrop-blur-[1px]'
        onClick={onClose}
      />
      <div className='relative flex min-h-full items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-2xl p-6 sm:p-7 w-full max-w-md border border-black/5 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[85vh]'>
          <div className='flex items-center justify-between mb-8 shrink-0'>
            <div>
              <h3 className='text-2xl font-black text-text-primary tracking-tight'>
                {t('patient.records.uploadTitle')}
              </h3>
              <p className='text-sm font-bold text-text-secondary uppercase tracking-widest mt-1'>
                {t('patient.records.newEntry')}
              </p>
            </div>
            <button
              onClick={onClose}
              className='h-10 w-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors'
            >
              <XIcon className='h-5 w-5 text-text-secondary' />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide'>
            <form
              id='upload-record-form'
              onSubmit={handleSubmit}
              className='space-y-3 pb-4'
            >
              <div className='space-y-2'>
                <label className='text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1'>
                  {t('form.name')}
                </label>
                <input
                  type='text'
                  placeholder={t('patient.records.placeholders.title')}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='w-full rounded-2xl border-black/5 bg-background p-3 text-sm font-medium transition-colors'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1'>
                    {t('patient.records.recordType')}
                  </label>
                  <select
                    value={formData.recordType}
                    onChange={(e) =>
                      setFormData({ ...formData, recordType: e.target.value })
                    }
                    className='w-full rounded-2xl border-black/5 bg-background p-3 text-sm font-medium focus:ring-primary focus:border-primary transition-all appearance-none'
                  >
                    <option value='Lab Report'>
                      {t('patient.records.categories.lab')}
                    </option>
                    <option value='Imaging (X-Ray/MRI)'>
                      {t('patient.records.categories.imaging')}
                    </option>
                    <option value='Vaccination'>
                      {t('patient.records.categories.vaccination')}
                    </option>
                    <option value='Prescription'>
                      {t('patient.records.categories.prescription')}
                    </option>
                    <option value='Discharge Summary'>
                      {t('patient.records.categories.discharge')}
                    </option>
                    <option value='Other'>
                      {t('patient.records.categories.other')}
                    </option>
                  </select>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1'>
                    {t('patient.records.recordDate')}
                  </label>
                  <input
                    type='date'
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className='w-full rounded-2xl border-black/5 bg-background p-3 text-sm font-medium transition-colors'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1'>
                  {t('patient.records.notes')}
                </label>
                <textarea
                  placeholder={t('patient.records.placeholders.notes')}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className='w-full rounded-2xl border-black/5 bg-background p-3 text-sm font-medium focus:ring-primary focus:border-primary transition-all h-20 resize-none'
                />
              </div>

              <div className='relative group'>
                <input
                  type='file'
                  onChange={handleFileChange}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                />
                <div
                  className={`p-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${formData.fileUrl ? 'border-primary bg-primary/5' : 'border-black/5  bg-background  group-hover:border-primary/50'}`}
                >
                  {formData.fileUrl ? (
                    <div className='relative group w-full h-28'>
                      <img
                        src={formData.fileUrl}
                        alt='Preview'
                        className='w-full h-full object-contain rounded-xl'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl'>
                        <p className='text-white text-xs font-bold'>
                          {t('common.edit')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className='h-8 w-8 mb-2 text-text-secondary' />
                      <p className='text-sm font-bold text-text-primary'>
                        {t('patient.records.dragDrop')}
                      </p>
                      <p className='text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1'>
                        {t('patient.records.supportedFormats')}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className='pt-6 shrink-0'>
            <Button
              type='submit'
              form='upload-record-form'
              disabled={isLoading}
              className='w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20'
            >
              {isLoading
                ? t('patient.records.uploading')
                : t('patient.records.saveVault')}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function RecordsPage() {
  const t = useTranslations();
  const { data, isLoading, refetch, isFetching } = useGetRecordsQuery({
    limit: 20,
  });
  const [deleteRecord] = useDeleteRecordMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const records = data?.data || [];

  const filteredRecords = records.filter((record: any) => {
    if (!record) return false;
    const searchLower = searchTerm.toLowerCase();

    const diagnosis = (
      record.diagnosis ||
      record.chiefComplaint ||
      ''
    ).toLowerCase();
    const doctor = (
      record.doctorId?.name ||
      record.externalDoctorName ||
      ''
    ).toLowerCase();
    const clinic = (
      record.clinicId?.name ||
      record.externalClinicName ||
      ''
    ).toLowerCase();

    const diagnosisMatch = diagnosis.includes(searchLower);
    const doctorMatch = doctor.includes(searchLower);
    const clinicMatch = clinic.includes(searchLower);

    return diagnosisMatch || doctorMatch || clinicMatch;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRecord(deleteId).unwrap();
      toast.success('Record deleted');
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete record');
    }
  };

  return (
    <div
      className={`space-y-10 animate-in ${isUploadModalOpen ? 'pb-0' : 'pb-20'}`}
    >
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 px-2'>
        <div>
          <h1 className='text-3xl font-bold text-text-primary'>
            {t('patient.records.title')}
          </h1>
          {/* <p className="text-text-secondary mt-4 text-lg font-medium">
            {t('patient.records.subtitle')}
          </p> */}
        </div>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className='h-12 px-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all'
        >
          <Plus size={20} strokeWidth={3} />
          {t('patient.records.uploadRecord')}
        </Button>
      </div>

      {/* Search Bar - Premium Style */}
      <div className='relative group px-2 max-w-2xl'>
        <div className='absolute inset-y-0 left-8 flex items-center pointer-events-none '>
          <Search className='h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors' />
        </div>
        <input
          type='text'
          placeholder={t('common.search') + '...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full  h-12 rounded-lg border border-border-light bg-white pl-16 pr-6 text-sm font-bold text-text-primary placeholder:text-text-secondary transition-colors'
        />
      </div>

      {/* Records List */}
      <div className='space-y-4'>
        {isLoading || isFetching ? (
          <div className='grid grid-cols-1 gap-4 lens-card'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-40 animate-pulse rounded-2xl bg-surface '
              />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className='p-20 lens-card rounded-[3rem] border border-dashed border-border-light text-center '>
            <div className='h-20 w-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6'>
              <FileText className='text-white/70' size={40} />
            </div>
            <h3 className='text-xl font-black text-text-primary uppercase tracking-tight'>
              {t('patient.records.noRecords')}
            </h3>
            <p className='text-sm font-bold text-text-secondary mt-2'>
              {searchTerm
                ? t('common.noResults')
                : t('patient.records.uploadSubtitle')}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4'>
            {filteredRecords.map((record: any) => (
              <Link
                key={record._id}
                href={`/dashboard/patient/records/${record._id}`}
                className='group transition-all'
              >
                <div className='lens-card flex flex-col sm:flex-row sm:items-center justify-between gap-6'>
                  <div className='flex items-center gap-6'>
                    <div className='h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0'>
                      {record.attachments?.length > 0 ? (
                        <FileCheck size={28} />
                      ) : (
                        <FileText size={28} />
                      )}
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-xl font-black text-text-primary truncate tracking-tight'>
                          {record.diagnosis ||
                            record.chiefComplaint ||
                            t('patient.records.medicalDocument')}
                        </h3>
                        {record.attachments?.length > 0 && (
                          <span className='px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase tracking-widest border border-primary/20'>
                            {t('patient.records.attachment')}
                          </span>
                        )}
                      </div>
                      <div className='flex flex-wrap items-center gap-y-3 gap-x-6'>
                        <div className='flex items-center gap-2'>
                          <User size={14} className='text-primary' />
                          <span className='text-[10px] font-black text-text-primary uppercase tracking-wider leading-none'>
                            {record.doctorId?.name
                              ? `${t('common.doctorPrefix')} ${record.doctorId.name}`
                              : record.author === 'patient'
                                ? t('patient.records.personalUpload')
                                : t('patient.records.medicalDocument')}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar size={14} className='text-primary' />
                          <span className='text-[10px] font-black text-text-secondary uppercase tracking-wider leading-none'>
                            {formatDate(record.createdAt || record.date)}
                          </span>
                        </div>
                        {record.clinicId?.name && (
                          <div className='flex items-center gap-2'>
                            <Building2 size={14} className='text-[#B45309]' />
                            <span className='text-[10px] font-black text-text-secondary uppercase tracking-wider leading-none truncate max-w-37.5'>
                              {record.clinicId.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between sm:justify-end gap-3 shrink-0'>
                    {(() => {
                      if (!record.validUntil) return null;
                      const today = new Date();
                      const validDate = new Date(record.validUntil);
                      if (validDate < today)
                        return (
                          <span className='bg-red-500/10 text-red-500 border-red-500/20 border px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest'>
                            {t('patient.records.expired')}
                          </span>
                        );
                      return (
                        <span className='bg-[#0F4C5C]/10 text-[#0F4C5C] border-[#0F4C5C]/20 border px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest'>
                          {t('patient.records.valid')}
                        </span>
                      );
                    })()}
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteId(record._id);
                        }}
                        className='h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all group'
                        title={t('patient.records.deleteRecord')}
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                      <div className='h-10 px-6 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center'>
                        {t('common.view')}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={async () => {
          setIsUploadModalOpen(false);
          await refetch();
        }}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('patient.records.deleteRecord')}
        message={t('patient.records.confirmDelete')}
      />
    </div>
  );
}
