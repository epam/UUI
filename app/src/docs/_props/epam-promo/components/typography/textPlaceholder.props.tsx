import { DocBuilder } from '@epam/uui-docs';
import { TextPlaceholder } from '@epam/promo';
import { TextPlaceholderProps } from '@epam/uui';
import { DefaultContext, FormContext } from '../../docs';

const textPlaceholderDoc = new DocBuilder<TextPlaceholderProps>({ name: 'TextPlaceholder', component: TextPlaceholder })
    .prop('wordsCount', { examples: [2, 3, 4, 5, 6, 12, 150] })
    .prop('isNotAnimated', { examples: [true, false] })
    .withContexts(DefaultContext, FormContext);

export default textPlaceholderDoc;
