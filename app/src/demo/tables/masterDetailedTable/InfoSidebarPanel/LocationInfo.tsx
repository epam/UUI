import React from 'react';
import { ScrollBars } from '@epam/promo';
import { Location } from '@epam/uui-docs';
import { InfoRow } from './InfoRow';

interface LocationInfoProps {
    data: Location;
}

export function LocationInfo({ data }: LocationInfoProps) {
    return (
        <ScrollBars>
            <InfoRow title="Name" value={ data.name } />
        </ScrollBars>
    );
}
