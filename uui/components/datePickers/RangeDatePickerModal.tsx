import React, { useCallback, useMemo, useState, type JSX } from 'react';
import cx from 'classnames';
import type {
    IModal,
    RangeDatePickerInputType,
    RangeDatePickerProps,
    RangeDatePickerValue,
} from '@epam/uui-core';
import { ReactComponent as NavigationRefreshOutlineIcon } from '@epam/assets/icons/navigation-refresh-outline.svg';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow } from '../overlays';
import { Button, LinkButton } from '../buttons';
import { FlexRow, FlexSpacer, FlexCell } from '../layout';
import { RangeDatePickerBody, RangeDatePickerBodyValue } from './RangeDatePickerBody';
import { defaultFormatShort, toCustomDateFormat } from './helpers';
import { i18n } from '../../i18n';

import css from './RangeDatePickerModal.module.scss';

export interface RangeDatePickerModalProps extends IModal<RangeDatePickerValue> {
    pickerProps: RangeDatePickerProps;
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

    const onClearAll = useCallback(() => {
        setModalValue((prevValue) => ({
            from: pickerProps.preventEmptyFromDate ? prevValue.from : null,
            to: pickerProps.preventEmptyToDate ? prevValue.to : null,
        }));
    }, [pickerProps.preventEmptyFromDate, pickerProps.preventEmptyToDate]);

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

    const hideClearButton = pickerProps.disableClear || (pickerProps.preventEmptyToDate && pickerProps.preventEmptyFromDate);

    const renderModalHeaderTitle = () => {
        return (
            <FlexCell>
                <h4 className={ css.modalTitle }>{i18n.rangeDatePicker.mobileModalTitle}</h4>
                <h2 className={ css.rangeSelector }>
                    <LinkButton
                        cx={ css.rangeSelectorButton }
                        color={ inFocus === 'from' ? 'primary' : 'secondary' }
                        size="36"
                        caption={ startDateButtonCaption }
                        onClick={ () => setInFocus('from') }
                    />
                    <span className={ css.headerRangeSeparator }> – </span>
                    <LinkButton
                        cx={ css.rangeSelectorButton }
                        color={ inFocus === 'to' ? 'primary' : 'secondary' }
                        size="36"
                        caption={ endDateButtonCaption }
                        onClick={ () => setInFocus('to') }
                    />
                </h2>
            </FlexCell>
        );
    };

    return (
        <ModalBlocker key={ key } isActive={ isActive } zIndex={ zIndex } success={ () => success(modalValue) } abort={ abort }>
            <ModalWindow cx={ css.root }>
                <ModalHeader title={ renderModalHeaderTitle() } borderBottom onClose={ abort } />
                <FlexRow cx={ css.body } alignItems="stretch">
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
                    {!hideClearButton && <Button fill="ghost" color="primary" caption={ i18n.rangeDatePicker.mobileModalClearAll } onClick={ onClearAll } icon={ NavigationRefreshOutlineIcon } />}
                    <FlexSpacer />
                    <Button fill="outline" color="secondary" caption={ i18n.rangeDatePicker.mobileModalCancel } onClick={ abort } />
                    <Button color="primary" caption={ i18n.rangeDatePicker.mobileModalApply } onClick={ () => success(modalValue) } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
