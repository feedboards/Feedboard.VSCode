import { createContext, useContext, useEffect, useState } from 'react';
import { IContextProviderProps, ILayoutContext, ELayoutTypes, useGlobal } from '..';
import { ELoginType } from '../../../../../common/types';

const LayoutContext = createContext<ILayoutContext | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }

    return context;
};

export const LayoutProvider: React.FC<IContextProviderProps> = ({ children }) => {
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
        if (loginType === ELoginType.connectionString) {
            return ELayoutTypes.withConnectionString;
        } else if (loginType === ELoginType.oAuth) {
            return ELayoutTypes.withAzureOAuth;
        }

        return null;
    };

    return (
        <LayoutContext.Provider value={{ layoutType, changeLayoutType: setLayoutType }}>
            {children}
        </LayoutContext.Provider>
    );
};
