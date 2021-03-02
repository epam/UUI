import { Badge, allFillStyles, BadgeMods } from '../../../components/index';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { FormContext, GridContext, ResizableContext, DefaultContext } from '../../../docs/index';
import { fontDoc, iconDoc, iconOptionsDoc, colorDoc } from '../../../docs/index';
import { allBorderStyles } from "../../../components/types";

const badgeDoc = new DocBuilder<ButtonProps & BadgeMods>({ name: 'Badge', component: Badge })
    .implements([fontDoc, colorDoc, iconDoc, iconOptionsDoc] as any)
    .prop('caption', { examples: [
        { value: 'Badge', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('fill', { examples: allFillStyles.filter(fill => fill !== 'light'), defaultValue: 'solid' })
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('size', { examples : ['12', '18'], defaultValue: '18' })
    .withContexts(DefaultContext, FormContext, ResizableContext,  GridContext);

export = badgeDoc;