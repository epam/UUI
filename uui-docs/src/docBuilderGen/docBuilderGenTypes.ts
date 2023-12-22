import { PropDoc, TDocContext, TDocsGenExportedType, TSkin } from '../types';
import { DocBuilder } from '../DocBuilder';
import { TTypeProp } from '../docsGen/sharedTypes';
import * as React from 'react';
import { UuiContexts } from '@epam/uui-core';

export type TPropDocBuilderParams = { docs: DocBuilder<any>, prop: TTypeProp, skin: TSkin, uuiCtx: Pick<UuiContexts, 'uuiNotifications'> };
export type TPropDocBuilder = (params: TPropDocBuilderParams) => (Partial<PropDoc<any, any>> | undefined);

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
            doc?: (doc: DocBuilder<any>) => void
        }
    };
    /**
     * Override doc for all listed skins. Skin-specific override has higher priority.
     * @param doc
     */
    doc?: (doc: DocBuilder<any>) => void;
};
