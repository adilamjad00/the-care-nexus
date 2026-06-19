"use client";

/**
 * CareNexus — Modal component
 * Design system: Blue Sky palette.
 * White panel on blurred navy overlay. No logic changes.
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ isolation: "isolate" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(8,28,68,0.45)] backdrop-blur-[3px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          "relative bg-white",
          "rounded-[20px]",
          "border border-[rgba(37,99,235,0.12)]",
          "shadow-[0_20px_60px_rgba(37,99,235,0.18),_0_4px_16px_rgba(37,99,235,0.10)]",
          "w-full flex flex-col",
          "max-h-[88vh]",
          sizeClasses[size],
        ].join(" ")}
        style={{ animation: "cnModalIn 0.18s ease both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(37,99,235,0.08)] shrink-0">
          <h2 className="font-sans text-[1.0625rem] font-bold text-text-primary tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={[
              "h-8 w-8 rounded-[8px] flex items-center justify-center",
              "text-text-muted transition-all",
              "hover:text-text-primary hover:bg-[rgba(37,99,235,0.07)]",
            ].join(" ")}
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {children}
        </div>

        {/* Optional footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(37,99,235,0.08)] shrink-0">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes cnModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>,
    document.body,
  );
}
