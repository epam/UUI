import { HeaderButton } from './HeaderBar';

import {
    ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6, createHeadingPlugin,
} from '@udecode/plate-heading';
import { AnyObject, PlatePlugin } from '@udecode/plate-common';
import { HEADER_TYPE_H1, HEADER_TYPE_H2, HEADER_TYPE_H3, HEADER_TYPE_H4, HEADER_TYPE_H5, HEADER_TYPE_H6, HeaderType, defaultHeaders } from './constants';
import { HeaderPluginOptions } from './types';

export const headerPlugin = (...headerTypes: HeaderType[]): PlatePlugin => {
    /** TODO: improve types of header plugin options, AnyObject seems weird */
    return createHeadingPlugin<AnyObject>({
        overrideByKey: {
            [ELEMENT_H1]: { type: HEADER_TYPE_H1 },
            [ELEMENT_H2]: { type: HEADER_TYPE_H2 },
            [ELEMENT_H3]: { type: HEADER_TYPE_H3 },
            [ELEMENT_H4]: { type: HEADER_TYPE_H4 },
            [ELEMENT_H5]: { type: HEADER_TYPE_H5 },
            [ELEMENT_H6]: { type: HEADER_TYPE_H6 },
        },
        options: {
            bottomBarButton: HeaderButton,
            headers: !!headerTypes.length ? headerTypes : defaultHeaders,
        } as HeaderPluginOptions,
    });
};
