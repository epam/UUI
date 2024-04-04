import { buildCommonDetails } from './buildCommonDetails';
import { buildByPropFromRef } from './buildByPropFromRef';
import { buildByTypeRef } from './buildByTypeRef';
import { buildByEditorType } from './buildByEditorType';
import { buildByPropName } from './buildByPropName';
import { buildByRawType } from './buildByRawType';
import { TPropDocBuilder } from '../docBuilderGenTypes';

export const buildPropDetails: TPropDocBuilder = (params) => {
    const { prop, docs, skin, docBuilderGenCtx } = params;
    const common = buildCommonDetails({ docs, prop, skin, docBuilderGenCtx });
    const singlePropDetails = buildSinglePropDetails({ docs, prop, skin, docBuilderGenCtx });
    if (singlePropDetails) {
        return {
            ...common,
            ...singlePropDetails,
        };
    }
};

export const buildPropFallbackDetails: TPropDocBuilder = (params) => {
    const { prop, docs, skin, docBuilderGenCtx } = params;

    return {
        ...buildCommonDetails({ docs, prop, skin, docBuilderGenCtx }),
        examples: [],
    };
};

const buildSinglePropDetails: TPropDocBuilder = (params) => {
    const byFromRef = buildByPropFromRef(params);
    if (byFromRef) {
        return byFromRef;
    }
    const byAliasType = buildByTypeRef(params);
    if (byAliasType) {
        return byAliasType;
    }
    const byGenericType = buildByEditorType(params);
    if (byGenericType) {
        return byGenericType;
    }
    const byRawType = buildByRawType(params);
    if (byRawType) {
        return byRawType;
    }
    const byPropName = buildByPropName(params);
    if (byPropName) {
        return byPropName;
    }
};
