import { IconBase, PropDoc, TDocContext, TDocsGenExportedType, TSkin } from '../types';
import { DocBuilder, DocPreviewBuilder } from '../DocBuilder';
import { TOneOfItemType, TPropEditorType, TType, TTypeProp, TTypeRef } from '../docsGen/sharedTypes';
import * as React from 'react';
import { Icon, UuiContexts } from '@epam/uui-core';
import { IDemoApi } from '../demoApi';

export type TPropDocBuilderParams = {
    docs: DocBuilder<any>,
    prop: TTypeProp,
    skin: TSkin,
    docBuilderGenCtx: IDocBuilderGenCtx
};
export type TPropDocBuilder = (params: TPropDocBuilderParams) => (Partial<PropDoc<any, any>> | undefined);
export interface IDocBuilderGenCtx {
    /**
     * Currently, the "uui-docs" module is built using Rollup
     * and therefore can't use webpack-specific API (require.context)
     * to collect all icons from the epam-assets module. So it's a workaround.     *
     */
    getIconList: () => IconBase<Icon>[];
    uuiCtx: Pick<UuiContexts, 'uuiNotifications'>,
    demoApi: IDemoApi,
    loadDocsGenType: (typeRef: TTypeRef) => Promise<{ content: TType }>,
    propsOverride?: TPropEditorTypeOverride[TTypeRef];
}

export type TPropEditorTypeOverride = {
    [typeRef: TTypeRef]: {
        [propName: string]: {
            mode: 'replace' | 'add',
            editor: { type: TPropEditorType.oneOf, options: TOneOfItemType[] },
        }
    }
};

export type TDocConfig = {
    /**
     * The React component's tag name
     */
    name: string;
    /**
     * Contexts needed for this doc. The TDocContext.Default is used when no contexts are provided.
     */
    contexts?: TDocContext[];
    bySkin: {
        [key in TSkin]?: {
            /**
             * Identifier of the React component props Typescript type.
             */
            type: TDocsGenExportedType,
            /**
             * The actual React component
             */
            component: React.ComponentType<any> | any,
            /**
             * Override doc for this specific skin.
             * @param doc
             */
            doc?: (doc: DocBuilder<any>) => void,

            /**
             * Preview tab renders component
             */
            preview?: <TProps>(docPreview: DocPreviewBuilder<TProps>) => void;
        }
    };
    /**
     * Override doc for all listed skins. Skin-specific override has higher priority.
     * @param doc
     */
    doc?: (doc: DocBuilder<any>) => void;

    /**
     * Preview tab renders component
     */
    preview?: <TProps>(docPreview: DocPreviewBuilder<TProps>) => void;
};
