import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DocBuilder } from '@epam/uui-docs';
import { Day, IconContainer } from '@epam/uui-components';
import { DatePicker } from '@epam/loveship';
import { DatePickerProps } from '@epam/uui';
import { LinkButton, FlexRow } from '@epam/loveship';
import { DefaultContext, FormContext, iEditable, isDisabledDoc, isInvalidDoc, isReadonlyDoc, modeDoc, ResizableContext, sizeDoc, TableContext } from '../../docs';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';

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
    .implements([iEditable, sizeDoc, modeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc])
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
                value: (day: Dayjs, onDayClick: (day: Dayjs) => void) => {
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
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: (day) => false }] })
    .prop('renderFooter', {
        examples: (ctx) => [
            {
                name: 'footer',
                value: () => (
                    <FlexRow padding="18">
                        <LinkButton size="42" caption="TODAY" onClick={ () => ctx.getSelectedProps().onValueChange(dayjs().format('MMM D, YYYY')) } />
                    </FlexRow>
                ),
            },
        ],
    })
    .withContexts(DefaultContext, FormContext, ResizableContext, TableContext);

export default DatePickerDoc;
