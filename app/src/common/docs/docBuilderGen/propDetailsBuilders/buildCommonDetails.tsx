import { TPropDocBuilder } from '../docBuilderGenTypes';

export const buildCommonDetails: TPropDocBuilder = (params) => {
    const { prop } = params;
    const details: ReturnType<TPropDocBuilder> = {};
    const description = prop.comment?.raw?.join('\n').trim(); // TODO: need a better handling
    if (description) {
        details.description = description;
    }
    if (prop.required) {
        details.isRequired = true;
    }
    const tags = prop.comment?.tags;
    if (tags?.hasOwnProperty('@default')) {
        details.defaultValue = tags['@default'];
    }
    return details;
};
