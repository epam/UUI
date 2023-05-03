import { IconButton, IconButtonProps } from '@epam/loveship';
import { DocBuilder } from '@epam/uui-docs';
import {
    onClickDoc, isDisabledDoc, iCanRedirectDoc, colorDoc, iconDoc, isInvalidDoc, DefaultContext, FormContext,
} from '../../docs';

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton })
    .implements([
        onClickDoc, isDisabledDoc, isInvalidDoc, iCanRedirectDoc, colorDoc, iconDoc,
    ])
    .withContexts(DefaultContext, FormContext);

export default IconButtonDoc;
