import { IconButton, IconButtonProps } from '../IconButton';
import { DocBuilder } from '@epam/uui-docs';
import { onClickDoc, isDisabledDoc, iCanRedirectDoc, colorDoc, iconDoc, isInvalidDoc } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext, GridContext } from '../../../docs';

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton as React.ComponentClass<any> })
    .implements([onClickDoc, isDisabledDoc, isInvalidDoc, iCanRedirectDoc, colorDoc, iconDoc] as any)
    .withContexts(DefaultContext, FormContext, GridContext);

export = IconButtonDoc;