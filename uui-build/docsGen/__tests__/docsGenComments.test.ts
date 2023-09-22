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
            '@epam/test-module': {
                ITest: {
                    comment: [
                        'This is an export level multiline TSDoc.',
                    ],
                    kind: 'InterfaceDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'a',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '1',
                        },
                        {
                            comment: [
                                'This is property-level TSDoc',
                            ],
                            kind: 'PropertySignature',
                            name: 'b',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '2',
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'ITest',
                            nameFull: 'ITest',
                        },
                    },
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
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
