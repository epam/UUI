import React from "react";
import { renderWithContextAsync } from "@epam/test-utils";
import { PresetInput } from "../PresetInput";

describe('PresetInput', () => {
    it('should render correctly', async () => {
        const component =  await renderWithContextAsync(
            <PresetInput onCancel={ jest.fn() }/>,
        );
        expect(component).toMatchSnapshot();
    });
});
