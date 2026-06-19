'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  useGetFamilyMembersQuery,
  useAddFamilyMemberMutation,
  useEditFamilyMemberMutation,
  useDeleteFamilyMemberMutation,
} from '@/store/api/patientApi';
import { Users, Plus, Edit, Trash2, FileText, Loader2 } from 'lucide-react';
import PenIcon from '@/icons/pen-icon';
import TrashIcon from '@/icons/trash-icon';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useTranslations } from 'next-intl';
import { showToast } from '@/lib/toast';

interface FamilyMemberFormData {
  name: string;
  relation: string;
  dob?: string;
  bloodGroup?: string;
  allergies?: string;
}

export default function FamilyPage() {
  const t = useTranslations();
  const { data, isLoading, refetch } = useGetFamilyMembersQuery(undefined);
  const [addMember] = useAddFamilyMemberMutation();
  const [editMember, { isLoading: isEditing }] = useEditFamilyMemberMutation();
  const [deleteMember] = useDeleteFamilyMemberMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [newPhotoBase64, setNewPhotoBase64] = useState<string>('');
  const [editPhotoBase64, setEditPhotoBase64] = useState<string>('');

  const members = data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FamilyMemberFormData>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue,
  } = useForm<FamilyMemberFormData>();

  const onAdd = async (data: FamilyMemberFormData) => {
    try {
      const allergiesArray = data.allergies
        ? data.allergies.split(',').map((a) => a.trim())
        : [];

      await addMember({
        ...data,
        allergies: allergiesArray,
        photo: newPhotoBase64,
      }).unwrap();

      showToast.familyAdded(t);
      refetch();
      reset();
      setNewPhotoBase64('');
      setShowAddModal(false);
    } catch (error: any) {
      showToast.error(t, error?.data?.message);
    }
  };

  const onEdit = async (data: FamilyMemberFormData) => {
    try {
      const allergiesArray = data.allergies
        ? data.allergies.split(',').map((a) => a.trim())
        : [];

      await editMember({
        id: editingMember._id,
        ...data,
        allergies: allergiesArray,
        photo: editPhotoBase64,
      }).unwrap();

      toast.success(t('toast.familyUpdated'));
      refetch();
      resetEdit();
      setEditPhotoBase64('');
      setEditingMember(null);
    } catch (error: any) {
      toast.error(error?.data?.message || t('common.error'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMember(deleteId).unwrap();
      showToast.familyRemoved(t);
      refetch();
      setDeleteId(null);
    } catch (error: any) {
      showToast.error(t, error?.data?.message);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setEditPhotoBase64(member.photo || '');
    setValue('name', member.name);
    setValue('relation', member.relation);
    setValue('dob', member.dob ? member.dob.split('T')[0] : '');
    setValue('bloodGroup', member.bloodGroup || '');
    setValue('allergies', member.allergies?.join(', ') || '');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-text-primary'>
          {t('nav.family')}
        </h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className='mr-2 h-4 w-4' />
          {t('patient.addFamilyMember')}
        </Button>
      </div>

      {/* Family Members List */}
      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-2'>
          {[1, 2].map((i) => (
            <div
              key={i}
              className='h-40 animate-pulse rounded-2xl border border-border-light bg-white lens-card'
            />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className='rounded-2xl border border-border-light bg-white p-12 text-center lens-card'>
          <Users className='mx-auto h-12 w-12 text-text-secondary' />
          <h3 className='mt-4 text-lg font-semibold text-text-primary'>
            {t('patient.family.noMembers')}
          </h3>
          <p className='mt-2 text-sm font-bold text-text-secondary'>
            {t('patient.family.addFirstMember')}
          </p>
          <Button onClick={() => setShowAddModal(true)} className='mt-4'>
            {t('patient.addFamilyMember')}
          </Button>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {members.map((member: any) => (
            <div
              key={member._id}
              className='rounded-2xl border border-border-light bg-white p-6 transition-all hover:border-primary lens-card'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex items-start gap-3'>
                  <div className='rounded-full bg-primary/10 h-14 w-14 flex items-center justify-center overflow-hidden shrink-0'>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <Users className='h-6 w-6 text-primary' />
                    )}
                  </div>
                  <div>
                    <h3 className='font-semibold text-text-primary'>
                      {member.name}
                    </h3>
                    <p className='text-sm text-text-secondary'>
                      {member.relation}
                    </p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => openEditModal(member)}
                    className='rounded-lg p-2 text-text-secondary hover:bg-surface :bg-ink-soft group'
                  >
                    <PenIcon className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => confirmDelete(member._id, member.name)}
                    className='rounded-lg p-2 text-red-600 hover:bg-red-50 :bg-red-900/20 group'
                  >
                    <TrashIcon className='h-4 w-4' />
                  </button>
                </div>
              </div>

              <div className='space-y-2 text-sm'>
                {member.dob && (
                  <div className='flex justify-between'>
                    <span className='text-text-secondary'>
                      {t('form.dob')}:
                    </span>
                    <span className='font-medium text-text-primary'>
                      {new Date(member.dob).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {member.bloodGroup && (
                  <div className='flex justify-between'>
                    <span className='text-text-secondary'>
                      {t('patient.bloodGroup')}:
                    </span>
                    <span className='font-medium text-text-primary'>
                      {member.bloodGroup}
                    </span>
                  </div>
                )}
                {member.allergies && member.allergies.length > 0 && (
                  <div>
                    <span className='text-text-secondary'>
                      {t('patient.allergies')}:
                    </span>
                    <div className='mt-1 flex flex-wrap gap-1'>
                      {member.allergies.map((allergy: string, idx: number) => (
                        <span
                          key={idx}
                          className='rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800'
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/dashboard/patient/family/${member._id}/records`}
                className='mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20'
              >
                <FileText className='h-4 w-4' />
                {t('patient.family.viewRecord')}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          reset();
        }}
        title={t('patient.addFamilyMember')}
      >
        <form onSubmit={handleSubmit(onAdd)} className='space-y-4'>
          <div className='flex flex-col items-center gap-2 mb-4'>
            <div className='relative group overflow-hidden h-20 w-20 rounded-full border border-border-light bg-surface flex items-center justify-center'>
              {newPhotoBase64 ? (
                <img
                  src={newPhotoBase64}
                  alt='Preview'
                  className='h-full w-full object-cover'
                />
              ) : (
                <Users className='h-8 w-8 text-text-primary opacity-20' />
              )}
              <label
                htmlFor='new-photo'
                className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <span className='text-white text-[10px] font-bold uppercase'>
                  {t('patient.family.upload')}
                </span>
              </label>
              <input
                id='new-photo'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) =>
                      setNewPhotoBase64(event.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <span className='text-[10px] font-black uppercase tracking-widest text-text-primary'>
              {t('patient.family.profilePicture')}{' '}
              <span className='opacity-50'>{t('patient.family.optional')}</span>
            </span>
          </div>

          <Input
            label={t('form.name')}
            placeholder={t('form.fullName')}
            error={errors.name?.message}
            {...register('name', { required: t('form.required') })}
            className='rounded-2xl'
          />
          <Input
            label={t('patient.relation')}
            placeholder={t('patient.family.relationPlaceholder')}
            error={errors.relation?.message}
            {...register('relation', { required: t('form.required') })}
            className='rounded-2xl'
          />
          <Input
            label={t('form.dob')}
            type='date'
            {...register('dob')}
            className='rounded-2xl'
          />
          <Input
            label={t('patient.bloodGroup')}
            placeholder={t('patient.family.bloodGroupPlaceholder')}
            {...register('bloodGroup')}
            className='rounded-2xl'
          />
          <Input
            label={t('patient.allergies')}
            placeholder={t('patient.family.allergiesPlaceholder')}
            {...register('allergies')}
            className='rounded-2xl'
          />
          <div className='flex justify-end gap-3 pt-6 border-t border-black/5'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setShowAddModal(false);
                reset();
              }}
              className='rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]'
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='submit'
              className='rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]'
            >
              {t('patient.addFamilyMember')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => {
          if (isEditing) return;
          setEditingMember(null);
          resetEdit();
        }}
        title={t('patient.editFamilyMember')}
      >
        <form onSubmit={handleSubmitEdit(onEdit)} className='space-y-4'>
          <div className='flex flex-col items-center gap-2 mb-4'>
            <div className='relative group overflow-hidden h-20 w-20 rounded-full border border-border-light bg-surface flex items-center justify-center'>
              {editPhotoBase64 ? (
                <img
                  src={editPhotoBase64}
                  alt='Preview'
                  className='h-full w-full object-cover'
                />
              ) : (
                <Users className='h-8 w-8 text-text-primary opacity-20' />
              )}
              <label
                htmlFor='edit-photo'
                className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <span className='text-white text-[10px] font-bold uppercase'>
                  {t('patient.family.update')}
                </span>
              </label>
              <input
                id='edit-photo'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) =>
                      setEditPhotoBase64(event.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <span className='text-[10px] font-black uppercase tracking-widest text-text-primary'>
              {t('patient.family.profilePicture')}
            </span>
          </div>

          <Input
            label={t('form.name')}
            placeholder={t('form.fullName')}
            error={errorsEdit.name?.message}
            {...registerEdit('name', { required: t('form.required') })}
            className='rounded-2xl'
          />
          <Input
            label={t('patient.relation')}
            placeholder={t('patient.family.relationPlaceholder')}
            error={errorsEdit.relation?.message}
            {...registerEdit('relation', { required: t('form.required') })}
            className='rounded-2xl'
          />
          <Input
            label={t('form.dob')}
            type='date'
            {...registerEdit('dob')}
            className='rounded-2xl'
          />
          <Input
            label={t('patient.bloodGroup')}
            placeholder={t('patient.family.bloodGroupPlaceholder')}
            {...registerEdit('bloodGroup')}
            className='rounded-2xl'
          />
          <Input
            label={t('patient.allergies')}
            placeholder={t('patient.family.allergiesPlaceholder')}
            {...registerEdit('allergies')}
            className='rounded-2xl'
          />
          <div className='flex justify-end gap-3 pt-6 border-t border-black/5'>
            <Button
              type='button'
              variant='outline'
              disabled={isEditing}
              onClick={() => {
                setEditingMember(null);
                resetEdit();
              }}
              className='rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]'
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='submit'
              disabled={isEditing}
              className='rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isEditing ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  {t('common.updating')}
                </>
              ) : (
                t('patient.family.updateMember')
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('modal.removeFamilyTitle')}
        message={t('modal.removeFamilyMsg')}
        confirmText={t('common.delete')}
        variant='danger'
      />
    </div>
  );
}
