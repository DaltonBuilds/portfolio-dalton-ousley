'use client';

import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AccessibleFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'textarea';
  required?: boolean;
  error?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  register: UseFormRegister<T>;
  className?: string;
}

/**
 * AccessibleFormField component
 * Provides an accessible form field with:
 * - Associated label
 * - Error message with aria-describedby
 * - Required indicator
 * - Proper ARIA attributes
 * 
 * Requirements: 13.1, 13.4
 */
export function AccessibleFormField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  required = false,
  error,
  description,
  placeholder,
  disabled = false,
  register,
  className,
}: AccessibleFormFieldProps<T>) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;
  
  // Build aria-describedby string
  const ariaDescribedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const commonProps = {
    id: fieldId,
    placeholder,
    disabled,
    'aria-invalid': error ? ('true' as const) : ('false' as const),
    'aria-describedby': ariaDescribedBy,
    'aria-required': required ? ('true' as const) : undefined,
  };

  return (
    <div className={className}>
      <Label htmlFor={fieldId} className="text-slate-700 dark:text-slate-300">
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </Label>
      
      {description && (
        <p
          id={descriptionId}
          className="text-sm text-slate-600 dark:text-slate-400 mt-1"
        >
          {description}
        </p>
      )}
      
      <div className="mt-2">
        {type === 'textarea' ? (
          <Textarea
            {...commonProps}
            {...register(name)}
            className="min-h-[120px] resize-none"
          />
        ) : (
          <Input
            {...commonProps}
            type={type}
            {...register(name)}
          />
        )}
      </div>
      
      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400 font-medium mt-2"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
