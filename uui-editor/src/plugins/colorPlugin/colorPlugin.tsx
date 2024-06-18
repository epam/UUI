import { PlatePlugin, isText } from '@udecode/plate-common';
import { createFontColorPlugin } from '@udecode/plate-font';

import { ColorPluginOptions, ColorValueHex } from './types';
import { defaultColorsConfig } from './constants';
import { ColorButton } from './ColorBar';
import { normaizeColoredText } from '../../migrations';

export const colorPlugin = (...colors: ColorValueHex[]): PlatePlugin => createFontColorPlugin({
    options: {
        floatingBarButton: ColorButton,
        colors: !!colors.length ? colors : defaultColorsConfig,
    } as ColorPluginOptions,
    // move to common function / plugin
    withOverrides: (editor) => {
        const { normalizeNode } = editor;

        editor.normalizeNode = (entry) => {
            const [node] = entry;

            if (isText(node)) {
                normaizeColoredText(editor, entry);
            }

            normalizeNode(entry);
        };

        return editor;
    },
});
