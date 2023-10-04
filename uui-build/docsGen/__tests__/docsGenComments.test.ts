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
        expect(generateDocs(input)).toMatchSnapshot();
    });
});
