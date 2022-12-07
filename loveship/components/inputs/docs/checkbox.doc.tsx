import React from "react";
import { ColorPicker, DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { CheckboxProps } from '@epam/uui-components';
import { Checkbox, CheckboxMods } from '../Checkbox';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable, DefaultContext, FormContext, TableContext } from '../../../docs';
import { allEpamAdditionalColors, allEpamPrimaryColors } from "../../types";
import { colors } from "../../../helpers/colorMap";

const CheckboxDoc = new DocBuilder<CheckboxProps & CheckboxMods>({ name: 'Checkbox', component: Checkbox })
    .implements([isDisabledDoc, isReadonlyDoc, isInvalidDoc, iHasLabelDoc, iEditable])
    .prop('color', { renderEditor: (editable, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: [...allEpamPrimaryColors, ...allEpamAdditionalColors, 'night600'] })
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'], defaultValue: '18' })
    .prop('theme', { examples: (['light', 'dark']), defaultValue: 'light' })
    .prop('indeterminate', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext, TableContext);

export default CheckboxDoc;
