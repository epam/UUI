import { testComponentScreenshot, TTheme } from './utils/e2eTestUtils';

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
