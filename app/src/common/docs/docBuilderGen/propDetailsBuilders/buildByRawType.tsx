import { TPropDocBuilder } from '../docBuilderGenTypes';

const BY_RAW_TYPE: Record<string, TPropDocBuilder> = {
    'React.CSSProperties': () => {
        return {
            examples: [
                { name: "{ border: '3px solid #500ff0' }", value: { border: '3px solid #500ff0' } },
                { name: "{ border: '3px solid #f5a111' }", value: { border: '3px solid #f5a111' } },
            ],
        };
    },
};

/**
 * Resolve the prop editor based on the property's "typeValue.raw" value.
 * See "public/docs/docsGenOutput/docsGenOutput.json" for details.
 */
export const buildByRawType: TPropDocBuilder = (params) => {
    const { prop } = params;
    const builder = BY_RAW_TYPE[prop.typeValue.raw];
    if (builder) {
        return builder(params);
    }
};
