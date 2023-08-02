import { screen, within } from '../extensions/testingLibraryReactExt';
import { PickerTestObject } from './Picker';

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
}
