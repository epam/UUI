import React, { useEffect } from 'react';
import { TSkin, TDocsGenExportedType, PropDocPropsUnknown } from '../../types';
import { docBuilderGen } from '../docBuilderGen';
import { DocBuilder } from '../../DocBuilder';
import { IDocBuilderGenCtx, TDocConfig } from '../docBuilderGenTypes';
import { ThemeId } from '../../docItems';

interface IUseDocBuilderGenParams {
    config?: TDocConfig;
    skin: TSkin;
    docBuilderGenCtx: IDocBuilderGenCtx;
    theme: ThemeId;
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
        docBuilderGenCtx,
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
            docBuilderGen({ config, skin, docBuilderGenCtx, theme: params.theme }).then((docs) => {
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
    }, [config, skin, docBuilderGenCtx]);

    return {
        ...res,
    };
}
