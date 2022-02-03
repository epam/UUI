import React from "react";
import { renderWithContextAsync } from '@epam/test-utils';
import { TimePicker } from "../TimePicker";

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe("TimePicker", () => {
    const value = { hours: 1, minutes: 1 };
    const onChange = jest.fn();

    it("should be rendered correctly", async () => {
        const tree = await renderWithContextAsync(
            <TimePicker
                value={ value }
                onValueChange={ onChange }
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", async () => {
        const tree = await renderWithContextAsync(
            <TimePicker
                value={ value }
                onValueChange={ onChange }
                format={ 24 }
                minutesStep={ 5 }
                size='36'
                isDisabled
            />
        );

        expect(tree).toMatchSnapshot();
    });
});