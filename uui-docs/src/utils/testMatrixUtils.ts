import { IComponentDocs, TComponentPreview } from '../types';

export class TestMatrixUtils {
    /**
     * It takes config with props values to iterate, and creates all possible combinations.
     * E.g.:
     * { p1: [1, 2], p2:['a', 'b'] }
     * -->
     * [{ p1: 1, p2: 'a' }, { p1: 1, p2: 'b' },{ p1: 2, p2: 'a' }, { p1: 2, p2: 'b' }]
     *
     * @param matrixConfig
     */
    static createTestMatrix(matrixConfig: Record<string, unknown[]>): Record<string, unknown>[] {
        const res: Record<string, unknown>[] = [];
        const names = Object.keys(matrixConfig);
        if (names.length) {
            const n = names[0];
            const values = matrixConfig[n] || [];
            values.forEach((v) => {
                const { [n]: _, ...rest } = matrixConfig;
                const restNormalized = TestMatrixUtils.createTestMatrix(rest) || [];
                if (restNormalized.length) {
                    restNormalized.forEach((rn) => {
                        res.push({
                            [n]: v,
                            ...rn,
                        });
                    });
                } else {
                    res.push({
                        [n]: v,
                    });
                }
            });
        }
        return res;
    }

    /**
     * Returns map of prop names to array of prop values.
     * I.e. "examples" array gets converted to "values" array.
     * @param params
     */
    static normalizePreviewPropsMatrix<TProps>(
        params: {
            matrix: TComponentPreview<TProps>['matrix'],
            docs: IComponentDocs<TProps>
        },
    ): Record<string, unknown[]> {
        const { matrix, docs } = params;
        const res: Record<string, unknown[]> = {};
        Object.keys(matrix).forEach((name) => {
            const { values, examples } = matrix[name as keyof TProps];
            if (examples) {
                // convert examples to values
                const allExamplesMap = docs.getPropExamplesMap(name as keyof TProps);
                if (examples === '*') {
                    res[name] = Object.values(allExamplesMap).map((e) => e.value);
                } else {
                    res[name] = examples.map((exampleName) => allExamplesMap[exampleName]?.value);
                }
            } else {
                res[name] = values;
            }
        });
        return res;
    }
}
