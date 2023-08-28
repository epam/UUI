import React from 'react';
import { FlexRow, Button } from '@epam/uui';

export default function StyledButtonsExample() {
    return (
        <div>
            <FlexRow vPadding="12" spacing="12">
                <Button color="primary" caption="Caption" onClick={ () => null } />
                <Button color="negative" caption="Caption" onClick={ () => null } />
                <Button color="accent" caption="Caption" onClick={ () => null } />
                <Button color="secondary" caption="Caption" onClick={ () => null } />
            </FlexRow>

            <FlexRow vPadding="12" spacing="12">
                <Button fill="outline" color="primary" caption="Caption" onClick={ () => null } />
                <Button fill="outline" color="negative" caption="Caption" onClick={ () => null } />
                <Button fill="none" color="accent" caption="Caption" onClick={ () => null } />
                <Button fill="none" color="secondary" caption="Caption" onClick={ () => null } />
            </FlexRow>

            <FlexRow vPadding="12" spacing="12">
                <Button fill="ghost" color="primary" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="negative" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="accent" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="secondary" caption="Caption" onClick={ () => null } />
            </FlexRow>
        </div>
    );
}
