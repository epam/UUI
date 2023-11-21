import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DocBuilder } from '@epam/uui-docs';
import { Day, IconContainer } from '@epam/uui-components';
import { DatePickerProps, DatePicker, LinkButton, FlexRow } from '@epam/uui';
import { iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, DefaultContext, ResizableContext, IHasEditModeDoc } from '../../docs';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';
import css from './DatePicker.doc.module.scss';

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

const DatePickerDoc = new DocBuilder<DatePickerProps>({ name: 'DatePicker', component: DatePicker })
    .implements([
        iEditable, sizeDoc, IHasEditModeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc,
    ])
    .prop('value', { examples: ['2020-09-03'] })
    .prop('placeholder', { examples: ['Enter start date'] })
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
                name: 'Filter before current day',
                value: (day) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf(),
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
                            isSelected={ day && day.isSame(ctx.getSelectedProps().value) }
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
    .prop('disableClear', { examples: [true], defaultValue: false })
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] })
    .prop('renderFooter', {
        examples: (ctx) => [
            {
                name: 'footer',
                value: () => (
                    <FlexRow cx={ css.footer } background="surface" size="48">
                        <LinkButton size="36" caption="Today" onClick={ () => ctx.getSelectedProps().onValueChange(dayjs().format('YYYY-MM-DD')) } />
                    </FlexRow>
                ),
            },
        ],
    })
    .withContexts(DefaultContext, ResizableContext);

export default DatePickerDoc;
