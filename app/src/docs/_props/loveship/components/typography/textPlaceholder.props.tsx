import { DocBuilder } from '@epam/uui-docs';
import { TextPlaceholder } from '@epam/loveship';
import { TextPlaceholderProps } from '@epam/uui';
import { DefaultContext, ResizableContext, FormContext } from '../../docs';

const textPlaceholderDoc = new DocBuilder<TextPlaceholderProps>({ name: 'TextPlaceholder', component: TextPlaceholder })
    .prop('wordsCount', {
        examples: [
            2, 3, 4, 5, 6, 12, 150,
        ],
    })
    .prop('isNotAnimated', { examples: [true, false] })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default textPlaceholderDoc;
