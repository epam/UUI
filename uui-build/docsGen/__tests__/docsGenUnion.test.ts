import { generateDocs } from './utils/test-utils';

describe('docsGen:union', () => {
    test('should convert union of simple types', () => {
        const input = `
            export type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;
        `;
        const output = {
            '@epam/test-module': {
                TUnionTest: {
                    kind: 'TypeAliasDeclaration',
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TUnionTest',
                            nameFull: 'TUnionTest',
                        },
                    },
                    typeValue: {
                        print: [
                            "type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;",
                        ],
                        raw: "false | true | 'one' | 'two' | 'three' | 'four'",
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
    test('should convert union of two object types', () => {
        const input = `
            type N1 = ({ p1First: 'single', p1Second: string });
            type N2 = ({ p2First: 'single', p2Second: string });
            export type TTest = N1 | N2;
        `;
        const output = {
            '@epam/test-module': {
                TTest: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'N1',
                                    nameFull: 'N1',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'p1First',
                            required: true,
                            typeValue: {
                                raw: "'single'",
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'N1',
                                    nameFull: 'N1',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'p1Second',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'N2',
                                    nameFull: 'N2',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'p2First',
                            required: true,
                            typeValue: {
                                raw: "'single'",
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'N2',
                                    nameFull: 'N2',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'p2Second',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TTest',
                            nameFull: 'TTest',
                        },
                    },
                    typeValue: {
                        print: [
                            'type TTest = N1 | N2;',
                        ],
                        raw: 'N1 | N2',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
