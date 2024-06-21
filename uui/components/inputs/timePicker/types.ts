import React from 'react';
import { IHasEditMode } from '../../types';
import {
    CX,
    ICanBeReadonly,
    ICanFocus, Icon,
    IDisableable,
    IDropdownToggler,
    IEditable, IHasCX,
    IHasForwardedRef,
    IHasPlaceholder,
    IHasRawProps,
} from '@epam/uui-core';

export interface TimePickerProps extends IHasEditMode, IEditable<TimePickerValue | null>,
    IDisableable,
    ICanBeReadonly,
    IHasPlaceholder,
    ICanFocus<HTMLElement>,
    IHasForwardedRef<HTMLElement> {

    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';

    /**
     * Minutes input increase/decrease step on up/down icons clicks and up/down arrow keys
     * @default 5
     */
    minutesStep?: number;

    /**
     * Time format, 12 hours with AM/PM or 24 hours
     * @default 12
     */
    format?: 12 | 24;

    /** ID to put on time picker toggler 'input' node */
    id?: string;

    /**
     * Render callback for time picker toggler.
     * If omitted, default TextInput component will be rendered.
     */
    renderTarget?(props: IDropdownToggler): React.ReactNode;

    /** HTML attributes to put directly to TimePicker parts */
    rawProps?: {
        /** HTML attributes to put directly to the input element */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /** HTML attributes to put directly to the body root element */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
    /** CSS class(es) to put on input-part component. See https://github.com/JedWatson/classnames#usage for details */
    inputCx?: CX;
    /** CSS class(es) to put on body-part component. See https://github.com/JedWatson/classnames#usage for details */
    bodyCx?: CX;
    /**
     * Indicates that inputs' clear cross is hidden
     */
    disableClear?: boolean;
}

export interface TimePickerValue {
    /** Selected hours value */
    hours: number;
    /** Selected minutes value */
    minutes: number;
}

export interface TimePickerBodyProps extends Pick<TimePickerProps, 'minutesStep' | 'format'>, IHasCX, IEditable<TimePickerValue>,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    /** Icon for the add action.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon
     */
    addIcon?: Icon;
    /** Icon for the subtract action.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon
     */
    subtractIcon?: Icon;
}
