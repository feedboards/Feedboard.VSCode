import ReactDOM from 'react-dom';
import { ReactElement } from 'react';

export const render = (Element: ReactElement) => {
    return ReactDOM.render(Element, document.getElementById('root'));
};
