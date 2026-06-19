"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Locale = "en" | "ur";
type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

const getRecognitionConstructor = () => {
  if (typeof window === "undefined") return null;
  return (window as typeof window & {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  }).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

const mapRecognitionError = (code: string) => {
  switch (code) {
    case "not-allowed":
      return "Microphone access denied";
    case "no-speech":
      return "No speech detected";
    case "network":
      return "Speech recognition network error";
    default:
      return "Speech recognition error";
  }
};

export function useSpeechRecognition(locale: Locale) {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const stopResolverRef = useRef<((value: string) => void) | null>(null);
  const stopRejectRef = useRef<((reason?: unknown) => void) | null>(null);
  const pendingErrorRef = useRef<string | null>(null);

  useEffect(() => {
    setIsSupported(Boolean(getRecognitionConstructor()));
  }, []);

  const reset = useCallback(() => {
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setInterimTranscript("");
    pendingErrorRef.current = null;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore abort races when the browser already ended recognition.
      }
    }

    recognitionRef.current = null;
    stopResolverRef.current = null;
    stopRejectRef.current = null;
    setIsRecording(false);
  }, []);

  useEffect(() => () => {
    reset();
  }, [reset]);

  const start = useCallback(async () => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      throw new Error("Voice prescription requires Chrome or Edge browser");
    }

    if (isRecording) {
      await stop();
    }

    reset();

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = locale === "ur" ? "ur-PK" : "en-US";

    recognition.onresult = (event: any) => {
      let interim = "";
      let fullTranscript = finalTranscriptRef.current;

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = String(event.results[index]?.[0]?.transcript || "");
        if (event.results[index].isFinal) {
          fullTranscript = `${fullTranscript} ${transcript}`.replace(/\s+/g, " ").trim();
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current = fullTranscript;
      interimTranscriptRef.current = interim.trim();
      setInterimTranscript(interim.trim());
    };

    recognition.onerror = (event: any) => {
      const message = mapRecognitionError(String(event?.error || ""));
      pendingErrorRef.current = message;

      if (event?.error === "not-allowed") {
        try {
          recognition.abort();
        } catch {
          // Ignore abort races.
        }
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;

      if (stopResolverRef.current || stopRejectRef.current) {
        if (pendingErrorRef.current) {
          const reject = stopRejectRef.current;
          stopResolverRef.current = null;
          stopRejectRef.current = null;
          reject?.(new Error(pendingErrorRef.current));
          pendingErrorRef.current = null;
          return;
        }

        const resolve = stopResolverRef.current;
        stopResolverRef.current = null;
        stopRejectRef.current = null;
        resolve?.((finalTranscriptRef.current.trim() || interimTranscriptRef.current.trim()).trim());
      }
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error: any) {
      recognitionRef.current = null;
      setIsRecording(false);
      throw new Error(mapRecognitionError(String(error?.error || error?.name || "")));
    }
  }, [isRecording, locale, reset]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      return Promise.resolve((finalTranscriptRef.current.trim() || interimTranscriptRef.current.trim()).trim());
    }

    return new Promise<string>((resolve, reject) => {
      stopResolverRef.current = resolve;
      stopRejectRef.current = reject;

      try {
        recognition.stop();
      } catch (error) {
        stopResolverRef.current = null;
        stopRejectRef.current = null;
        reject(error);
      }
    });
  }, []);

  return {
    start,
    stop,
    isRecording,
    isSupported,
    interimTranscript,
    finalTranscript: finalTranscriptRef,
    reset,
  };
}