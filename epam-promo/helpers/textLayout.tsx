import * as css from '../assets/styles/text-layout.scss';
import { ControlSize } from '../components';

export interface TextSettings {
    lineHeight?: '12' | '18' | '24' | '30';
    fontSize?: '10' | '12' | '14' | '16' | '18' | '24';
}

const defaultTextSettings  = {
    18: { lineHeight: 12, fontSize: 10 },
    24: { lineHeight: 18, fontSize: 12 },
    30: { lineHeight: 18, fontSize: 14 },
    36: { lineHeight: 24, fontSize: 14 },
    42: { lineHeight: 24, fontSize: 16 },
    48: { lineHeight: 24, fontSize: 18 },
    60: { lineHeight: 30, fontSize: 24 },
};

export function getTextClasses(props: TextSettings & { size: '60' | '42' | ControlSize | '18' }, border: boolean) {

    if (props.size === 'none') {
        return [
            css['line-height-' + props.lineHeight],
            css['font-size-' + props.fontSize],
        ];
    }

    const setting = {
        size: props.size,
        lineHeight: props.lineHeight || defaultTextSettings[props.size].lineHeight,
        fontSize: props.fontSize || defaultTextSettings[props.size].fontSize,
    };

    const vPadding = (+setting.size - +setting.lineHeight - (border ? 2 : 0)) / 2;

    return [
        css['line-height-' + setting.lineHeight],
        css['font-size-' + setting.fontSize],
        css['v-padding-' + vPadding],
    ];
}
