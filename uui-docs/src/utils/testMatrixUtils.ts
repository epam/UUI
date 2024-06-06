import { IComponentDocs, TComponentPreview, TNormalizedMatrix } from '../types';

export class TestMatrixUtils {
    static createTestMatrixFromArr(params: { matrixNorm: TNormalizedMatrix[], parentProps?: Record<string, unknown> }): Record<string, unknown>[] {
        const { matrixNorm } = params;
        return matrixNorm.reduce<Record<string, unknown>[]>((acc, matrixNormItem) => {
            const res = TestMatrixUtils.createTestMatrix({ matrixNorm: matrixNormItem });
            return acc.concat(res);
        }, []);
    }

    /**
     * It takes config with props values to iterate, and creates all possible combinations.
     * E.g.:
     * { p1: { values: [1, 2] }, p2: { values: ['a', 'b'] } }
     * -->
     * [{ p1: 1, p2: 'a' }, { p1: 1, p2: 'b' },{ p1: 2, p2: 'a' }, { p1: 2, p2: 'b' }]
     *
     * @param params.matrixConfig props config to be iterated
     * @param params.parentProps parent props which are part of current iteration
     */
    static createTestMatrix(params: { matrixNorm: TNormalizedMatrix, parentProps?: Record<string, unknown> }): Record<string, unknown>[] {
        const { matrixNorm, parentProps = {} } = params;
        const res: Record<string, unknown>[] = [];
        const names = Object.keys(matrixNorm);
        if (names.length) {
            const currentPropName = names[0];
            const { values: currentPropValues = [] } = matrixNorm[currentPropName];
            const { [currentPropName]: { condition }, ..._matrixNorm } = matrixNorm;
            const generateRest = (cv: { [key: string]: unknown }) => {
                const restNormalized = TestMatrixUtils.createTestMatrix({ matrixNorm: _matrixNorm, parentProps: { ...parentProps, ...cv } }) || [];
                if (restNormalized.length) {
                    restNormalized.forEach((rn) => res.push({ ...cv, ...rn }));
                } else {
                    res.push({ ...cv });
                }
            };
            const arr = condition ? currentPropValues.filter((v) => condition(parentProps, v)) : currentPropValues;
            if (arr.length > 0) {
                arr.forEach((v) => {
                    generateRest({ [currentPropName]: v });
                });
            } else {
                generateRest({});
            }
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
    ): TNormalizedMatrix[] {
        const { matrix, docs } = params;
        const resArr: TNormalizedMatrix[] = [];
        const matrixArr = Array.isArray(matrix) ? matrix : [matrix];

        matrixArr.forEach((_matrixItem) => {
            const res: TNormalizedMatrix = {};
            Object.keys(_matrixItem).forEach((name) => {
                const { values, examples, condition } = _matrixItem[name as keyof TProps];
                if (examples) {
                    // convert examples to values
                    const allExamplesMap = docs.getPropExamplesMap(name as keyof TProps);
                    if (examples === '*') {
                        res[name] = {
                            values: Object.values(allExamplesMap).map((e) => e.value),
                            condition,
                        };
                    } else {
                        const unknownExampleNames: string[] = [];
                        res[name] = {
                            values: examples.reduce<unknown[]>((acc, exampleName) => {
                                if (exampleName === undefined) {
                                    // special case, it means prop value is not defined
                                    acc.push(undefined);
                                } else {
                                    const ex = allExamplesMap[exampleName];
                                    if (!ex) {
                                        unknownExampleNames.push(exampleName);
                                    } else {
                                        acc.push(ex?.value);
                                    }
                                }
                                return acc;
                            }, []),
                            condition,
                        };
                        if (unknownExampleNames.length > 0) {
                            const notFound = unknownExampleNames.map((e) => `"${e}"`).join(',');
                            const available = Object.keys(allExamplesMap).map((e) => `"${e}"`).join(',');
                            const component = docs.name;
                            const err = `Unable to find examples with names: ${notFound}. Component="${component}". Available examples: ${available}`;
                            console.error(err);
                            throw new Error(err);
                        }
                    }
                } else {
                    res[name] = { values, condition };
                }
            });
            resArr.push(res);
        });

        return resArr;
    }
}
