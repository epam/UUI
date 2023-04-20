import { DocBuilder } from '@epam/uui-docs';
import { TextPlaceholder, TextPlaceholderProps } from '@epam/uui';
import { DefaultContext } from '../../docs';

const textPlaceholderDoc = new DocBuilder<TextPlaceholderProps>({ name: 'TextPlaceholder', component: TextPlaceholder })
    .prop('wordsCount', { examples: [2, 3, 4, 5, 6, 12, 150] })
    .prop('isNotAnimated', { examples: [true, false] })
    .withContexts(DefaultContext);

export default textPlaceholderDoc;
