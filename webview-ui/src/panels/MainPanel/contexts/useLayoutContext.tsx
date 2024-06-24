import { createContext, useContext, useState } from 'react';
import { IContextProviderProps, ILayoutContext, ELayoutTypes } from '..';

const LayoutContext = createContext<ILayoutContext | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }

    return context;
};

export const LayoutProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [layoutType, setLayoutType] = useState<ELayoutTypes>(ELayoutTypes.withConnectionString);

    return (
        <LayoutContext.Provider value={{ layoutType, changeLayoutType: setLayoutType }}>
            {children}
        </LayoutContext.Provider>
    );
};
