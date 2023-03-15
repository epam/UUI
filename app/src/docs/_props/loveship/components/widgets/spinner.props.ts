import { DocBuilder } from '@epam/uui-docs';
import { SpinnerProps } from '@epam/uui-components';
import { Spinner } from '@epam/loveship';
import { FormContext, DefaultContext, ResizableContext } from '../../docs';

const spinnerDoc = new DocBuilder<SpinnerProps>({ name: 'Spinner', component: Spinner })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default spinnerDoc;
