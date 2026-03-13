import React, { useMemo, useState, type JSX } from 'react';
import cx from 'classnames';
import type {
    IModal,
    RangeDatePickerInputType,
    RangeDatePickerProps,
    RangeDatePickerValue,
} from '@epam/uui-core';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow } from '../overlays';
import { Button, LinkButton } from '../buttons';
import { FlexRow, FlexSpacer } from '../layout';
import { RangeDatePickerBody, RangeDatePickerBodyValue } from './RangeDatePickerBody';
import { defaultFormatShort, toCustomDateFormat } from './helpers';
import { i18n } from '../../i18n';

import css from './RangeDatePickerModal.module.scss';

export type RangeDatePickerModalPickerProps = Pick<
RangeDatePickerProps,
| 'bodyCx'
| 'format'
| 'filter'
| 'presets'
| 'renderDay'
| 'renderFooter'
| 'isHoliday'
| 'rawProps'
| 'preventEmptyToDate'
| 'preventEmptyFromDate'
| 'initialViewMonth'
>;

export interface RangeDatePickerModalProps extends IModal<RangeDatePickerValue> {
    pickerProps: RangeDatePickerModalPickerProps;
    initialValue: RangeDatePickerValue;
}

export function RangeDatePickerModal({
    success,
    abort,
    isActive,
    zIndex,
    key,
    pickerProps,
    initialValue,
}: RangeDatePickerModalProps): JSX.Element {
    const [modalValue, setModalValue] = useState<RangeDatePickerValue>(initialValue);
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>('from');

    const onModalBodyValueChange = (newValue: RangeDatePickerBodyValue<RangeDatePickerValue>) => {
        setInFocus(newValue.inFocus ?? inFocus);
        setModalValue(newValue.selectedDate);
    };

    const getDateButtonCaption = (date: string | null, placeholder: string) => {
        return date ? toCustomDateFormat(date, defaultFormatShort) : placeholder;
    };

    const startDateButtonCaption = useMemo(
        () => getDateButtonCaption(modalValue?.from ?? null, i18n.rangeDatePicker.mobileModalStartPlaceholder),
        [modalValue?.from],
    );
    const endDateButtonCaption = useMemo(
        () => getDateButtonCaption(modalValue?.to ?? null, i18n.rangeDatePicker.mobileModalEndPlaceholder),
        [modalValue?.to],
    );

    return (
        <ModalBlocker key={ key } isActive={ isActive } zIndex={ zIndex } success={ () => success(modalValue) } abort={ abort }>
            <ModalWindow cx={ css.root }>
                <ModalHeader cx={ css.header } title={ i18n.rangeDatePicker.mobileModalTitle } borderBottom>
                    <FlexRow>
                        <LinkButton
                            cx={ css.rangeSelector }
                            color={ inFocus === 'from' ? 'primary' : 'secondary' }
                            size="48"
                            caption={ startDateButtonCaption }
                            onClick={ () => setInFocus('from') }
                        />
                        <span className={ css.headerRangeSeparator }> – </span>
                        <LinkButton
                            cx={ css.rangeSelector }
                            color={ inFocus === 'to' ? 'primary' : 'secondary' }
                            size="48"
                            caption={ endDateButtonCaption }
                            onClick={ () => setInFocus('to') }
                        />
                    </FlexRow>
                </ModalHeader>
                <FlexRow cx={ css.body }>
                    <RangeDatePickerBody
                        cx={ cx(pickerProps.bodyCx) }
                        value={ { selectedDate: modalValue, inFocus } }
                        onValueChange={ onModalBodyValueChange }
                        filter={ pickerProps.filter }
                        presets={ pickerProps.presets }
                        renderDay={ pickerProps.renderDay }
                        renderFooter={ () => pickerProps.renderFooter?.(modalValue) }
                        isHoliday={ pickerProps.isHoliday }
                        rawProps={ pickerProps.rawProps?.body }
                        preventEmptyToDate={ pickerProps.preventEmptyToDate }
                        preventEmptyFromDate={ pickerProps.preventEmptyFromDate }
                        initialViewMonth={ pickerProps.initialViewMonth }
                    />
                </FlexRow>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button fill="outline" color="secondary" caption={ i18n.rangeDatePicker.mobileModalCancel } onClick={ abort } />
                    <Button color="primary" caption={ i18n.rangeDatePicker.mobileModalApply } onClick={ () => success(modalValue) } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
