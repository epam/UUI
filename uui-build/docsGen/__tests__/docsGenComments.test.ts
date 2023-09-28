import { generateDocs } from './utils/test-utils';

describe('docsGen:comments', () => {
    test('should convert comments', () => {
        const input = `
            /**
             * This is an export level multiline TSDoc.
            */
            export interface ITest {
                // Single line comment should be ignored
                a: number;
                /** This is property-level TSDoc */
                b: number;
            }
        `;
        const output = {
            publicTypes: {
                '@epam/test-module': {
                    ITest: {
                        kind: 263,
                        props: [
                            {
                                name: 'a',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 1,
                            },
                            {
                                comment: [
                                    'This is property-level TSDoc',
                                ],
                                name: 'b',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 2,
                            },
                        ],
                        typeRef: 'test/test.tsx:ITest',
                        typeValue: {
                            print: [
                                '/**',
                                ' * This is an export level multiline TSDoc.',
                                '*/',
                                'interface ITest {',
                                '    // Single line comment should be ignored',
                                '    a: number;',
                                '    /** This is property-level TSDoc */',
                                '    b: number;',
                                '}',
                            ],
                            raw: 'ITest',
                        },
                    },
                },
            },
            refs: {
                'test/test.tsx:ITest': {
                    comment: [
                        'This is an export level multiline TSDoc.',
                    ],
                    isPublic: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'ITest',
                        nameFull: 'ITest',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
