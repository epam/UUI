import { DocBuilder } from '@epam/uui-docs';
import { SpinnerProps } from '@epam/uui-components';
import { Spinner, SpinnerMods } from '../Spinner';
import { FormContext, DefaultContext, ResizableContext, GridContext } from '../../../docs';
import { colorDoc } from '../../../docs';

const spinnerDoc = new DocBuilder<SpinnerProps & SpinnerMods>({ name: 'Spinner', component: Spinner })
    .implements([colorDoc] as any)
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);

export = spinnerDoc;
