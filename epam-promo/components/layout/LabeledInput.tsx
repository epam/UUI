import { withMods } from '@epam/uui-core';
import { LabeledInput as uuiLabeledInput, LabeledInputMods } from '@epam/uui';
import { LabeledInputProps } from '@epam/uui-components';

export const LabeledInput = withMods<LabeledInputProps, LabeledInputMods>(uuiLabeledInput, () => {});
