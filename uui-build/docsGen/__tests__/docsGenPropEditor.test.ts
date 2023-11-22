import { generateDocs } from './utils/test-utils';

describe('docsGen:propEditor', () => {
    test('should convert prop editor for optional icon prop', () => {
        const input = `
            type Icon = React.FC<any>;
            export interface TTest {
                icon?: Icon;
            };
        `;
        expect(generateDocs(input)).toMatchSnapshot();
    });
});
