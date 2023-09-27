import { generateDocs } from './utils/test-utils';

describe('docsGen:intersection', () => {
    test('should convert intersection', () => {
        const input = `
            type TIntersectionMemberA = {
                a1: number;
                a2: string;
            }
            interface IIntersectionMemberB {
                b1: number;
                b2: string;
            }
            export type TIntersection = TIntersectionMemberA & IIntersectionMemberB;
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    TIntersection: {
                        kind: 264,
                        props: [
                            {
                                from: 'test/test.tsx:TIntersectionMemberA',
                                name: 'a1',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 1,
                            },
                            {
                                from: 'test/test.tsx:TIntersectionMemberA',
                                name: 'a2',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 2,
                            },
                            {
                                from: 'test/test.tsx:IIntersectionMemberB',
                                name: 'b1',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 3,
                            },
                            {
                                from: 'test/test.tsx:IIntersectionMemberB',
                                name: 'b2',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 4,
                            },
                        ],
                        typeRef: 'test/test.tsx:TIntersection',
                        typeValue: {
                            print: [
                                'type TIntersection = TIntersectionMemberA & IIntersectionMemberB;',
                            ],
                            raw: 'TIntersection',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:IIntersectionMemberB': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'IIntersectionMemberB',
                        nameFull: 'IIntersectionMemberB',
                    },
                },
                'test/test.tsx:TIntersection': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TIntersection',
                        nameFull: 'TIntersection',
                    },
                },
                'test/test.tsx:TIntersectionMemberA': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TIntersectionMemberA',
                        nameFull: 'TIntersectionMemberA',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
    test('should convert top level type with Omit', () => {
        const input = `
            interface TFirst {
                f1: number;
                f2: number;
            }
            export type TIntersection = Omit<TFirst, 'f2'>;
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    TIntersection: {
                        kind: 264,
                        props: [
                            {
                                from: 'test/test.tsx:TFirst',
                                name: 'f1',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 1,
                            },
                        ],
                        typeRef: 'test/test.tsx:TIntersection',
                        typeValue: {
                            print: [
                                "type TIntersection = Omit<TFirst, 'f2'>;",
                            ],
                            raw: 'TIntersection',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:TFirst': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TFirst',
                        nameFull: 'TFirst',
                    },
                },
                'test/test.tsx:TIntersection': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TIntersection',
                        nameFull: 'TIntersection',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
    test('should convert type intersection with Omit', () => {
        const input = `
            interface IFirstPart1 {
                f1: number;
                f2: number;
            }
            interface IFirstPart2 {
                f3: number;
                f4: number;
            }
            type TFirst = IFirstPart1 & IFirstPart2;
            type TSecond = {
                s1: number;
                s2: number;
            }
            export type TIntersection = Omit<TFirst, 'f2'> & TSecond;
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    TIntersection: {
                        kind: 264,
                        props: [
                            {
                                from: 'test/test.tsx:IFirstPart1',
                                name: 'f1',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 1,
                            },
                            {
                                from: 'test/test.tsx:IFirstPart2',
                                name: 'f3',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 2,
                            },
                            {
                                from: 'test/test.tsx:IFirstPart2',
                                name: 'f4',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 3,
                            },
                            {
                                from: 'test/test.tsx:TSecond',
                                name: 's1',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 4,
                            },
                            {
                                from: 'test/test.tsx:TSecond',
                                name: 's2',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 5,
                            },
                        ],
                        typeRef: 'test/test.tsx:TIntersection',
                        typeValue: {
                            print: [
                                "type TIntersection = Omit<TFirst, 'f2'> & TSecond;",
                            ],
                            raw: 'TIntersection',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:IFirstPart1': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'IFirstPart1',
                        nameFull: 'IFirstPart1',
                    },
                },
                'test/test.tsx:IFirstPart2': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'IFirstPart2',
                        nameFull: 'IFirstPart2',
                    },
                },
                'test/test.tsx:TIntersection': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TIntersection',
                        nameFull: 'TIntersection',
                    },
                },
                'test/test.tsx:TSecond': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TSecond',
                        nameFull: 'TSecond',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
