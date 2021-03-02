import * as React from 'react';
import { FlexRow, Button } from '@epam/promo';

export function StyledButtonsExample() {
    return (
        <div>
            <FlexRow vPadding='12' spacing='12' >
                <Button color='blue' caption='Caption' onClick={ () => null } />
                <Button color='red' caption='Caption' onClick={ () => null } />
                <Button color='green' caption='Caption' onClick={ () => null } />
                <Button color='gray50' caption='Caption' onClick={ () => null } />
            </FlexRow>

            <FlexRow vPadding='12' spacing='12' >
                <Button fill='white' color='blue' caption='Caption' onClick={ () => null } />
                <Button fill='white'color='red' caption='Caption' onClick={ () => null } />
                <Button fill='none' color='green' caption='Caption' onClick={ () => null } />
                <Button fill='none' color='gray50' caption='Caption' onClick={ () => null } />
            </FlexRow>

            <FlexRow vPadding='12' spacing='12' >
                <Button fill='light' color='blue' caption='Caption' onClick={ () => null } />
                <Button fill='light' color='red' caption='Caption' onClick={ () => null } />
                <Button fill='light' color='green' caption='Caption' onClick={ () => null } />
                <Button fill='light' color='gray50' caption='Caption' onClick={ () => null } />
            </FlexRow>
        </div>
    );
}