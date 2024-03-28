import { TPropDocBuilder } from '../docBuilderGenTypes';
import { getRawPropsExamples, getReactRefExamples } from './shared/reusableExamples';

const BY_PROP_NAME: Record<string, TPropDocBuilder> = {
    captionCX: () => {
        return { editorType: 'CssClassEditor', examples: [] };
    },
    rawProps: () => {
        return { editorType: 'JsonEditor', examples: getRawPropsExamples() };
    },
    key: () => {
        return { editorType: 'StringEditor', examples: [] };
    },
    ref: (params) => {
        return { examples: getReactRefExamples({ name: 'ref', uuiCtx: params.docBuilderGenCtx.uuiCtx }) };
    },
    portalTarget: () => {
        return { examples: [{ value: document.body, name: 'document.body' }] };
    },
    boundaryElement: () => {
        return { examples: [{ value: document.body, name: 'document.body' }] };
    },
};

/**
 * Resolve the prop editor based on the property name only.
 * Should only be used in exceptional cases - please consider adding customization to the "*.doc.tsx" file first.
 */
export const buildByPropName: TPropDocBuilder = (params) => {
    const { prop } = params;
    const builder = BY_PROP_NAME[prop.name];
    if (builder) {
        return builder(params);
    }
};
