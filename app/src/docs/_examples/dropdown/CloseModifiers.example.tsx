import React, { useCallback, useState } from 'react';
import {
    Button, DatePicker, Dropdown, DropdownContainer, FlexCell, FlexRow, LabeledInput, PickerInput, TimePicker,
    TimePickerValue, Panel, Text,
} from '@epam/uui';
import { DropdownBodyProps, IDropdownToggler, LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { offset } from '@floating-ui/react';

export default function CloseModifiersExample() {
    const svc = useUuiContext();

    const [createdBy, setCreatedBy] = useState<number | null>(null);
    const [createdWhenDate, setCreatedWhenDate] = useState<string>('');
    const [createdWhenTime, setCreatedWhenTime] = useState<TimePickerValue | null>(null);

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>, ctx: LazyDataSourceApiRequestContext<Person, number>) => {
        return svc.api.demo.persons(request, ctx);
    }, [svc]);

    const personsDs = useLazyDataSource({ api: loadPersons }, []);

    const renderBody = (props: DropdownBodyProps) => (
        <DropdownContainer { ...props } showArrow={ true } width={ 380 }>
            <Panel background="surface-main">
                <FlexRow padding="18" vPadding="24" columnGap="12" alignItems="top">
                    <FlexCell grow={ 1 }>
                        <Text fontSize="18" lineHeight="24" color="primary">Advanced filter</Text>
                    </FlexCell>
                </FlexRow>

                <FlexRow padding="18" columnGap="12">
                    <FlexCell grow={ 1 }>
                        <LabeledInput label="Created by" htmlFor="created-by">
                            <PickerInput
                                id="created-by"
                                dataSource={ personsDs }
                                value={ createdBy }
                                onValueChange={ (v) => setCreatedBy(v) }
                                entityName="person"
                                selectionMode="single"
                                valueType="id"
                                placeholder="Select user"
                                maxItems={ 1 }
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>

                <FlexRow padding="18" vPadding="12" columnGap="12" alignItems="top">
                    <FlexCell grow={ 1 }>
                        <LabeledInput label="Created when (date)" htmlFor="created-when-date">
                            <DatePicker
                                id="created-when-date"
                                value={ createdWhenDate }
                                onValueChange={ (v) => setCreatedWhenDate(v) }
                                format="MMM D, YYYY"
                            />
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <LabeledInput label="Created when (time)" htmlFor="created-when-time">
                            <TimePicker
                                id="created-when-time"
                                value={ createdWhenTime }
                                onValueChange={ (v) => setCreatedWhenTime(v) }
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>

                <FlexRow padding="18" vPadding="24" columnGap="12">
                    <Button
                        color="primary"
                        caption="Apply"
                        onClick={ () => props.onClose() }
                    />
                    <Button
                        fill="outline"
                        color="secondary"
                        caption="Close"
                        onClick={ () => props.onClose() }
                    />
                </FlexRow>
            </Panel>
        </DropdownContainer>
    );

    return (
        <Dropdown
            renderBody={ renderBody }
            renderTarget={ (togglerProps: IDropdownToggler) => (
                <Button caption="Advanced filter" size="36" { ...togglerProps } />
            ) }
            middleware={ [offset(6)] }
            closeOnEscape={ false }
            closeOnClickOutside={ false }
            closeOnTargetClick={ false }
        />
    );
}
