import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import {
    RangeDatePickerValue, rangeDatePickerPresets, Day, IconContainer,
} from '@epam/uui-components';
import { RangeDatePicker } from '@epam/loveship';
import css from './RangeDatePicker.doc.scss';
import {
    iEditable, sizeDoc, isDisabledDoc, isInvalidDoc, modeDoc,
} from '../../docs';
import { FormContext, DefaultContext, ResizableContext } from '../../docs';
import { Button } from '@epam/loveship';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';
import { RangeDatePickerProps } from '@epam/uui';

const getCustomDay = (day: Dayjs) => {
    return (
        <>
            {day.format('D')}
            <IconContainer
                style={ {
                    fill: '#fcaa00', height: '4px', width: '4px', position: 'absolute', top: '7px', right: '10px',
                } }
                icon={ Point }
            />
        </>
    );
};

const getRangeLength = (value: RangeDatePickerValue) => {
    return dayjs(value.to).isValid() && dayjs(value.from).isValid() && dayjs(value.from).valueOf() < dayjs(value.to).valueOf()
        ? dayjs(value.to).diff(dayjs(value.from), 'day') + 1
        : 0;
};

const RangeDatePickerDoc = new DocBuilder<RangeDatePickerProps>({ name: 'RangeDatePicker', component: RangeDatePicker })
    .implements([
        iEditable,
        sizeDoc,
        isDisabledDoc,
        isReadonlyDoc,
        isInvalidDoc,
        modeDoc,
    ])
    .prop('value', { examples: [{ name: "{ from: '2017-01-22', to: '2017-01-28' }", value: { from: '2017-01-22', to: '2017-01-28' } }] })
    .prop('getPlaceholder', {
        examples: [
            {
                name: 'Custom placeholder',
                value: (type) => (type === 'from' ? 'Enter start day' : type === 'to' ? 'Enter end day' : null),
            },
        ],
    })
    .prop('format', {
        examples: [
            'MM/DD/YYYY',
            'MMM D, YYYY',
            'DD.MM.YYYY',
            'YYYY-MM-DD',
        ],
        defaultValue: 'MMM D, YYYY',
        type: 'string',
    })
    .prop('filter', {
        examples: [
            {
                name: 'Filter before current day and after 2 months',
                value: (day) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf() && day.valueOf() < dayjs().add(2, 'month').valueOf(),
            },
        ],
    })
    .prop('renderDay', {
        examples: (ctx) => [
            {
                name: 'Render custom day',
                value: (day: any, onDayClick: (day: Dayjs) => void) => (
                    <Day
                        renderDayNumber={ getCustomDay }
                        value={ day }
                        onValueChange={ onDayClick }
                        isSelected={
                            day && ctx.getSelectedProps().value && day.isBetween(ctx.getSelectedProps().value.from, ctx.getSelectedProps().value.to, undefined, '[]')
                        }
                        filter={ ctx.getSelectedProps().filter }
                    />
                ),
            },
        ],
    })
    .prop('placement', {
        examples: [
            'auto-start',
            'auto',
            'auto-end',
            'top-start',
            'top',
            'top-end',
            'right-start',
            'right',
            'right-end',
            'bottom-end',
            'bottom',
            { value: 'bottom-start', isDefault: true },
            'left-end',
            'left',
            'left-start',
        ],
    })
    .prop('presets', {
        examples: [
            {
                name: 'default',
                value: rangeDatePickerPresets,
            },
            {
                name: 'custom',
                value: {
                    ...rangeDatePickerPresets,
                    lastMonth: null,
                    last3Days: {
                        name: 'Last 3 days (custom)',
                        getRange: () => ({
                            from: dayjs().subtract(3, 'day').toString(),
                            to: dayjs().toString(),
                            order: 11,
                        }),
                    },
                },
            },
        ],
    })
    .prop('renderFooter', {
        examples: [
            {
                name: 'footer',
                value: (value) => (
                    <div className={ css.container }>
                        <div>
                            <div className={ css.counter }>
                                Days:
                                {getRangeLength(value)}
                            </div>
                        </div>
                        <div className={ css.buttonGroup }>
                            <Button cx={ css.buttonContainer } caption="clear" color="night600" fill="none" size="30" />
                        </div>
                    </div>
                ),
            },
        ],
    })
    .prop('disableClear', { examples: [true], defaultValue: false })
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default RangeDatePickerDoc;
