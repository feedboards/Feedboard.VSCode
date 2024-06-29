import { IVSCodeInput } from '../panels/MainPanel';
import classNames from 'classnames';

export const VSCodeInput = ({ className, isError = false, ...InputProps }: IVSCodeInput) => {
    return (
        <input
            className={classNames('vscode_input', className, {
                ['vscode_input-error']: isError,
            })}
            {...InputProps}
        />
    );
};
