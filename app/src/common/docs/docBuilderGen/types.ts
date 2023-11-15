import * as React from 'react';
import { DocBuilder, PropDoc } from '@epam/uui-docs';
import { TDocsGenExportedType } from '../../apiReference/types';
import { TTypeProp } from '../../apiReference/sharedTypes';

export enum TSkin {
    UUI3_loveship = 'UUI3_loveship',
    UUI4_promo = 'UUI4_promo',
    UUI = 'UUI'
}

export type TDocConfig = TDocConfigShort | TDocConfigGeneric;
export type TDocConfigGeneric = {
    name: string;
    bySkin: {
        [key in TSkin]?: {
            type: TDocsGenExportedType,
            component: React.ComponentType<any> | any,
            doc?: TDocOverride
        }
    };
    doc?: TDocOverride;
};

export function normalizeDocConfig(c?: TDocConfig): TDocConfigGeneric | undefined {
    if (!c) {
        return undefined;
    }
    if (!isGenericFormat(c)) {
        const { name, doc, type, component } = c;
        return {
            name,
            bySkin: {
                [TSkin.UUI]: {
                    type,
                    component,
                    doc,
                },
            },
        };
    }
    return c;
}
export type TPropDocBuilder = (params: { docs: DocBuilder<any>, prop: TTypeProp, skin: TSkin }) => (Partial<PropDoc<any, any>> | undefined);

type TDocConfigShort = {
    name: string,
    type: TDocsGenExportedType,
    component: React.ComponentType<any>,
    doc?: TDocOverride
};

type TDocOverride<K = any> = (doc: DocBuilder<K>) => void;

function isGenericFormat(c: TDocConfig): c is TDocConfigGeneric {
    return !!(c as TDocConfigGeneric).bySkin;
}
