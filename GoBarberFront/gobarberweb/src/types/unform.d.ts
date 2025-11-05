declare module '@unform/core' {
  import { FormEvent } from 'react';

  export interface FormHandles {
    submitForm(): void;
    getFieldValue(name: string): any;
    setFieldValue(name: string, value: any): void;
    getFieldError(name: string): string;
    setFieldError(name: string, error: string): void;
    getErrors(): object;
    setErrors(errors: object): void;
    reset(): void;
  }

  export function useField(name: string): any;
}

declare module '@unform/web' {
  import { FormHandles } from '@unform/core';
  import { FormHTMLAttributes } from 'react';

  export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    ref?: React.RefObject<FormHandles>;
    onSubmit: (data: any) => void;
  }

  export const Form: React.FC<FormProps>;
}
