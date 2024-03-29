import React, { useEffect } from 'react';
import { TSkin, TDocsGenExportedType, PropDocPropsUnknown } from '../../types';
import { docBuilderGen } from '../docBuilderGen';
import { DocBuilder } from '../../DocBuilder';
import { TDocConfig } from '../docBuilderGenTypes';
import { TType, TTypeRef } from '../../docsGen/sharedTypes';
import { useUuiContext } from '@epam/uui-core';

interface IUseDocBuilderGenParams {
    config?: TDocConfig;
    skin: TSkin;
    loadDocsGenType: (typeRef: TTypeRef) => Promise<{ content: TType }>
}
interface IUseDocBuilderGenReturn {
    docs?: DocBuilder<PropDocPropsUnknown>,
    isLoaded: boolean
    isGenerated?: boolean;
    generatedFromType?: TDocsGenExportedType;
}

export function useDocBuilderGen(params: IUseDocBuilderGenParams): IUseDocBuilderGenReturn {
    const {
        skin,
        config,
        loadDocsGenType,
    } = params;

    const uuiCtx = useUuiContext();

    const [res, setRes] = React.useState<{
        isLoaded: boolean;
        isGenerated?: boolean;
        generatedFromType?: TDocsGenExportedType;
        docs?: DocBuilder<any>;
    }>({ isLoaded: false });
    useEffect(() => {
        setRes({ isLoaded: false });
        if (config) {
            const generatedFromType = config.bySkin[skin]?.type;
            docBuilderGen({ config, skin, loadDocsGenType, uuiCtx: { uuiNotifications: uuiCtx.uuiNotifications } }).then((docs) => {
                setRes({
                    isLoaded: true,
                    isGenerated: true,
                    generatedFromType,
                    docs,
                });
            });
        } else {
            setRes({
                isLoaded: true,
                docs: undefined,
            });
        }
    }, [config, skin, uuiCtx.uuiNotifications]);

    return {
        ...res,
    };
}
