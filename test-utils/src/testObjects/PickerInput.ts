import { fireEvent, within } from '../extensions/testingLibraryReactExt';
import { PickerTestObject } from './Picker';

export class PickerInputTestObject extends PickerTestObject {
    static getPlaceholderText(input: HTMLElement) {
        return input.getAttribute('placeholder')?.trim();
    }

    static clearInput(container: HTMLElement) {
        const clearButton = within(container).getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);
    }

    static hasClearInputButton(container: HTMLElement) {
        return !!within(container).queryByRole('button', { name: 'Clear' });
    }

    static getSelectedTagsText(target: HTMLElement) {
        return this.getSelectedTags(target).map((b) => b.textContent?.trim());
    }

    static removeSelectedTagByText(target: HTMLElement, text: string) {
        const tag = this.getSelectedTags(target).find((b) => b.textContent?.trim() === text);
        const removeTagIcon = tag?.lastElementChild;
        fireEvent.click(removeTagIcon as Element);
    }

    protected static getSelectedTags(target: HTMLElement) {
        return within(target).queryAllByRole('option');
    }
}
