import { TPropDocBuilder } from '../docBuilderGenTypes';

export const buildByPropName: TPropDocBuilder = (params) => {
    const { prop } = params;
    switch (prop.name) {
        case 'captionCX': {
            return { editorType: 'CssClassEditor', examples: [] };
        }
        case 'rawProps': {
            return { editorType: 'JsonEditor', examples: [] };
        }
        case 'key': {
            return { editorType: 'StringEditor', examples: [] };
        }
        case 'portalTarget':
        case 'boundaryElement': {
            return { examples: [{ value: document.body, name: 'document.body' }] };
        }
        case 'logoLink':
        case 'customerLogoLink': {
            return { editorType: 'LinkEditor', examples: [] };
        }
    }
};
