import React from "react";
import { renderWithContextAsync } from "@epam/test-utils";
import { FilterDataPickerBody } from "../FilterDataPickerBody";
import renderer from "react-test-renderer";

describe('FilterDataPickerBody', () => {
    it('should render correctly', async () => {
        const component = await renderWithContextAsync(
            <FilterDataPickerBody
                onValueChange={ jest.fn() }
                value={ '1/10/2023' }
            />,
        );
        expect(component).toMatchSnapshot();
    });

    it('renders with value prop', async () => {
        const component = renderer.create(
            <FilterDataPickerBody
                onValueChange={ jest.fn() }
                value="1/10/2023"/>,
        );
        const textComponent = await component.root.findByProps({ children: 'Jan 10, 2023' });
        expect(textComponent.props.children).toEqual('Jan 10, 2023');
    });
});
