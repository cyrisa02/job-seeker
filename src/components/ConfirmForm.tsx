// src/components/ConfirmForm.tsx

"use client";

import { ReactNode } from "react";

interface ConfirmFormProps {
  action: (formData: FormData) => void;
  message: string;
  children: ReactNode;
}

export default function ConfirmForm({
  action,
  message,
  children,
}: ConfirmFormProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}
