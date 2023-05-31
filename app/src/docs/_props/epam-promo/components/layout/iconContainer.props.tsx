import React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { DefaultContext, FormContext, onClickDoc, iconDoc } from '../../docs';
import { ControlIconProps } from '@epam/uui-components';
import { IconContainer, IconContainerMods } from '@epam/promo';
import { allIconColors } from '@epam/promo';
import { colors } from '../../docs/helpers/colorMap';

const iconContainerDoc = new DocBuilder<ControlIconProps & IconContainerMods>({ name: 'IconContainer', component: IconContainer })
    .implements([onClickDoc, iconDoc])
    .prop('color', {
        examples: [...allIconColors],
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
    })
    .prop('size', {
        examples: [
            12, 18, 24, 30, 36, 42, 48, 60,
        ],
    })
    .prop('style', {
        examples: [
            { name: 'fill: blue', value: { fill: '#008ACE' } }, { name: 'fill: green', value: { fill: '#88CC00' } }, { name: 'transform: skew(30deg, 20deg)', value: { transform: 'skew(30deg, 20deg)' } },
        ],
    })
    .prop('flipY', { examples: [true, false], defaultValue: null })
    .prop('rotate', {
        examples: [
            '0', '90cw', '180', '90ccw',
        ],
        defaultValue: null,
    })
    .withContexts(DefaultContext, FormContext);

export default iconContainerDoc;
