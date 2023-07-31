import React, { useState } from 'react';
import {
    ControlGroup, TextInput, PickerInput, TimePicker,
} from '@epam/promo';
import PrefixComponent from './PrefixComponent/PrefixComponent';
import { useArrayDataSource } from '@epam/uui-core';
import './PrefixesDemoComponent.scss';

const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

export default function BasicExample() {
    const [valueTI, onValueTIChange] = useState(null);
    const [valueTP, onValueTPChange] = useState(null);
    const [multiPickerValue, multiOnValueChange] = useState(null);
    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        [],
    );

    return (
        <>
            <div style={ { marginRight: '20px' } }>
                <ControlGroup>
                    <PrefixComponent text="Level" />
                    <PickerInput
                        dataSource={ dataSource }
                        value={ multiPickerValue }
                        onValueChange={ multiOnValueChange }
                        getName={ (item) => item.level }
                        entityName="Level"
                        selectionMode="multi"
                        valueType="id"
                        sorting={ { field: 'level', direction: 'asc' } }
                    />
                </ControlGroup>

                <ControlGroup>
                    <div style={ { width: '50px' } }>
                        <TextInput value={ valueTI } onValueChange={ onValueTIChange } placeholder="1" />
                    </div>
                    <PrefixComponent text="day of the month" />
                </ControlGroup>

                <ControlGroup>
                    <PrefixComponent text="Time" />
                    <TimePicker value={ valueTP } onValueChange={ onValueTPChange } />
                </ControlGroup>
            </div>

            <div className="leftBlockWrapper">
                <div className="leftBlockTitle">
                    Introduction to the team
                </div>
                <div className="leftBlockText">
                    Sends list of newcomers joined the team during the last month. It can also send surveys to newcomers
                    so they will be able to write introductions which will be included into the monthly email
                </div>
                <div>
                    <div className="whenTitle">
                        When
                    </div>
                    <div style={ { display: 'flex', marginBottom: '6px' } }>
                        <div style={ { marginRight: '5px' } }>
                            <ControlGroup>
                                <div style={ { width: '50px' } }>
                                    <TextInput value={ valueTI } onValueChange={ onValueTIChange } placeholder="1" />
                                </div>
                                <PrefixComponent text="day of the month" />
                            </ControlGroup>
                        </div>
                        <div style={ { width: '80px' } }>
                            <TimePicker value={ valueTP } onValueChange={ onValueTPChange } />
                        </div>
                    </div>
                    <div className="leftBlockText">
                        If it happens to be a weekend, the email will be sent next Monday
                    </div>
                </div>
            </div>

            <div style={ { display: 'flex', margin: '20px' } }>
                <div className="timeBlockTitle">
                    Estimated efforts
                </div>
                <div>
                    <div style={ { display: 'flex' } }>
                        <div style={ { marginRight: '5px' } }>
                            <ControlGroup>
                                <div style={ { width: '50px' } }>
                                    <TextInput value={ valueTI } onValueChange={ onValueTIChange } placeholder="05" />
                                </div>
                                <PrefixComponent text="h" />
                            </ControlGroup>
                        </div>

                        <ControlGroup>
                            <div style={ { width: '50px' } }>
                                <TextInput value={ valueTI } onValueChange={ onValueTIChange } placeholder="00" />
                            </div>
                            <PrefixComponent text="m" />
                        </ControlGroup>
                    </div>
                    <div className="timeBlockDesc">
                        Original estimate: 5h 00m
                    </div>
                </div>
            </div>

        </>
    );
}
