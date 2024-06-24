import { IVSCodeInput } from '..';
import classNames from 'classnames';
import '../../../scss/components/vscode.scss';

export const VSCodeInput = ({ className, ...InputProps }: IVSCodeInput) => {
    return <input className={classNames('vscode_input', className)} {...InputProps} />;
};
