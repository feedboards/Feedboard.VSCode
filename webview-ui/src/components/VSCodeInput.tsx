import { IVSCodeInput } from '../panels/MainPanel';
import classNames from 'classnames';

export const VSCodeInput = ({ className, ...InputProps }: IVSCodeInput) => {
    return <input className={classNames('vscode_input', className)} {...InputProps} />;
};
