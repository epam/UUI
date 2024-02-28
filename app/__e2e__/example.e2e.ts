import { testComponentScreenshot, TTheme } from './utils/e2eTestUtils';
import { items } from '../src/documents/structure';

console.log(items);

testComponentScreenshot({
    id: 'accordion',
    matrix: {
        isSkin: [true, false],
        theme: [TTheme.promo, TTheme.loveship],
        props: {
            isDisabled: { examples: ['true', 'false'] },
            value: { examples: ['true', 'false'] },
        },
    },
});
