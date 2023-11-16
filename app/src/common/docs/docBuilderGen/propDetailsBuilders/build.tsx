import { buildCommonDetails } from './buildCommonDetails';
import { buildByFromRef } from './buildByFromRef';
import { buildByAlias } from './buildByAlias';
import { buildByGenericType } from './buildByGenericType';
import { buildByPropName } from './buildByPropName';
import { buildByRawType } from './buildByRawType';
import { TPropDocBuilder } from '../docBuilderGenTypes';

export const buildPropDetails: TPropDocBuilder = (params) => {
    const { prop, docs, skin } = params;
    const common = buildCommonDetails({ docs, prop, skin });
    const singlePropDetails = buildSinglePropDetails({ docs, prop, skin });
    if (singlePropDetails) {
        return {
            ...common,
            ...singlePropDetails,
        };
    }
};

export const buildPropFallbackDetails: TPropDocBuilder = (params) => {
    const { prop, docs, skin } = params;

    return {
        ...buildCommonDetails({ docs, prop, skin }),
        examples: [],
    };
};

const buildSinglePropDetails: TPropDocBuilder = (params) => {
    const byFromRef = buildByFromRef(params);
    if (byFromRef) {
        return byFromRef;
    }
    const byAliasType = buildByAlias(params);
    if (byAliasType) {
        return byAliasType;
    }
    const byGenericType = buildByGenericType(params);
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
