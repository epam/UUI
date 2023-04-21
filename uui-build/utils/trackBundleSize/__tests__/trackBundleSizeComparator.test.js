const { compareBundleSizes } = require('../trackBundleSizeComparator.js');

const TestData = {
    baseLineSizes: { testApp1: 100, testApp2: 200 },
    newSizes: { testApp1: 120, testApp2: 210 },
};

describe('trackBundleSizeComparator', () => {
    it('should create comparison result report', () => {
        const result = compareBundleSizes({ baseLineSizes: TestData.baseLineSizes, newSizes: TestData.newSizes });
        expect(result).toMatchSnapshot();
    });
});
