'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetPatientByIdQuery } from '@/store/api/doctorApi';
import Link from 'next/link';
import {
  Loader,
  User,
  Calendar,
  Phone,
  Mail,
  FileText,
  Pill,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.patientId as string;
  const [activeTab, setActiveTab] = useState<
    'records' | 'prescriptions' | 'appointments'
  >('records');

  const { data, isLoading } = useGetPatientByIdQuery(patientId);

  const patient = data?.data?.patient;
  const records = data?.data?.records || [];
  const prescriptions = data?.data?.prescriptions || [];
  const appointments = data?.data?.appointments || [];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader className='h-12 w-12 animate-spin text-primary' />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className='text-center py-20'>
        <p className='text-text-secondary text-lg'>Patient not found</p>
        <Link
          href='/dashboard/doctor/patients'
          className='inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all'
        >
          <ArrowLeft className='h-5 w-5' />
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Back Button */}
      <Link
        href='/dashboard/doctor/patients'
        className='inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors'
      >
        <ArrowLeft className='h-5 w-5' />
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className='bg-surface dark:bg-surface-dark rounded-2xl border border-border-light p-8'>
        <div className='flex items-start gap-6'>
          <div className='h-24 w-24 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-gray-900 font-bold text-4xl shadow-xl'>
            {patient.name?.[0]?.toUpperCase() || 'P'}
          </div>
          <div className='flex-1'>
            <h1 className='text-4xl font-bold text-text-primary dark:text-text-primary mb-3'>
              {patient.name}
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {patient.email && (
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-primary-bg rounded-lg flex items-center justify-center'>
                    <Mail className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-xs text-text-muted'>Email</p>
                    <p className='text-text-primary dark:text-text-primary font-medium'>
                      {patient.email}
                    </p>
                  </div>
                </div>
              )}
              {patient.phone && (
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-primary-bg rounded-lg flex items-center justify-center'>
                    <Phone className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-xs text-text-muted'>Phone</p>
                    <p className='text-text-primary dark:text-text-primary font-medium'>
                      {patient.phone}
                    </p>
                  </div>
                </div>
              )}
              {patient.dob && (
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-primary-bg rounded-lg flex items-center justify-center'>
                    <Calendar className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-xs text-text-muted'>Date of Birth</p>
                    <p className='text-text-primary dark:text-text-primary font-medium'>
                      {new Date(patient.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Link
            href='/dashboard/doctor/prescriptions/new'
            className='px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl'
          >
            New Prescription
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-surface dark:bg-surface-dark p-6 rounded-2xl border border-border-light'>
          <div className='flex items-center gap-3 mb-2'>
            <FileText className='h-6 w-6 text-primary' />
            <h3 className='font-semibold text-text-secondary'>Total Records</h3>
          </div>
          <p className='text-4xl font-bold text-text-primary dark:text-text-primary'>
            {records.length}
          </p>
        </div>
        <div className='bg-surface dark:bg-surface-dark p-6 rounded-2xl border border-border-light'>
          <div className='flex items-center gap-3 mb-2'>
            <Pill className='h-6 w-6 text-primary' />
            <h3 className='font-semibold text-text-secondary'>Prescriptions</h3>
          </div>
          <p className='text-4xl font-bold text-text-primary dark:text-text-primary'>
            {prescriptions.length}
          </p>
        </div>
        <div className='bg-surface dark:bg-surface-dark p-6 rounded-2xl border border-border-light'>
          <div className='flex items-center gap-3 mb-2'>
            <Calendar className='h-6 w-6 text-primary' />
            <h3 className='font-semibold text-text-secondary'>Appointments</h3>
          </div>
          <p className='text-4xl font-bold text-text-primary dark:text-text-primary'>
            {appointments.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-surface dark:bg-surface-dark rounded-2xl border border-border-light overflow-hidden'>
        <div className='flex border-b border-border-light'>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'records'
                ? 'bg-primary-bg text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:bg-surface/30'
            }`}
          >
            Medical Records ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-primary-bg text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:bg-surface/30'
            }`}
          >
            Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'appointments'
                ? 'bg-primary-bg text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:bg-surface/30'
            }`}
          >
            Appointments ({appointments.length})
          </button>
        </div>

        <div className='p-6'>
          {activeTab === 'records' && (
            <div className='space-y-4'>
              {records.length === 0 ? (
                <p className='text-center text-text-secondary py-12'>
                  No medical records found
                </p>
              ) : (
                records.map((record: any) => (
                  <div
                    key={record._id}
                    className='p-5 bg-surface/30 rounded-xl border border-border-light'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <h4 className='font-bold text-text-primary dark:text-text-primary text-lg'>
                        {record.diagnosis || 'Medical Record'}
                      </h4>
                      <span className='text-sm text-text-muted flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {record.notes && (
                      <p className='text-text-primary mb-3'>{record.notes}</p>
                    )}
                    {record.vitalSigns && (
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                        {record.vitalSigns.bloodPressure && (
                          <div className='bg-surface dark:bg-surface-dark p-3 rounded-lg'>
                            <p className='text-xs text-text-muted'>BP</p>
                            <p className='font-semibold text-text-primary dark:text-text-primary'>
                              {record.vitalSigns.bloodPressure}
                            </p>
                          </div>
                        )}
                        {record.vitalSigns.heartRate && (
                          <div className='bg-surface dark:bg-surface-dark p-3 rounded-lg'>
                            <p className='text-xs text-text-muted'>
                              Heart Rate
                            </p>
                            <p className='font-semibold text-text-primary dark:text-text-primary'>
                              {record.vitalSigns.heartRate} bpm
                            </p>
                          </div>
                        )}
                        {record.vitalSigns.temperature && (
                          <div className='bg-surface dark:bg-surface-dark p-3 rounded-lg'>
                            <p className='text-xs text-text-muted'>
                              Temperature
                            </p>
                            <p className='font-semibold text-text-primary dark:text-text-primary'>
                              {record.vitalSigns.temperature}°F
                            </p>
                          </div>
                        )}
                        {record.vitalSigns.weight && (
                          <div className='bg-surface dark:bg-surface-dark p-3 rounded-lg'>
                            <p className='text-xs text-text-muted'>Weight</p>
                            <p className='font-semibold text-text-primary dark:text-text-primary'>
                              {record.vitalSigns.weight} kg
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className='space-y-4'>
              {prescriptions.length === 0 ? (
                <p className='text-center text-text-secondary py-12'>
                  No prescriptions found
                </p>
              ) : (
                prescriptions.map((prescription: any) => (
                  <div
                    key={prescription._id}
                    className='p-5 bg-surface/30 rounded-xl border border-border-light'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h4 className='font-bold text-text-primary dark:text-text-primary text-lg'>
                          {prescription.diagnosis}
                        </h4>
                        {prescription.medicines && (
                          <p className='text-sm text-text-secondary mt-1'>
                            {prescription.medicines.length} medicine(s)
                            prescribed
                          </p>
                        )}
                      </div>
                      <span className='text-sm text-text-muted flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {prescription.medicines &&
                      prescription.medicines.length > 0 && (
                        <div className='space-y-2 mt-4'>
                          {prescription.medicines.map(
                            (med: any, idx: number) => (
                              <div
                                key={idx}
                                className='flex items-start gap-3 p-3 bg-surface dark:bg-surface-dark rounded-lg'
                              >
                                <Pill className='h-5 w-5 text-primary mt-0.5' />
                                <div className='flex-1'>
                                  <p className='font-semibold text-text-primary dark:text-text-primary'>
                                    {med.name}
                                  </p>
                                  <p className='text-sm text-text-secondary'>
                                    {med.dosage} • {med.frequency} •{' '}
                                    {med.duration}
                                  </p>
                                  {med.instructions && (
                                    <p className='text-xs text-text-muted mt-1'>
                                      {med.instructions}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className='space-y-4'>
              {appointments.length === 0 ? (
                <p className='text-center text-text-secondary py-12'>
                  No appointments found
                </p>
              ) : (
                appointments.map((appointment: any) => (
                  <div
                    key={appointment._id}
                    className='p-5 bg-surface/30 rounded-xl border border-border-light'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-bold text-text-primary dark:text-text-primary text-lg'>
                          {new Date(appointment.dateTime).toLocaleDateString()}{' '}
                          at{' '}
                          {new Date(appointment.dateTime).toLocaleTimeString(
                            'en-US',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </h4>
                        <p className='text-sm text-text-secondary mt-1'>
                          {appointment.type || 'Consultation'}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                          appointment.status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : appointment.status === 'in-progress'
                              ? 'bg-orange-50 text-orange-700'
                              : appointment.status === 'confirmed'
                                ? 'bg-blue-50 text-blue-700'
                                : appointment.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
