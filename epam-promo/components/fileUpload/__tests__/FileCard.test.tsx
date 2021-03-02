import React from 'react';
import { FileCard } from '../FileCard';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { FlexCell, FlexRow } from '../../layout/FlexItems';
import { IconContainer } from '../../layout';
import { Svg } from '@epam/uui-components';
import * as videoIcon from '../../../icons/fileUpload/file-file_video-24.svg';
import * as tableIcon from '../../../icons/fileUpload/file-file_table-24.svg';
import * as textIcon from '../../../icons/fileUpload/file-file_text-24.svg';
import * as mailIcon from '../../../icons/fileUpload/file-file_eml-24.svg';
import * as fileIcon from '../../../icons/fileUpload/file-file-24.svg';
import * as pdfIcon from '../../../icons/fileUpload/file-file_pdf-24.svg';

describe('FileCard', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<FileCard file={ {
                id: 1,
                name: 'Test.xls',
                size: 12546,
                progress: 0,
            } } />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<FileCard
                file={ {
                    id: 1,
                    name: 'Test.doc',
                    size: 12546,
                    progress: 0,
                } }
                width={ 140 }
                onClick={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<FileCard
                file={ {
                    id: 1,
                    name: 'Test.gif',
                    size: 12546,
                    progress: 100,
                } }
                width={ 140 }
                onClick={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render correct file icon', function () {
        const mockMap = new Map([
            ['Test.pdf', pdfIcon],
            ['Test.avi', videoIcon],
            ['Test.csv', tableIcon],
            ['Test.rtf', textIcon],
            ['Test.eml', mailIcon],
            ['Test.zip', fileIcon],
        ]);

        mockMap.forEach((value, key) => {
            const wrapper = mount(<FileCard file={ {
                id: 1,
                name: key,
                size: 12546,
                progress: 100,
            } }/>);

            const icon = wrapper
                .find(FlexCell)
                ?.find(FlexRow)
                ?.find(IconContainer)
                ?.find(Svg)
                ?.prop('svg');

            expect(icon).toBe(value);
            wrapper.unmount();
        });
    });
});