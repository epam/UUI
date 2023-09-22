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
            '@epam/test-module': {
                TIntersection: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'TIntersectionMemberA',
                                    nameFull: 'TIntersectionMemberA',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'a1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'TIntersectionMemberA',
                                    nameFull: 'TIntersectionMemberA',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'a2',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IIntersectionMemberB',
                                    nameFull: 'IIntersectionMemberB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'b1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IIntersectionMemberB',
                                    nameFull: 'IIntersectionMemberB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'b2',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TIntersection',
                            nameFull: 'TIntersection',
                        },
                    },
                    typeValue: {
                        print: [
                            'type TIntersection = TIntersectionMemberA & IIntersectionMemberB;',
                        ],
                        raw: 'TIntersection',
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
            '@epam/test-module': {
                TIntersection: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IFirstPart1',
                                    nameFull: 'IFirstPart1',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'f1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IFirstPart2',
                                    nameFull: 'IFirstPart2',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'f3',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IFirstPart2',
                                    nameFull: 'IFirstPart2',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'f4',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'TSecond',
                                    nameFull: 'TSecond',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 's1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'TSecond',
                                    nameFull: 'TSecond',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 's2',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TIntersection',
                            nameFull: 'TIntersection',
                        },
                    },
                    typeValue: {
                        print: [
                            "type TIntersection = Omit<TFirst, 'f2'> & TSecond;",
                        ],
                        raw: 'TIntersection',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
