import { fireEvent, within, screen } from '../extensions/testingLibraryReactExt';
import { PickerTestObject } from './Picker';

export class PickerModalTestObject extends PickerTestObject {
    static async findSearchInput() {
        const modal = await this.findDialog('modal');
        const input = await within(modal).findByPlaceholderText('Type text for quick search');
        return input;
    }
}
