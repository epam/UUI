import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ControlIconProps } from '@epam/uui-components';
import { DefaultContext, FormContext, onClickDoc, iconDoc } from '../../../docs';
import { IconContainer, IconContainerMods } from "../IconContainer";
import * as React from "react";
import { allEpamAdditionalColors, allEpamGrayscaleColors } from "../../types";
import { colors } from "../../../helpers/colorMap";

const iconContainerDoc = new DocBuilder<ControlIconProps & IconContainerMods>({ name: 'IconContainer', component: IconContainer as any })
    .implements([onClickDoc, iconDoc] as any)
    .prop('color', {
        examples: [...allEpamAdditionalColors, ...allEpamGrayscaleColors],
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />,
    })
    .prop('style', { examples: [
            { name: 'fill: blue', value: { fill: '#008ACE' } },
            { name: 'fill: green', value: { fill: '#88CC00' } },
            { name: 'transform: skew(30deg, 20deg)', value: { transform: 'skew(30deg, 20deg)' } },
        ] })
    .prop('size', { examples: [12, 18, 24, 30, 36, 42, 48, 60] })
    .prop('flipY', { examples: [true, false], defaultValue: null })
    .prop('rotate', { examples: ['0', '90cw', '180', '90ccw'], defaultValue: null })
    .withContexts(DefaultContext, FormContext);

export = iconContainerDoc;