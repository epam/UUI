import * as React from 'react';
import dayjs, { Dayjs } from "dayjs";
import { DocBuilder } from '@epam/uui-docs';
import { Day, IconContainer } from '@epam/uui-components';
import { DatePicker, DatePickerProps } from '../DatePicker';
import { LinkButton, FlexRow } from '../../';
import { iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc,
    FormContext, DefaultContext, ResizableContext, TableContext, IHasEditModeDoc } from '../../../docs';
import { ReactComponent as Point } from '../../../icons/radio-point.svg';


const getCustomDay = (day: Dayjs) => {
    return <>
        { day.format('D') }
        <IconContainer style={ { fill: '#fcaa00', height: '4px', width: '4px', position: "absolute", top: '7px', right: '10px' } }  icon={ Point } />
    </>;
};

const DatePickerDoc = new DocBuilder<DatePickerProps>({ name: 'DatePicker', component: DatePicker })
    .implements([iEditable, sizeDoc, IHasEditModeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc])
    .prop('value', { examples: ['2020-09-03'] })
    .prop('placeholder', { examples: ['Enter start date'] })
    .prop('format', { examples: ['MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'], defaultValue: 'MMM D, YYYY' })
    .prop('filter', { examples: [
        {
            name: 'Filter before current day',
            value: day => day.valueOf() >= dayjs().subtract(1, 'day').valueOf(),
        },
    ] })
    .prop('renderDay', { examples: ctx => [{
            name: 'Render custom day',
            value: (day, onDayClick: (day: Dayjs) => void) => {
                return <Day renderDayNumber={ getCustomDay } value={ day } onValueChange={ onDayClick } isSelected={ day && day.isSame(ctx.getSelectedProps().value) } filter={ ctx.getSelectedProps().filter } />;
            },
        }] })
    .prop('placement', {
        examples: [
            'auto-start', 'auto', 'auto-end', 'top-start',
            'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end',
            'bottom', {value: 'bottom-start', isDefault: true }, 'left-end', 'left', 'left-start',
        ],
    })
    .prop('disableClear', { examples: [true], defaultValue: false})
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] })
    .prop('renderFooter', {
        examples: ctx => [
            {
                name: 'footer',
                value: () => <FlexRow><LinkButton size='42' caption='Today' onClick={ () => ctx.getSelectedProps().onValueChange(dayjs().format('MMM D, YYYY')) } /></FlexRow>,
            },
        ],
    })
    .withContexts(DefaultContext, FormContext, TableContext, ResizableContext);

export default DatePickerDoc;
