import React from "react";
import { BurgerSearch } from "../BurgerSearch";
import { renderWithContextAsync } from '@epam/test-utils';
import { ReactComponent as AcceptIcon } from "../../../../icons/accept-12.svg";

describe("BurgerSearch", () => {
    it("should be rendered correctly", async () => {
        const tree = await renderWithContextAsync(<BurgerSearch value='test' onValueChange={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderWithContextAsync(
            <BurgerSearch
                value='test'
                onValueChange={ jest.fn() }
                onAccept={ jest.fn() }
                onCancel={ jest.fn() }
                icon={ AcceptIcon }
                iconPosition='right'
                isDropdown
                isOpen
            />
        );

        expect(tree).toMatchSnapshot();
    });
});