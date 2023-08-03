import React from 'react';
import { ScrollBars } from '@epam/promo';
import { PersonGroup } from '@epam/uui-docs';
import { InfoRow } from './InfoRow';

interface PersonGroupInfoProps {
    data: PersonGroup;
}

export function PersonGroupInfo({ data }: PersonGroupInfoProps) {
    return (
        <ScrollBars>
            <InfoRow title="Name" value={ data.name } />
            <InfoRow title="People count" value={ data.count } />
        </ScrollBars>
    );
}
