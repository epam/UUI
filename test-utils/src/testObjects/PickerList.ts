import { fireEvent, screen, within } from '../extensions/testingLibraryReactExt';
import { OptionConfig, PickerTestObject } from './Picker';

export class PickerListTestObject extends PickerTestObject {
    static getPickerToggler() {
        return screen.getByRoleAndText({ role: 'button', text: /Show all/i });
    }

    static getOptions(props: { busy?: boolean, editMode?: string } = {}) {
        const container = props.editMode ? within(this.getDialog(props.editMode)) : screen;
        const params: any = {};
        if (typeof props.busy !== 'undefined') {
            params.busy = props.busy;
        }
        return container.getAllByRole('option', params);
    }

    protected static async findOption(optionText: string, { editMode }: OptionConfig = {}) {
        const container = editMode ? within(await this.findDialog(editMode)) : screen;
        return await container.findByRoleAndText({ role: 'option', text: optionText });
    }

    static queryOptions(props: { busy?: boolean, editMode?: string } = {}) {
        const container = props.editMode ? within(this.queryDialog(props.editMode)) : screen;
        const params: any = {};
        if (typeof props.busy !== 'undefined') {
            params.busy = props.busy;
        }
        return container.queryAllByRole('option', params);
    }

    static async findSearchInput() {
        const modal = await this.findDialog('modal');
        const input = await within(modal).findByPlaceholderText('Type text for quick search');
        return input;
    }

    static async findCheckedOptions(props: { editMode?: string } = {}) {
        const container = props.editMode ? within(await this.findDialog(props.editMode)) : screen;

        return (await container.findAllByRole('option')).filter((opt) => {
            return (within(opt).getByRole('checkbox') as HTMLInputElement).checked;
        }).map((e) => e.textContent?.trim());
    }

    static clickOnModalBlocker() {
        const blocker = screen.getByLabelText('Click to close a modal');
        fireEvent.click(blocker);
    }
}
