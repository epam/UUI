import React from 'react';
import css from './colorRectangle.module.scss';
import { LabeledInput, Panel, Tag, Text, Tooltip } from '@epam/uui';
import { hexToRgb, normalizeColor } from '../../utils/colorUtils';

export function ColorRectangle(props: { color: string, hex: string }) {
    const style = {
        backgroundColor: `${props.color}`,
    };
    const hexNorm = normalizeColor(props.hex);

    const rgb = hexToRgb(hexNorm) || 'n/a';
    const rgbPc = hexToRgb(hexNorm, true) || 'n/a';
    const tooltipContent = (
        <Text>
            <LabeledInput label="rgb: " labelPosition="left">
                <span style={ { whiteSpace: 'nowrap' } }>
                    {`${rgb} `}
                </span>
            </LabeledInput>
            <LabeledInput label="rgb(%): " labelPosition="left">
                <span>
                    {`${rgbPc} `}
                </span>
            </LabeledInput>
        </Text>
    );
    const tag = <Tag color="neutral" caption={ hexNorm || '<empty>' } size="18" fill="outline" cx={ css.label } />;
    return (
        <Panel style={ style } cx={ [css.root] } shadow={ true }>
            &nbsp;
            <Tooltip content={ tooltipContent } closeOnMouseLeave="boundary" color="neutral">
                {tag}
            </Tooltip>
        </Panel>
    );
}
