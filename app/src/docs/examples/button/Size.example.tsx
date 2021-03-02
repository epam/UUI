import * as React from 'react';
import { Button } from '@epam/promo';

export function SizeExample() {
    return (
        <>
            <Button color='blue' size='48' caption='Caption' />
            <Button color='blue' size='42' caption='Caption' />
            <Button color='blue' size='36' caption='Caption' />
            <Button color='blue' size='30' caption='Caption' />
            <Button color='blue' size='24' caption='Caption' />
        </>
    );
}