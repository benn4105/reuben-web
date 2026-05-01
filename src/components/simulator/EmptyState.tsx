"use client";

import { cn } from "@/lib/utils";
import { Inbox, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
        <Inbox size={32} className="text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 mb-5">
        <AlertCircle size={32} className="text-rose-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 text-sm font-medium rounded-lg border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/[0.16] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
