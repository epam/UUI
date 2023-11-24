import React, { useEffect } from 'react';
import { IComponentDocs, TDocConfig, TSkin, TDocsGenExportedType } from '@epam/uui-docs';
import { docBuilderGen } from '../docBuilderGen';

interface IUseDocBuilderGenParams {
    config?: TDocConfig;
    skin: TSkin;
}
interface IUseDocBuilderGenReturn {
    docs?: IComponentDocs<any>,
    isLoaded: boolean
    isGenerated?: boolean;
    generatedFromType?: TDocsGenExportedType;
}

export function useDocBuilderGen(params: IUseDocBuilderGenParams): IUseDocBuilderGenReturn {
    const {
        skin,
        config,
    } = params;

    const [res, setRes] = React.useState<{
        isLoaded: boolean;
        isGenerated?: boolean;
        generatedFromType?: TDocsGenExportedType;
        docs?: IComponentDocs<any>;
    }>({ isLoaded: false });
    useEffect(() => {
        setRes({ isLoaded: false });
        if (config) {
            const generatedFromType = config.bySkin[skin]?.type;
            docBuilderGen({ config, skin }).then((docs) => {
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
    }, [config, skin]);

    return {
        ...res,
    };
}
