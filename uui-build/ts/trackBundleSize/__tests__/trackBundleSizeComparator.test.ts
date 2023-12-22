import { compareBaseLines } from '../utils/baseLineComparator';

const header = { version: 'test', timestamp: 'test' };
const TestData = {
    currentBaseLine: { ...header, sizes: { testApp1: { js: 70, css: 30 }, testApp2: { js: 100, css: 100 } } },
    newBaseLine: { ...header, sizes: { testApp1: { js: 80, css: 40 }, testApp2: { js: 100, css: 110 } } },
};

describe('trackBundleSizeComparator', () => {
    it('should create comparison result report', () => {
        const result = compareBaseLines({ currentBaseLine: TestData.currentBaseLine, newBaseLine: TestData.newBaseLine });
        expect(result).toMatchSnapshot();
    });
});
