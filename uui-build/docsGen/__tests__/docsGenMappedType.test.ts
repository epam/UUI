import { generateDocs } from './utils/test-utils';

describe('docsGen:mappedType', () => {
    test('should convert mapped type', () => {
        const input = `
            export type TLocal = {
                [key: number]: string;
            }
        `;
        const output = {
            '@epam/test-module': {
                TLocal: {
                    kind: 'TypeAliasDeclaration',
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TLocal',
                            nameFull: 'TLocal',
                        },
                    },
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
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
