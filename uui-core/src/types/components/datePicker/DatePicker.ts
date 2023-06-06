import { ReactNode } from 'react';
import { BaseDatePickerProps } from './BaseDatePicker';

export interface DatePickerCoreProps extends BaseDatePickerProps {
    /** render prop to add a custom footer inside the DatePicker dropdown body */
    renderFooter?(): ReactNode;
}
