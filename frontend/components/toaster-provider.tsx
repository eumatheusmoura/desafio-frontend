"use client";

import { useEffect, useRef } from "react";
import Toaster, { type ToasterRef } from "./ui/toaster";
import { setGlobalToasterRef } from "../hooks/use-toast";

interface ToasterProviderProps {
  defaultPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

export default function ToasterProvider({
  defaultPosition = "top-center",
}: ToasterProviderProps) {
  const toasterRef = useRef<ToasterRef>(null);

  useEffect(() => {
    setGlobalToasterRef(toasterRef.current);

    return () => {
      setGlobalToasterRef(null);
    };
  }, []);

  return <Toaster ref={toasterRef} defaultPosition={defaultPosition} />;
}
