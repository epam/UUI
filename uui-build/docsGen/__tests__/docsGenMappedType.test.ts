import { generateDocs } from './utils/test-utils';

describe('docsGen:mappedType', () => {
    test('should convert mapped type', () => {
        const input = `
            export type TLocal = {
                [key: number]: string;
            }
        `;
        expect(generateDocs(input)).toMatchSnapshot();
    });
});
