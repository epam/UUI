import React, { useEffect } from 'react';
import { TSkin, TDocsGenExportedType, TTypeRef, TType } from '../../types';
import { docBuilderGen } from '../docBuilderGen';
import { DocBuilder } from '../../DocBuilder';
import { TDocConfig } from '../../typesDocConfig';

interface IUseDocBuilderGenParams {
    config?: TDocConfig;
    skin: TSkin;
    loadDocsGenType: (typeRef: TTypeRef) => Promise<{ content: TType }>
}
interface IUseDocBuilderGenReturn {
    docs?: DocBuilder<any>,
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
            docBuilderGen({ config, skin, loadDocsGenType }).then((docs) => {
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
