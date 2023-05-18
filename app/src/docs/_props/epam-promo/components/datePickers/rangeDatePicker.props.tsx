import * as React from 'react';
import { RangeDatePicker } from '@epam/promo';
import { RangeDatePickerProps } from '@epam/uui';
import css from './RangeDatePicker.doc.module.scss';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import {
    iEditable, sizeDoc, isDisabledDoc, isInvalidDoc, FormContext, DefaultContext, ResizableContext,
} from '../../docs';
import dayjs, { Dayjs } from 'dayjs';
import {
    RangeDatePickerValue, rangeDatePickerPresets, Day, IconContainer,
} from '@epam/uui-components';
import { Button, Text } from '@epam/promo';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';
import isBetween from 'dayjs/plugin/isBetween.js';

dayjs.extend(isBetween);

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
        iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc,
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
            'MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD',
        ],
        defaultValue: 'MMM D, YYYY',
        type: 'string',
    })
    .prop('filter', {
        examples: [
            {
                name: 'Filter before current day and after 2 months',
                value: (day: Dayjs) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf() && day.valueOf() < dayjs().add(2, 'months').valueOf(),
            },
        ],
    })
    .prop('renderDay', {
        examples: (ctx) => [
            {
                name: 'Render custom day',
                value: (day, onDayClick: (day: Dayjs) => void) => {
                    return (
                        <Day
                            renderDayNumber={ getCustomDay }
                            value={ day }
                            onValueChange={ onDayClick }
                            isSelected={
                                day && ctx.getSelectedProps().value && day.isBetween(ctx.getSelectedProps().value.from, ctx.getSelectedProps().value.to, undefined, '[]')
                            }
                            filter={ ctx.getSelectedProps().filter }
                        />
                    );
                },
            },
        ],
    })
    .prop('placement', {
        examples: [
            'auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', { value: 'bottom-start', isDefault: true }, 'left-end', 'left', 'left-start',
        ],
    })
    .prop('presets', {
        examples: [
            {
                name: 'default',
                value: rangeDatePickerPresets,
            }, {
                name: 'custom',
                value: {
                    ...rangeDatePickerPresets,
                    lastMonth: null,
                    last3Days: {
                        name: 'Last 3 days (custom)',
                        getRange: () => {
                            return { from: dayjs().subtract(3, 'day').toString(), to: dayjs().toString(), order: 11 };
                        },
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
                            <Text color="gray60" size="24">
                                {`Days: ${getRangeLength(value)}`}
                            </Text>
                        </div>
                        <div className={ css.buttonGroup }>
                            <Button cx={ css.buttonContainer } caption="Done" color="green" fill="solid" size="24" onClick={ () => {} } />
                        </div>
                    </div>
                ),
            },
        ],
    })
    .prop('disableClear', { examples: [true], defaultValue: false })
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] })
    .prop('onOpenChange', { examples: (ctx) => [ctx.getCallback('onOpenChange')] })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default RangeDatePickerDoc;
