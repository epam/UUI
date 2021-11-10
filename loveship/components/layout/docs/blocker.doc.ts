import { Blocker } from '../Blocker';
import { DocBuilder } from '@epam/uui-docs';
import { BlockerProps } from '@epam/uui-components';
import { RelativePanelContext } from '../../../docs';

const blockerDoc = new DocBuilder<BlockerProps>({ name: 'Blocker', component: Blocker })
    .prop('isEnabled', { examples: [{ value: true, isDefault: true }] })
    .prop('spacerHeight', { examples: [0, 24, 30, 36, 50, { value: 100, isDefault: true }, 200, 300] })
    .prop('hideSpinner', { examples:[true] })
    .withContexts(RelativePanelContext);

export = blockerDoc;