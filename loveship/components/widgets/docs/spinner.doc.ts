import { DocBuilder } from '@epam/uui-docs';
import { SpinnerProps } from '@epam/uui-components';
import { Spinner, SpinnerMods } from '../Spinner';
import { FormContext, DefaultContext, ResizableContext } from '../../../docs';
import { colorDoc } from '../../../docs';

const spinnerDoc = new DocBuilder<SpinnerProps & SpinnerMods>({ name: 'Spinner', component: Spinner })
    .implements([colorDoc])
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default spinnerDoc;
