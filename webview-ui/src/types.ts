import { SVGProps, DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface IIcon extends SVGProps<SVGSVGElement> {}

export interface IVSCodeInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    isError?: boolean;
}
