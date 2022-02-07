import React from "react";
import { renderWithContextAsync } from '@epam/test-utils';
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <Tooltip>{ 'Test' }</Tooltip>
        );

        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", async () => {
        const tree = await renderWithContextAsync(
            <Tooltip color="sun" content='Test content' trigger='click'>
                Test
            </Tooltip>
        );

        expect(tree).toMatchSnapshot();
    });
});