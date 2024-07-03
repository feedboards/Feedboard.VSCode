import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface IVSCodeInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    isError?: boolean;
}
