import { normalizeDocConfig, TDocConfig, TSkin } from '../types';
import { TDocsGenExportedType } from '../../../apiReference/types';
import { IComponentDocs } from '@epam/uui-docs';
import React, { useEffect } from 'react';
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
            const _config = normalizeDocConfig(config);
            const generatedFromType = _config.bySkin[skin]?.type;
            docBuilderGen({ config: _config, skin }).then((docs) => {
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
