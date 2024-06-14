import { PlatePlugin } from '@udecode/plate-common';
import { createFontColorPlugin } from '@udecode/plate-font';

import { ColorPluginOptions, ColorValueHex } from './types';
import { COLOR_PLUGIN_KEY } from './constants';
import { ColorButton } from './ColorBar';

export const colorPlugin = (...colors: ColorValueHex[]): PlatePlugin => createFontColorPlugin({
    inject: {
        props: {
            nodeKey: COLOR_PLUGIN_KEY,
            defaultNodeValue: 'black',
            transformClassName: (options) => {
                if (options.nodeValue.at(0) === '#') {
                    return options.nodeValue;
                } else {
                    return `uui-${options.nodeValue}`;
                }
            },
        },
    },
    options: {
        floatingBarButton: ColorButton,
        colors: !!colors.length ? colors : undefined,
    } as ColorPluginOptions,
});
