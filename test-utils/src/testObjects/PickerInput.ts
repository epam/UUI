import { fireEvent, within, screen } from '../extensions/testingLibraryReactExt';
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

    static getSelectedTagsText(input: HTMLElement) {
        return this.getSelectedTags(input).map((b) => b.textContent?.trim());
    }

    static removeSelectedTagByText(input: HTMLElement, text: string) {
        const tag = this.getSelectedTags(input).find((b) => b.textContent?.trim() === text);
        const removeTagIcon = tag?.lastElementChild;
        fireEvent.click(removeTagIcon as Element);
    }

    protected static getSelectedTags(input: HTMLElement) {
        const tags: HTMLElement[] = [];
        let s = input;
        while ((s = s.previousElementSibling as HTMLElement)) {
            if (s.tagName.toLowerCase() === 'button') {
                tags.push(s);
            }
        }
        return tags.reverse();
    }
}
