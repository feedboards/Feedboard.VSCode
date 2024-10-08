import { createContext, FC, useContext, useEffect, useState } from 'react';
import { ELoginType } from '@feedboard/feedboard.core';
import { ELayoutTypes, IContextProviderProps, ILayoutContext } from '../types';
import { useGlobal } from './useGlobalContext';

const LayoutContext = createContext<ILayoutContext | undefined>(undefined);

export const useLayout = (): ILayoutContext => {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }

    return context;
};

export const LayoutProvider: FC<IContextProviderProps> = ({ children }) => {
    const [layoutType, setLayoutType] = useState<ELayoutTypes>(ELayoutTypes.withAzureOAuth);

    const { connection } = useGlobal();

    useEffect(() => {
        if (connection !== undefined) {
            console.log('connection.settings.loginType', connection.settings.loginType);

            const layoutType = ConvertELoginTypeTOElayoutTypes(connection.settings.loginType);

            console.log('layoutType', layoutType);

            if (layoutType !== null) {
                setLayoutType(layoutType);
            }
        }
    }, [connection]);

    const ConvertELoginTypeTOElayoutTypes = (loginType: ELoginType): ELayoutTypes | null => {
        switch (loginType) {
            case ELoginType.connectionString:
                return ELayoutTypes.withConnectionString;

            case ELoginType.azureOAuth:
                return ELayoutTypes.withAzureOAuth;

            case ELoginType.mqtt:
                return ELayoutTypes.withMQTT;

            default:
                return null;
        }
    };

    return (
        <LayoutContext.Provider value={{ layoutType, changeLayoutType: setLayoutType }}>
            {children}
        </LayoutContext.Provider>
    );
};
