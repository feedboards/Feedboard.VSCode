import { createContext, useContext, useEffect, useState } from 'react';
import { IContextProviderProps, ILayoutContext } from '../types';
import { ELayoutTypes } from '../enums';

const LayoutContext = createContext<ILayoutContext | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }

    return context;
};

export const LayoutProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [layoutType, setLayoutType] = useState<ELayoutTypes>(ELayoutTypes.default);
    const [hasHeader, setHasHeader] = useState<boolean>(layoutType === ELayoutTypes.default ? true : false);

    const changeLayoutType = (type: ELayoutTypes) => {
        setLayoutType(type);

        if (type === ELayoutTypes.connection) {
            setHasHeader(false);
        } else {
            setHasHeader(true);
        }
    };

    return (
        <LayoutContext.Provider value={{ layoutType, changeLayoutType, hasHeader }}>{children}</LayoutContext.Provider>
    );
};
