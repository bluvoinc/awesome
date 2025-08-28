import React from 'react';

interface StatusMessageProps {
  message: string;
  type: "info" | "success" | "error";
}

export function StatusMessage({ message, type }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.25rem",
        backgroundColor:
          type === "error"
            ? "#000000"
            : type === "success"
            ? "#000000"
            : "#000",
        color:
          type === "error"
            ? "#721c24"
            : type === "success"
            ? "#155724"
            : "#495057",
      }}
    >
      {message}
    </div>
  );
}