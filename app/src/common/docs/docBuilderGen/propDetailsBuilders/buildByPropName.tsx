import { TPropDocBuilder } from '../docBuilderGenTypes';

export const buildByPropName: TPropDocBuilder = (params) => {
    const { prop } = params;
    switch (prop.name) {
        case 'captionCX': {
            return { renderEditor: 'CssClassEditor', examples: [] };
        }
        case 'rawProps': {
            return { renderEditor: 'JsonEditor', examples: [] };
        }
        case 'key': {
            return { renderEditor: 'StringEditor', examples: [] };
        }
        case 'portalTarget':
        case 'boundaryElement': {
            return { examples: [{ value: document.body, name: 'document.body' }] };
        }
        case 'logoLink':
        case 'customerLogoLink': {
            return { renderEditor: 'LinkEditor', examples: [] };
        }
    }
};
