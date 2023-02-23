import * as React from 'react';
import { RadioInput as uuiRadioInput, RadioInputProps as UuiRadioInputProps } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { ReactComponent as RadioPoint } from '../../icons/radio-point.svg';

export const RadioInput = withMods<UuiRadioInputProps>(uuiRadioInput, () => {}, () => ({ icon: RadioPoint }));
