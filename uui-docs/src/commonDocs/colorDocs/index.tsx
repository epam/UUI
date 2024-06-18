import { IPropDocEditor, TSkin } from '../../types';
import { COLOR_MAP } from './colorMap';
import * as React from 'react';
import { DocBuilder } from '../../DocBuilder';
import { ColorPicker } from '../../components/colorPicker/ColorPicker';

const COLOR_DOC_BY_SKIN = {
    [TSkin.UUI]: getColorDoc(COLOR_MAP),
    [TSkin.Electric]: getColorDoc(COLOR_MAP),
    [TSkin.Loveship]: getColorDoc(COLOR_MAP),
    [TSkin.Promo]: getColorDoc(COLOR_MAP),
};

export function getColorDocBySkin(skin: TSkin) {
    return COLOR_DOC_BY_SKIN[skin];
}

function getColorDoc(colorMap?: TColorMap) {
    return new DocBuilder<{ color: string }>({ name: 'Color' }).prop('color', {
        editorType: getColorPickerComponent(colorMap),
    });
}

type TColorMap = {
    [colorName: string]: string
};
export function getColorPickerComponent(colorMap?: TColorMap) {
    return function UuiColorPicker(props: IPropDocEditor<string>) {
        const { value, onValueChange } = props;
        const examples = props.examples?.map((ex) => {
            const res: { value: string; hex?: string; } = { value: ex.value };
            if (colorMap) {
                if (!colorMap.hasOwnProperty(ex.value)) {
                    // eslint-disable-next-line no-console
                    console.debug(`Color map doesn't contain color value=${ex.value}`, colorMap);
                }
                res.hex = colorMap[ex.value as keyof typeof colorMap];
            }
            return res;
        });
        const editable = { value, onValueChange };
        return (
            <ColorPicker colors={ examples } { ...editable } />
        );
    };
}
