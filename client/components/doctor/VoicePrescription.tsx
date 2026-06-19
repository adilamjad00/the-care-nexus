'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader, Mic, MicOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale, useTranslations } from 'next-intl';
import { useParseTranscriptMutation } from '@/store/api/aiApi';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

type ParsedMedicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
};

type ParsedPrescription = {
  diagnosis: string | null;
  medicines: ParsedMedicine[];
  notes: string | null;
  consultationFee: number | null;
  medicineCost: number | null;
};

type VoicePrescriptionProps = {
  onPrescriptionReady: (parsed: ParsedPrescription) => void;
  onTranscriptReady?: (transcript: string) => void;
};

const MIN_TRANSCRIPT_LENGTH = 15;

export function VoicePrescription({
  onPrescriptionReady,
  onTranscriptReady,
}: VoicePrescriptionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [parseTranscript] = useParseTranscriptMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    start,
    stop,
    isRecording,
    isSupported,
    interimTranscript,
    finalTranscript,
    reset,
  } = useSpeechRecognition(locale === 'ur' ? 'ur' : 'en');
  const sessionActiveRef = useRef(false);
  const manualStopRequestedRef = useRef(false);

  const transcript =
    `${finalTranscript.current}${interimTranscript ? ` ${interimTranscript}` : ''}`
      .replace(/\s+/g, ' ')
      .trim();
  const canRecord = isSupported && !isSubmitting;

  const submitTranscript = async (text: string) => {
    if (text.length < MIN_TRANSCRIPT_LENGTH) {
      toast.error('No speech detected. Please try again.');
      reset();
      return;
    }

    const loadingToast = toast.loading('Analyzing with Groq...');
    setIsSubmitting(true);

    try {
      const response = await parseTranscript({
        transcript: text,
        locale: locale === 'ur' ? 'ur' : 'en',
      }).unwrap();
      const parsed = response?.data?.parsed;

      if (!parsed) {
        throw new Error(
          'AI processing failed. You can fill the form manually.',
        );
      }

      toast.dismiss(loadingToast);
      toast.success('Prescription extracted — please review before saving');
      onTranscriptReady?.(text);
      onPrescriptionReady(parsed);
      reset();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message =
        error?.data?.message ||
        error?.message ||
        'AI processing failed. You can fill the form manually.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      sessionActiveRef.current = false;
      manualStopRequestedRef.current = false;
    }
  };

  useEffect(() => {
    if (
      !isRecording &&
      sessionActiveRef.current &&
      !manualStopRequestedRef.current
    ) {
      const text = transcript;
      if (!text) {
        toast.error('No speech detected. Please try again.');
        reset();
        sessionActiveRef.current = false;
        return;
      }

      void submitTranscript(text);
    }
  }, [isRecording]);

  const handleToggleRecording = async () => {
    if (!canRecord) return;

    if (isRecording) {
      manualStopRequestedRef.current = true;
      try {
        const finalText = await stop();
        await submitTranscript(finalText || transcript);
      } catch (error: any) {
        const message = error?.message || 'Speech recognition error';
        if (message === 'Microphone access denied') {
          toast.error(
            'Microphone access denied. Allow mic in browser settings.',
          );
        } else if (message === 'No speech detected') {
          toast.error('No speech detected. Please try again.');
        } else {
          toast.error(message);
        }
        reset();
      }
      return;
    }

    try {
      manualStopRequestedRef.current = false;
      sessionActiveRef.current = true;
      reset();
      await start();
    } catch (error: any) {
      sessionActiveRef.current = false;
      toast.error(error?.message || 'Speech recognition error');
    }
  };

  const clearTranscript = () => {
    reset();
  };

  if (!isSupported) {
    return (
      <div className='rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900'>
        <p className='font-bold'>
          Voice prescription requires Chrome or Edge browser
        </p>
        <p className='mt-1 text-sm'>
          You can still fill the prescription manually.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
      <div className='flex items-start justify-between gap-4 mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {t('doctor.prescriptions.record')}
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base font-medium'>
            Speak the prescription clearly in English or Urdu.
          </p>
        </div>
        <button
          type='button'
          onClick={clearTranscript}
          className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors'
          disabled={isRecording || isSubmitting}
        >
          <Trash2 className='h-4 w-4' />
          Clear
        </button>
      </div>

      <div className='text-center py-6'>
        <div
          className={`mx-auto h-40 w-40 rounded-full flex items-center justify-center mb-6 transition-all ${isRecording ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' : 'bg-primary/10 dark:bg-primary/20'}`}
        >
          {isRecording ? (
            <div className='relative'>
              <MicOff className='h-20 w-20 text-red-600' />
              <div className='absolute -top-2 -right-2 h-4 w-4 bg-red-600 rounded-full animate-ping' />
            </div>
          ) : (
            <Mic className='h-20 w-20 text-primary' />
          )}
        </div>

        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          {isRecording
            ? 'Recording in progress...'
            : 'Tap start, speak the prescription, then tap stop.'}
        </p>

        <div className='mx-auto max-w-2xl mb-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left dark:border-slate-700 dark:bg-slate-900/60'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2'>
            Live Transcript
          </p>
          <p className='min-h-24 whitespace-pre-wrap text-sm leading-7 text-slate-900 dark:text-slate-100'>
            <span>{finalTranscript.current}</span>
            {interimTranscript ? (
              <span className='italic text-slate-400'>
                {finalTranscript.current
                  ? ` ${interimTranscript}`
                  : interimTranscript}
              </span>
            ) : null}
          </p>
        </div>

        <button
          type='button'
          onClick={handleToggleRecording}
          disabled={!canRecord}
          className={`inline-flex items-center gap-3 rounded-2xl px-10 py-4 text-lg font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover'}`}
        >
          {isSubmitting ? (
            <Loader className='h-5 w-5 animate-spin' />
          ) : isRecording ? (
            <MicOff className='h-5 w-5' />
          ) : (
            <Mic className='h-5 w-5' />
          )}
          {isSubmitting
            ? 'Analyzing...'
            : isRecording
              ? 'Stop Recording'
              : 'Start Recording'}
        </button>
      </div>
    </div>
  );
}

export default VoicePrescription;
