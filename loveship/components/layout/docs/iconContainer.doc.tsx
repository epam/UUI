import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ControlIconProps } from '@epam/uui-components';
import { DefaultContext, FormContext, GridContext, onClickDoc, ResizableContext, iconDoc } from '../../../docs';
import { IconContainer, IconContainerMods } from "../IconContainer";
import { allEpamAdditionalColors, allEpamGrayscaleColors, allEpamPrimaryColors } from "../../types";
import { colors } from "../../../helpers/colorMap";
import React from "react";

const iconContainerDoc = new DocBuilder<ControlIconProps & IconContainerMods>({ name: 'IconContainer', component: IconContainer as any })
    .implements([onClickDoc, iconDoc] as any)
    .prop('color', {
        examples: [...allEpamPrimaryColors, ...allEpamAdditionalColors, ...allEpamGrayscaleColors],
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />,
    })
    .prop('size', { examples: [12, 18, 24, 30, 36, 42, 48, 60] })
    .prop('style', { examples: [
            { name: 'fill: night600', value: { fill: '#6C6F80' } },
            { name: 'fill: sky', value: { fill: '#30B6DD' } },
            { name: 'fill: fire', value: { fill: '#FF4E33' } },
            { name: 'transform: skew(30deg, 20deg)', value: { transform: 'skew(30deg, 20deg)' } },
        ] })
    .prop('flipY', { examples: [true, false], defaultValue: null })
    .prop('rotate', { examples: ['0', '90cw', '180', '90ccw'], defaultValue: null })
    .withContexts(DefaultContext, FormContext, GridContext);

export = iconContainerDoc;