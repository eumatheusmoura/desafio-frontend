"use client";

import { useRef } from "react";
import type { ToasterRef } from "../components/ui/toaster";

interface UseToastOptions {
  title?: string;
  message: string;
  variant?: "default" | "success" | "error" | "warning";
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  onDismiss?: () => void;
  highlightTitle?: boolean;
}


let globalToasterRef: ToasterRef | null = null;

export const setGlobalToasterRef = (ref: ToasterRef | null) => {
  globalToasterRef = ref;
};

export const useToast = () => {
  const showToast = (options: UseToastOptions) => {
    if (globalToasterRef) {
      globalToasterRef.show(options);
    } else {
      console.warn(
        "Toaster not initialized. Make sure Toaster component is mounted."
      );
    }
  };

  const success = (
    title: string,
    message: string,
    options?: Partial<UseToastOptions>
  ) => {
    showToast({
      title,
      message,
      variant: "success",
      position: "top-center",
      duration: 4000,
      ...options,
    });
  };

  const error = (
    title: string,
    message: string,
    options?: Partial<UseToastOptions>
  ) => {
    showToast({
      title,
      message,
      variant: "error",
      position: "top-center",
      duration: 6000,
      ...options,
    });
  };

  const warning = (
    title: string,
    message: string,
    options?: Partial<UseToastOptions>
  ) => {
    showToast({
      title,
      message,
      variant: "warning",
      position: "top-center",
      duration: 5000,
      ...options,
    });
  };

  const info = (
    title: string,
    message: string,
    options?: Partial<UseToastOptions>
  ) => {
    showToast({
      title,
      message,
      variant: "default",
      position: "top-center",
      duration: 4000,
      ...options,
    });
  };

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
  };
};
