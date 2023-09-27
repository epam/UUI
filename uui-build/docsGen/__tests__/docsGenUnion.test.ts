import { generateDocs } from './utils/test-utils';

describe('docsGen:union', () => {
    test('should convert union of simple types', () => {
        const input = `
            export type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    TUnionTest: {
                        kind: 264,
                        typeRef: 'test/test.tsx:TUnionTest',
                        typeValue: {
                            print: [
                                "type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;",
                            ],
                            raw: "false | true | 'one' | 'two' | 'three' | 'four'",
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:TUnionTest': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TUnionTest',
                        nameFull: 'TUnionTest',
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
            byModule: {
                '@epam/test-module': {
                    TTest: {
                        kind: 264,
                        props: [
                            {
                                from: 'test/test.tsx:N1',
                                name: 'sameProp',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 1,
                            },
                            {
                                from: 'test/test.tsx:N1',
                                name: 'n1Prop',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 2,
                            },
                            {
                                from: 'test/test.tsx:N2',
                                name: 'sameProp',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 3,
                            },
                            {
                                from: 'test/test.tsx:N2',
                                name: 'n2Prop',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 4,
                            },
                        ],
                        propsFromUnion: true,
                        typeRef: 'test/test.tsx:TTest',
                        typeValue: {
                            print: [
                                'type TTest = N1 | N2;',
                            ],
                            raw: 'N1 | N2',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:N1': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'N1',
                        nameFull: 'N1',
                    },
                },
                'test/test.tsx:N2': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'N2',
                        nameFull: 'N2',
                    },
                },
                'test/test.tsx:TTest': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TTest',
                        nameFull: 'TTest',
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
            byModule: {
                '@epam/test-module': {
                    TTest: {
                        kind: 264,
                        props: [
                            {
                                name: 'sameProp',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 3,
                            },
                            {
                                name: 'n1Prop',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 2,
                            },
                            {
                                name: 'n2Prop',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 4,
                            },
                        ],
                        propsFromUnion: true,
                        typeRef: 'test/test.tsx:TTest',
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
            },
            references: {
                'test/test.tsx:TTest': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TTest',
                        nameFull: 'TTest',
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
            byModule: {
                '@epam/test-module': {
                    TTest: {
                        kind: 264,
                        typeRef: 'test/test.tsx:TTest',
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
            },
            references: {
                'test/test.tsx:TTest': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TTest',
                        nameFull: 'TTest',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
