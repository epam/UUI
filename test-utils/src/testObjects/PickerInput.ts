import { fireEvent, within, screen } from '../extensions/testingLibraryReactExt';

export class PickerInputTestObject {
    static getOptions(props: { busy?: boolean, editMode?: string } = {}) {
        const dialog = within(this.getDialog(props.editMode));
        const params: any = {};
        if (typeof props.busy !== 'undefined') {
            params.busy = props.busy;
        }
        return dialog.getAllByRole('option', params);
    }

    static async findOptions(props: { busy?: boolean, editMode?: string } = {}) {
        const dialog = within(await this.findDialog(props.editMode));
        const params: any = {};
        if (typeof props.busy !== 'undefined') {
            params.busy = props.busy;
        }
        return await dialog.findAllByRole('option', params);
    }

    static async findOptionsText(props: { busy?: boolean, editMode?: string } = {}) {
        const opts = await this.findOptions(props);
        return opts.map((o) => o.textContent?.trim());
    }

    static async findCheckedOptions() {
        const dialog = within(await this.findDialog());
        return (await dialog.findAllByRole('option')).filter((opt) => {
            return (within(opt).getByRole('checkbox') as HTMLInputElement).checked;
        }).map((e) => e.textContent?.trim());
    }

    static async findUncheckedOptions() {
        const dialog = within(await this.findDialog());
        return (await dialog.findAllByRole('option')).filter((opt) => {
            return !(within(opt).getByRole('checkbox') as HTMLInputElement).checked;
        }).map((e) => e.textContent?.trim());
    }

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

    static async clickSelectAllOptions() {
        const dialog = within(await this.findDialog());
        const selectAllButton = await dialog.findByRole('button', { name: 'SELECT ALL' });
        fireEvent.click(selectAllButton);
    }

    static async clickShowOnlySelected() {
        const dialog = within(await this.findDialog());
        const showOnlySelected = await dialog.findByRole('switch', { name: 'Show only selected' });
        fireEvent.click(showOnlySelected);
    }

    static async clickClearAllOptions() {
        const dialog = within(await this.findDialog());
        const selectAllButton = await dialog.findByRole('button', { name: 'CLEAR ALL' });
        fireEvent.click(selectAllButton);
    }

    static getSelectedTagsText(input: HTMLElement) {
        return this.getSelectedTags(input).map((b) => b.textContent?.trim());
    }

    static removeSelectedTagByText(input: HTMLElement, text: string) {
        const tag = this.getSelectedTags(input).find((b) => b.textContent?.trim() === text);
        const removeTagIcon = tag?.lastElementChild;
        fireEvent.click(removeTagIcon as Element);
    }

    static async clickOptionByText(optionText: string) {
        const opt = await this.findOption(optionText);
        fireEvent.click(opt);
    }

    static async clickOptionCheckbox(optionText: string) {
        const opt = await this.findOption(optionText);
        fireEvent.click(within(opt).getByRole('checkbox'));
    }

    static async clickOptionUnfold(optionText: string) {
        const opt = await this.findOption(optionText);
        fireEvent.click(within(opt).getByRole('button', { name: 'Unfold' }));
    }

    static async hasOptions(props?: { busy?: boolean }) {
        return (await this.findOptions(props)).length > 0;
    }

    private static async findDialog(editMode: string = 'dialog') {
        return await screen.findByRole(editMode === 'modal' ? 'modal' : 'dialog');
    }

    private static getDialog(editMode: string = 'dialog') {
        return screen.getByRole(editMode === 'modal' ? 'modal' : 'dialog');
    }

    private static async findOption(optionText: string) {
        const dialog = within(await this.findDialog());
        return await dialog.findByRoleAndText({ role: 'option', text: optionText });
    }

    private static getSelectedTags(input: HTMLElement) {
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
