import { testComponentScreenshot } from './utils/e2eTestUtils';
import { TTheme } from './fixtures/types';

const VIEWPORTS = {
    Small_250: {
        height: 500,
        width: 250,
    },
};

for (let i = 0; i < 100; i++) {
    const namespace = String(i);
    /*    testComponentScreenshot({
        namespace,
        componentId: 'accordion',
        matrix: {
            isSkin: [true],
            theme: [TTheme.promo],
            previewId: ['expanded', 'collapsed'],
        },
    }); */

    /*    testComponentScreenshot({
        namespace,
        componentId: 'avatar',
        viewport: VIEWPORTS.Small_250,
        matrix: {
            isSkin: [true],
            theme: [TTheme.promo],
            previewId: ['default'],
        },
    }); */

    testComponentScreenshot({
        namespace,
        componentId: 'badge',
        viewport: VIEWPORTS.Small_250,
        matrix: {
            isSkin: [true],
            theme: [TTheme.promo],
            previewId: ['default'],
        },
    });
}
