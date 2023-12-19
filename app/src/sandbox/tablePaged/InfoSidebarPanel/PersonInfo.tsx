import React from 'react';
import { Badge, BadgeProps, FlexCell, FlexRow, ScrollBars, Text, TextInput, useForm } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { InfoRow } from './InfoRow';
import { Button } from '@epam/promo';

interface PersonInfoProps {
    data: Person;
    onSave: (state: Person) => Promise<void>;
}

type FormState = Person;

export function PersonInfo({ data, onSave }: PersonInfoProps) {
    const {
        lens, save,
    } = useForm<FormState>({
        value: data,
        onSave,
    });

    return (
        <ScrollBars>
            <FlexRow padding="24">
                <FlexCell shrink={ 0 } width={ 162 }>
                    <Text color="secondary">Name</Text>
                </FlexCell>
                <TextInput { ...lens.prop('name').toProps() } />
            </FlexRow>
            <InfoRow title="Status" value={ <Badge size="24" fill="outline" indicator caption={ data.profileStatus } color={ data.profileStatus.toLowerCase() as BadgeProps['color'] } /> } />
            <InfoRow title="Job Title" value={ data.jobTitle } />
            <InfoRow title="Title Level" value={ data.titleLevel } />
            <InfoRow title="Office" value={ data.officeAddress } />
            <InfoRow title="City" value={ data.cityName } />
            <InfoRow title="Country" value={ data.countryName } />
            <InfoRow title="Manager" value={ data.managerName } />
            <InfoRow title="Hire date" value={ new Date(data.hireDate).toLocaleDateString() } />
            <InfoRow title="Related NPR" value={ data.relatedNPR ? 'Completed' : 'Uncompleted' } />
            <InfoRow title="Department" value={ data.departmentName } />
            <InfoRow title="Email" value={ data.email } />
            <InfoRow title="Modified" value={ new Date(data.modifiedDate).toLocaleDateString() } />
            <InfoRow title="Notes" value={ data.notes || '-' } />
            <InfoRow title="Primary skill" value={ data.primarySkill } />
            <InfoRow title="Production category" value={ data.productionCategory ? 'true' : 'false' } />
            <InfoRow title="UID" value={ data.uid } />
            <InfoRow title="Birth date" value={ new Date(data.birthDate).toLocaleDateString() } />
            
            <Button caption="Save" onClick={ save } />
        </ScrollBars>
    );
}
