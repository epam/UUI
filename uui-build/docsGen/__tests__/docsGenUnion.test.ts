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
            type N1 = ({ sameProp: string, n1Prop: string });
            type N2 = ({ sameProp: string, n2Prop: string });
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
                            name: 'n1Prop',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '2',
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
                            name: 'n2Prop',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '4',
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
                            name: 'sameProp',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '1',
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
                            name: 'sameProp',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '3',
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

    test('should convert union of two anonymous object types', () => {
        const input = `
            export type TTest = ({ sameProp: string, n1Prop: string }) | ({ sameProp: string, n2Prop: string });
        `;
        const output = {
            '@epam/test-module': {
                TTest: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'n1Prop',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '2',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'n2Prop',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '4',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'sameProp',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '3',
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
                            'type TTest = ({',
                            '    sameProp: string;',
                            '    n1Prop: string;',
                            '}) | ({',
                            '    sameProp: string;',
                            '    n2Prop: string;',
                            '});',
                        ],
                        raw: '{ sameProp: string; n1Prop: string; } | { sameProp: string; n2Prop: string; }',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should not try to expand props if union contains an external type', () => {
        const input = `
            export type TTest = ({ a: string, b: string }) | HTMLElement;
        `;
        const output = {
            '@epam/test-module': {
                TTest: {
                    kind: 'TypeAliasDeclaration',
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TTest',
                            nameFull: 'TTest',
                        },
                    },
                    typeValue: {
                        print: [
                            'type TTest = ({',
                            '    a: string;',
                            '    b: string;',
                            '}) | HTMLElement;',
                        ],
                        raw: '{ a: string; b: string; } | HTMLElement',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
