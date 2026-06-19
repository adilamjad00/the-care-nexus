'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Loader2, Mic, Square, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChatWithAIMutation } from '@/store/api/aiApi';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export default function AIAssistantPage() {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'disclaimer', role: 'model', content: t('ai.disclaimer') },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [chatWithAI, { isLoading }] = useChatWithAIMutation();
  const [language, setLanguage] = useState<string>('en');
  const transcriptRef = useRef('');

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
    const textToSend = textOverride || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    transcriptRef.current = '';

    try {
      const result = await chatWithAI({
        message: userMessage.content,
        conversationHistory,
        language: isUrduLang ? 'ur' : 'en',
      }).unwrap();
      const aiReply = result.data.reply;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: aiReply,
        },
      ]);
    } catch {
      toast.error(t('ai.processingFailed'));
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    }
  };

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    const isUrdu = document.documentElement.lang === 'ur' || language === 'ur';
    recognition.lang = isUrdu ? 'ur-PK' : 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      transcriptRef.current = '';
      toast.success(t('doctor.prescriptions.recordingStarted'));
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setInput(transcript);
      transcriptRef.current = transcript;
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast.error('Voice recording failed. Please try again.');
    };

    recognition.onend = () => {
      setIsRecording(false);
      const finalTranscript = transcriptRef.current;
      if (finalTranscript && finalTranscript.trim()) {
        handleSend(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { id: 'disclaimer', role: 'model', content: t('ai.disclaimer') },
    ]);
    toast.success('Chat cleared');
  };

  const isUrduLang =
    language === 'ur' || document.documentElement.lang === 'ur';

  return (
    <div className='flex flex-col h-[calc(100vh-8rem)] animate-in'>
      <div className='flex items-start justify-between mb-5'>
        <div>
          <h1
            className={cn(
              'text-2xl font-black tracking-tight text-text-primary',
              isUrduLang && 'font-urdu text-3xl',
            )}
          >
            {isUrduLang ? 'AI اسسٹنٹ' : 'AI Assistant'}
          </h1>
          <p
            className={cn(
              'text-sm text-text-secondary mt-1',
              isUrduLang && 'font-urdu',
            )}
          >
            {t('ai.disclaimer').slice(0, 60)}...
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={clearChat}
            className='p-2.5 rounded-xl bg-white border border-black/5 text-text-secondary hover:text-red-500 hover:bg-red-50 transition-all'
            title='Clear Chat'
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className='flex-1 flex flex-col rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm lens-card'>
        <div
          ref={scrollAreaRef}
          className='flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4 scrollbar-hide'
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex group',
                msg.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              {msg.role === 'model' && (
                <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-sm'>
                  <Bot size={16} className='text-primary' />
                </div>
              )}
              <div className='relative group max-w-[85%] sm:max-w-[75%]'>
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all',
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-primary text-white font-medium'
                      : msg.id === 'disclaimer'
                        ? 'rounded-bl-sm bg-primary/5 text-primary border border-primary/10 italic'
                        : 'rounded-bl-sm bg-background border border-black/5 text-text-primary',
                    isUrduLang && 'font-urdu text-base leading-loose',
                  )}
                  dir='auto'
                >
                  {msg.role === 'model' ? (
                    <div
                      className={cn(
                        'prose prose-sm max-w-none prose-p:my-1 prose-headings:font-bold prose-headings:text-text-primary prose-strong:text-primary',
                        isUrduLang && 'prose-p:leading-loose',
                      )}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className='flex justify-start animate-in'>
              <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-sm'>
                <Bot size={16} className='text-primary' />
              </div>
              <div className='px-5 py-4 rounded-2xl rounded-bl-sm bg-background border border-black/5'>
                <div className='flex gap-1.5 items-center'>
                  <span className='w-2 h-2 rounded-full bg-primary/40 animate-pulse' />
                  <span className='w-2 h-2 rounded-full bg-primary/60 animate-pulse [animation-delay:200ms]' />
                  <span className='w-2 h-2 rounded-full bg-primary/80 animate-pulse [animation-delay:400ms]' />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='p-4 bg-background/50 backdrop-blur-sm border-t border-black/5'>
          <div className='max-w-4xl mx-auto flex items-end gap-3'>
            <div className='flex-1 relative group'>
              <textarea
                id='ai-input'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRecording
                    ? isUrduLang
                      ? 'سن رہا ہوں...'
                      : 'Listening...'
                    : isUrduLang
                      ? 'سوال پوچھیں...'
                      : t('ai.askQuestion')
                }
                rows={1}
                dir='auto'
                className={cn(
                  'w-full resize-none px-4 py-3.5 pr-12 rounded-2xl text-sm bg-white border border-border-light transition-colors max-h-32 overflow-y-auto',
                  isUrduLang && 'font-urdu text-base',
                )}
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  'absolute right-2.5 bottom-2.5 p-2 rounded-xl transition-all shadow-sm',
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary bg-background border border-black/5',
                )}
              >
                {isRecording ? (
                  <Square size={16} fill='currentColor' />
                ) : (
                  <Mic size={16} />
                )}
              </button>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || isRecording}
              className='p-3.5 rounded-2xl bg-primary text-black hover:bg-primary-hover shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
            >
              {isLoading ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
