"use client";

import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { Input } from "@/shared/components/Input";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
}

function parseISODate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { value, onChange, onBlur, invalid = false, placeholder },
  ref,
) {
  return (
    <ReactDatePicker
      selected={parseISODate(value)}
      onChange={(date: Date | null) => date && onChange(toISODate(date))}
      onBlur={onBlur}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      showPopperArrow={false}
      withPortal
      portalId="date-picker-portal"
      customInput={<Input ref={ref} icon={Calendar} invalid={invalid} readOnly />}
      wrapperClassName="block w-full"
    />
  );
});
