import { generateDocs } from './utils/test-utils';

describe('docsGen:mappedType', () => {
    test('should convert mapped type', () => {
        const input = `
            export type TLocal = {
                [key: number]: string;
            }
        `;
        const output = {
            publicTypes: {
                '@epam/test-module': {
                    TLocal: {
                        kind: 264,
                        props: [
                            {
                                name: '[key: number]',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 1,
                            },
                        ],
                        typeRef: 'test/test.tsx:TLocal',
                        typeValue: {
                            print: [
                                'type TLocal = {',
                                '    [key: number]: string;',
                                '};',
                            ],
                            raw: 'TLocal',
                        },
                    },
                },
            },
            refs: {
                'test/test.tsx:TLocal': {
                    isPublic: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TLocal',
                        nameFull: 'TLocal',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
