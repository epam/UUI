import { fireEvent, within } from '../extensions/testingLibraryReactExt';
import { PickerTestObject } from './Picker';

export class PickerModalTestObject extends PickerTestObject {
    static editMode: string = 'modal';

    static async findSearchInput() {
        const modal = await this.findDialog();
        const input = await within(modal).findByPlaceholderText('Type text for quick search');
        return input;
    }

    static async closeModal() {
        const modal = await this.findDialog();
        const closeButton = await within(modal).findByRole('button', { name: 'Close modal' });
        fireEvent.click(closeButton);
    }

    static async clickSelectItems() {
        const modal = await this.findDialog();
        const selectButton = within(modal).getByRole('button', { name: 'Select' });
        fireEvent.click(selectButton);
    }

    static async clickCancelButton() {
        const modal = await this.findDialog();
        const cancelButton = within(modal).getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);
    }

    static async findClearButton() {
        const modal = await this.findDialog();
        return within(modal).queryByRole('button', { name: /clear/i });
    }

    static async clickClearButton() {
        const clearButton = await this.findClearButton();
        if (clearButton) {
            fireEvent.click(clearButton);
        }
    }

    static async findShowOnlySelectedSwitch() {
        const modal = await this.findDialog();
        return within(modal).queryByLabelText(/show only selected/i);
    }

    static async findSelectAllButton() {
        const modal = await this.findDialog();
        return within(modal).queryByRole('button', { name: /select all/i });
    }

    static async findCustomElement(testId: string) {
        const modal = await this.findDialog();
        return within(modal).queryByTestId(testId);
    }

    static async getModalTitle() {
        const modal = await this.findDialog();
        const header = within(modal).getByRole('banner');
        return within(header).getByRole('heading');
    }

    static async isSearchInputFocused() {
        const searchInput = await this.findSearchInput();
        return document.activeElement === searchInput;
    }

    static async typeInSearch(text: string) {
        const searchInput = await this.findSearchInput();
        fireEvent.change(searchInput, { target: { value: text } });
    }

    static async pressKeyInSearch(key: string, code?: string) {
        const searchInput = await this.findSearchInput();
        fireEvent.keyDown(searchInput, { key, code: code || key });
    }
}
