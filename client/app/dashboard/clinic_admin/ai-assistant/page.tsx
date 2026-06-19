'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Bot,
  Loader2,
  Mic,
  Square,
  Trash2,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useChatWithClinicAIMutation } from '@/store/api/aiApi';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

const DISCLAIMER =
  "I'm your clinic operations assistant. Ask me about appointment management, staff workflows, revenue insights, patient flow, or any operational challenge your clinic faces.";

const SUGGESTED_PROMPTS = [
  'How can I reduce no-show rates for appointments?',
  'Best practices for managing a busy clinic schedule',
  'How to improve patient flow and reduce wait times',
  'Revenue optimization strategies for a small clinic',
];

export default function ClinicAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'disclaimer', role: 'model', content: DISCLAIMER },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('en');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const [chatWithClinicAI, { isLoading }] = useChatWithClinicAIMutation();

  useEffect(() => {
    const saved = localStorage.getItem('carenexus_lang') || 'en';
    setLanguage(saved);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const conversationHistory = messages
    .filter((m) => m.id !== 'disclaimer')
    .map((m) => ({ role: m.role, content: m.content }));

  const handleSend = async (textOverride?: string) => {
    const text = textOverride ?? input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    transcriptRef.current = '';

    try {
      const result = await chatWithClinicAI({
        message: text,
        conversationHistory,
        language,
      }).unwrap();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: result.data.reply,
        },
      ]);
    } catch {
      toast.error('Failed to get AI response. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    }
  };

  const startRecording = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      transcriptRef.current = '';
      toast.success('Listening...');
    };
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(t);
      transcriptRef.current = t;
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Voice recording failed.');
    };
    recognition.onend = () => {
      setIsRecording(false);
      const t = transcriptRef.current;
      if (t?.trim()) handleSend(t);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const clearChat = () => {
    setMessages([{ id: 'disclaimer', role: 'model', content: DISCLAIMER }]);
    toast.success('Chat cleared');
  };

  return (
    <div className='flex flex-col h-[calc(100vh-8rem)] animate-in '>
      {/* Header */}
      <div className='flex items-start justify-between mb-5'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <div className='h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center'>
              <Building2 className='h-4 w-4 text-primary' />
            </div>
            <h1 className='text-xl font-bold text-text-primary'>
              Clinic AI Assistant
            </h1>
          </div>
          <p className='text-xs text-text-secondary ml-9'>
            Scheduling · Staff management · Revenue insights · Patient flow
          </p>
        </div>
        <button
          onClick={clearChat}
          className='p-2.5 rounded-xl bg-white border border-black/6 text-text-secondary hover:text-red-500 hover:bg-red-50 transition-all'
          title='Clear chat'
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className='flex-1 flex flex-col rounded-2xl overflow-hidden border border-black/6 bg-white shadow-sm min-h-0 lens-card'>
        {/* Messages */}
        <div
          ref={scrollAreaRef}
          className='flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4'
        >
          {/* Suggested prompts */}
          {messages.length === 1 && (
            <div className='mt-2 mb-4'>
              <p className='text-xs text-text-muted mb-3 font-medium uppercase tracking-wide'>
                Suggested
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className='text-left text-sm px-4 py-3 rounded-xl bg-gray-50 hover:bg-primary/5 hover:text-primary border border-black/6 text-text-secondary transition-all leading-snug'
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              {msg.role === 'model' && (
                <div className='h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mr-3 mt-1'>
                  <Bot size={15} className='text-primary' />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-3xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-primary text-white font-medium'
                    : msg.id === 'disclaimer'
                      ? 'rounded-bl-sm bg-primary/5 text-primary border border-primary/10 italic text-[13px]'
                      : 'rounded-bl-sm bg-gray-50 border border-black/6 text-text-primary',
                )}
              >
                {msg.role === 'model' ? (
                  <div className='prose prose-sm max-w-none prose-p:my-1 prose-headings:font-semibold prose-headings:text-text-primary prose-strong:text-primary prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:rounded'>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className='flex justify-start'>
              <div className='h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mr-3 mt-1'>
                <Bot size={15} className='text-primary' />
              </div>
              <div className='px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-50 border border-black/6'>
                <div className='flex gap-1.5 items-center h-4'>
                  <span className='w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse' />
                  <span className='w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse [animation-delay:150ms]' />
                  <span className='w-1.5 h-1.5 rounded-full bg-primary/90 animate-pulse [animation-delay:300ms]' />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className='p-4 border-t border-black/6 bg-gray-50/50'>
          <div className='flex items-end gap-3'>
            <div className='flex-1 relative'>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  isRecording
                    ? 'Listening...'
                    : 'Ask about scheduling, staff, revenue, patient flow...'
                }
                rows={1}
                className='w-full resize-none px-4 py-3 pr-12 rounded-xl text-sm bg-white border border-black/6 transition-colors max-h-32 overflow-y-auto focus:outline-none focus:border-primary'
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  'absolute right-2.5 bottom-2.5 p-1.5 rounded-lg transition-all',
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary bg-gray-100',
                )}
              >
                {isRecording ? (
                  <Square size={14} fill='currentColor' />
                ) : (
                  <Mic size={14} />
                )}
              </button>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || isRecording}
              className='p-3 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0'
            >
              {isLoading ? (
                <Loader2 size={18} className='animate-spin' />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
