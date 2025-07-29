import { TDocsGenExportedType } from '../../types/types';
import { TPropDocBuilder } from '../docBuilderGenTypes';
import { getReactNodeExamples } from './shared/reusableExamples';

const BY_RAW_TYPE: Record<string | TDocsGenExportedType, TPropDocBuilder> = {
    '@epam/uui-core:ClassValue': () => {
        return {
            editorType: 'CssClassEditor',
            examples: [],
        };
    },
    '@types/react:ReactNode': () => {
        return {
            examples: getReactNodeExamples(),
        };
    },
};

/**
 * Resolve the prop editor based on the property's "typeValueRef" value.
 * See "public/docs/docsGenOutput/docsGenOutput.json" for details.
 */
export const buildByTypeRef: TPropDocBuilder = (params) => {
    const { prop } = params;
    const builder = BY_RAW_TYPE[prop.typeValueRef];
    if (builder) {
        return builder(params);
    }
};
