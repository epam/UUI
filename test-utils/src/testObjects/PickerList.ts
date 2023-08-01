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
}
